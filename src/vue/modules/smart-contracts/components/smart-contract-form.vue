<template>
  <div>
    <template v-if="isLoaded">
      <form
        id="smart-contract-form"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <p>{{ 'smart-contracts.info-text' | globalize }}</p>
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              name="transfer-asset"
              :value="form.asset.code"
              @input="setAsset"
              :label="'smart-contracts.asset-lbl' | globalize"
              :readonly="formMixin.isDisabled"
            >
              <option
                v-for="asset in assets"
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
            <input-field
              v-model="form.numberOfPersons"
              @blur="touchField('form.numberOfPersons')"
              :disabled="formMixin.isDisabled"
              name="number-of-persons"
              type="number"
              step="1"
              :error-message="getFieldErrorMessage(
                'form.numberOfPersons',
                { from: 1, to: maxNumberOfPersons }
              )"
              :label="'smart-contracts.number-person-lbl' | globalize"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-model="form.amountPerPerson"
              @blur="touchField('form.amountPerPerson')"
              :disabled="formMixin.isDisabled"
              name="amount-per-persons"
              type="number"
              :step="MIN_AMOUNT"
              :error-message="getFieldErrorMessage(
                'form.amountPerPerson',
                { from: MIN_AMOUNT, to: balance.balance }
              )"
              :label="'smart-contracts.amount-lbl' | globalize"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <readonly-field
              :label="'smart-contracts.amount-person' | globalize"
              :value="totalAmount | formatMoney"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <template v-if="formMixin.isConfirmationShown">
            <form-confirmation
              :is-pending="isPending"
              message-id="smart-contracts.confirm-msg"
              @ok="submit"
              @cancel="hideConfirmation"
            />
          </template>
          <button
            v-ripple
            v-if="!formMixin.isConfirmationShown"
            type="submit"
            class="app__form-submit-btn app__button-raised"
            :disabled="formMixin.isDisabled"
            form="smart-contract-form"
          >
            {{ 'smart-contracts.btn-lbl' | globalize }}
          </button>
        </div>
      </form>
    </template>
    <template v-else>
      <loader :message-id="'smart-contracts.loading-msg'" />
    </template>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import Loader from '@/vue/common/Loader'
import config from '@/config'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { MathUtil } from '@/js/utils'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'
import { required, amountRange } from '@validators'

export default {
  name: 'smart-contract-form',
  components: {
    ReadonlyField,
    Loader,
  },
  mixins: [FormMixin],
  data () {
    return {
      isLoaded: false,
      isPending: false,
      MIN_AMOUNT: config.MIN_AMOUNT,
      form: {
        asset: '',
        amountPerPerson: '',
        numberOfPersons: '',
      },
    }
  },
  validations () {
    return {
      form: {
        numberOfPersons: {
          required,
          amountRange: amountRange(1, this.maxNumberOfPersons),
        },
        amountPerPerson: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.balance.balance),
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
      vuexTypes.accountBalanceByCode,
      vuexTypes.transferableAssetsBalancesByOwner,
    ]),
    assets () {
      return this.transferableAssetsBalancesByOwner(this.accountId)
        .filter(i => +i.balance > 0)
        .map(i => i.asset)
    },
    balance () {
      return this.accountBalanceByCode(this.form.asset.code)
    },
    maxNumberOfPersons () {
      try {
        return +MathUtil.divide(this.balance.balance, this.form.amountPerPerson)
      } catch (e) {
        return 0
      }
    },
    totalAmount () {
      try {
        return +MathUtil.multiply(
          this.form.amountPerPerson,
          this.form.numberOfPersons, 1
        )
      } catch (e) {
        return 0
      }
    },
  },
  async created () {
    await this.loadCurrentBalances()
    this.form.asset = this.assets[0]
    this.isLoaded = true
  },
  methods: {
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async submit () {
      try {
        this.isPending = true
        const { data } = await api.get('/integrations/dns/payment-info')
        await api.putWithSignature(
          `/integrations/dns/businesses/${this.accountId}/settings/assets-accrual`,
          {
            data: {
              id: this.form.asset.code,
              type: 'asset-accrual',
              attributes: {
                payment_envelope: api.getTransaction(
                  this.buildPaymentOperation(data.id)
                ),
                asset_code: this.form.asset.code,
                accrual_amount: this.form.amountPerPerson,
              },
            },
          })
        Bus.success('smart-contracts.set-successful')
        this.isPending = false
        this.hideConfirmation()
        this.resetForm()
        Bus.emit('smartContract:setNew')
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
    buildPaymentOperation (recipientAccountId) {
      return base.PaymentBuilder.payment({
        sourceBalanceId: this.balance.id,
        destination: recipientAccountId,
        amount: this.totalAmount + '',
        feeData: {
          sourceFee: {
            percent: '0',
            fixed: '0',
          },
          destinationFee: {
            percent: '0',
            fixed: '0',
          },
          sourcePaysForDest: true,
        },
        subject: '',
        asset: this.form.asset.code,
      })
    },
    setAsset (assetCode) {
      this.form.asset = this.assetByCode(assetCode)
    },
    resetForm () {
      this.clearFields()
      this.form.asset = this.assets[0]
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
</style>
