<template>
  <div class="buyback-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.price"
            name="buyback-form-price"
            :label="'buyback-form.price-lbl' | globalize({
              quoteAsset: statsQuoteAsset.code
            })"
            :asset="statsQuoteAsset.code"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="buyback-form-amount"
            :label="'buyback-form.amount-lbl' | globalize"
            :asset="assetCode"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <readonly-field
            :label="'buyback-form.total-amount' | globalize"
            :value="`${formatMoney(totalAmount)} ${statsQuoteAsset.code}`"
            :error-message="getFieldErrorMessage(
              'totalAmount',
              {
                available: statsQuoteAssetBalance,
              }
            )"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          :disabled="formMixin.isDisabled || !isTotalAmountExists"
          class="app__button-raised buyback-form__submit-btn"
        >
          {{ (isUpdateMode
            ? 'buyback-form.update-buyback-btn'
            : 'buyback-form.create-buyback-btn')
            | globalize
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import BuybackAndRefundAssetMixin from '@/vue/mixins/buyback-and-refund-asset.mixin'

import { maxValueBig } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { amountToPrecision } from '@/js/helpers/amount'
import { MathUtil } from '@/js/utils'
import { formatMoney } from '@/vue/filters/formatMoney'
import { BuybackOfferRecord } from '@/js/records/entities/buyback-offer.record'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'buyback-form',
  components: {
    ReadonlyField,
  },
  mixins: [FormMixin, BuybackAndRefundAssetMixin],

  props: {
    assetCode: { type: String, required: true },
    buybackOffer: { type: BuybackOfferRecord, default: () => {} },
  },

  data: _ => ({
    form: {
      price: '',
      amount: '',
    },
    isFormSubmitting: false,
    formatMoney,
  }),

  validations () {
    return {
      totalAmount: {
        noMoreThanAvailableOnBalance: maxValueBig(
          this.statsQuoteAssetBalance
        ),
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

    isUpdateMode () {
      return Boolean(this.buybackOffer.id)
    },

    totalAmount () {
      return MathUtil.multiply(
        this.form.price || 0,
        this.form.amount || 0,
        MathUtil.roundingModes.ROUND_DOWN
      )
    },

    isTotalAmountExists () {
      return Boolean(+this.totalAmount)
    },

    statsQuoteAssetBalance () {
      return this.accountBalanceByCode(this.statsQuoteAsset.code).balance
    },
  },

  created () {
    if (this.isUpdateMode) {
      this.form.amount = amountToPrecision(
        this.buybackOffer.baseAmount,
        this.assetByCode(this.assetCode).precision
      )
      this.form.price = amountToPrecision(
        this.buybackOffer.price,
        this.statsQuoteAsset.precision
      )
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const operations = await this.getOfferOperations()
        await api.postOperations(...operations)
        this.$emit(EVENTS.operationSubmitted)
        if (this.isUpdateMode) {
          Bus.success('buyback-form.offer-updated-msg')
        } else {
          Bus.success('buyback-form.offer-created-msg')
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },

    async getOfferOperations () {
      let operations = []

      if (this.buybackOffer.id) {
        operations.push(this.cancelOffer(
          this.buybackOffer.id,
          this.assetCode
        ))
      }

      operations.push(this.createOffer(
        this.form.amount,
        this.form.price,
        true,
        this.assetCode
      ))

      return operations
    },
  },

}
</script>

<style lang="scss">
@import './app-form';

</style>
