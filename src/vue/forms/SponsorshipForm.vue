<template>
  <div class="sponsorship-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :value="form.assetCode"
            @input="setAssetCode"
            :label="'sponsorship-form.asset-lbl' | globalize"
            name="sponsorship-form-asset-code"
            @blur="touchField('form.assetCode')"
            :disabled="formMixin.isDisabled"
          >
            <option
              v-for="asset in balancesAssets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.name }}
            </option>
          </select-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="sponsorship-form-amount"
            validation-type="outgoing"
            :max="assetBalance.balance"
            :label="'sponsorship-form.amount-lbl' | globalize"
            :asset="form.assetCode"
            :readonly="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <readonly-field
            :label="'sponsorship-form.total-amount' | globalize"
            :value="totalAmount"
            :error-message="getFieldErrorMessage(
              'totalAmount',
              {
                available: assetBalance.balance,
              }
            )"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="button"
          @click="submit"
          class="app__button-raised sponsorship-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'sponsorship-form.create-contract-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'

import { required, maxValueBig } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { BusinessAssetRecord } from '@/js/records/entities/business-asset.record'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { MathUtil } from '@/js/utils'
import { base } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  contractCreated: 'contract-created',
}

const ROUND_DOWN = 1

export default {
  name: 'sponsorhip-form',
  components: {
    ReadonlyField,
  },

  mixins: [FormMixin],

  props: {
    businessAsset: { type: BusinessAssetRecord, required: true },
  },

  data: _ => ({
    form: {
      assetCode: '',
      amount: '',
    },
  }),

  validations () {
    return {
      form: {
        assetCode: { required },
      },
      totalAmount: {
        noMoreThanAvailableOnBalance: maxValueBig(this.assetBalance.balance),
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.balancesAssets,
      vuexTypes.accountBalanceByCode,
      vuexTypes.accountId,
    ]),

    assetBalance () {
      return this.accountBalanceByCode(this.form.assetCode)
    },

    totalAmount () {
      return MathUtil.multiply(
        this.businessAsset.holders,
        this.form.amount || 0,
        ROUND_DOWN
      )
    },
  },

  created () {
    this.form.assetCode = this.balancesAssets[0].code
  },

  methods: {
    setAssetCode (code) {
      this.form.assetCode = code
    },

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const contract = this.buildContract()
        await api.postWithSignature('/integrations/sponsorship/contracts', contract)
        const { data: paymentAccount } = await api.getWithSignature('/integrations/sponsorship/info')
        const paymentOperation = this.buildPaymentOperation(paymentAccount.id)
        await api.postOperations(paymentOperation)

        Bus.success('sponsorship-form.create-contract-successful')
        this.$emit(EVENTS.contractCreated)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },

    buildContract () {
      return {
        consumer_business: this.businessAsset.owner,
        consumers_asset: this.businessAsset.asset.code,
        sponsor_asset: this.form.assetCode,
        sponsor_business: this.accountId,
        sponsor_amount: this.form.amount,
        max_users_count: this.businessAsset.holders,
      }
    },

    buildPaymentOperation (paymentAccount) {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.assetBalance.id,
        destination: paymentAccount,
        amount: this.totalAmount,
        feeData: {
          sourceFee: {
            percent: '0',
            fixed: '0',
          },
          destinationFee: {
            percent: '0',
            fixed: '0',
          },
          sourcePaysForDest: false,
        },
        subject: '',
        asset: this.form.assetCode,
      })
    },
  },

}
</script>

<style lang="scss">
@import './app-form';

</style>