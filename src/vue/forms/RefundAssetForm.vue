<template>
  <div class="refund-asset-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.price"
            name="refund-asset-form-price"
            :label="'refund-asset-form.price-lbl' | globalize({
              quoteAsset: statsQuoteAsset.code
            })"
            :asset="statsQuoteAsset.code"
            :disabled="true"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="refund-asset-form-amount"
            :max="buyOrder.baseAmount"
            :label="'refund-asset-form.amount-lbl' | globalize"
            :asset="assetCode"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <readonly-field
            :label="'refund-asset-form.total-amount' | globalize"
            :value="`${formatMoney(totalAmount)} ${statsQuoteAsset.code}`"
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
          {{ 'refund-asset-form.refund-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import BuybackAndRefundAssetMixin from '@/vue/mixins/buyback-and-refund-asset.mixin'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { amountToPrecision } from '@/js/helpers/amount'
import { MathUtil } from '@/js/utils'
import { formatMoney } from '@/vue/filters/formatMoney'
import { BuyOrderRecord } from '@/js/records/entities/buy-order.record'

const EVENTS = {
  operationSubmitted: 'operation-submitted',
}

export default {
  name: 'refund-asset-form',
  components: {
    ReadonlyField,
  },
  mixins: [FormMixin, BuybackAndRefundAssetMixin],

  props: {
    assetCode: { type: String, required: true },
    buyOrder: { type: BuyOrderRecord, default: () => {} },
  },

  data: _ => ({
    form: {
      price: '',
      amount: '',
    },
    isFormSubmitting: false,
    formatMoney,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

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
  },

  created () {
    this.form.price = amountToPrecision(
      this.buyOrder.price,
      this.statsQuoteAsset.precision
    )
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const operation = this.createOffer(
          this.form.amount,
          this.form.price,
          false,
          this.assetCode
        )
        await api.postOperations(operation)
        this.$emit(EVENTS.operationSubmitted)
        Bus.success('refund-asset-form.asset-sold-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },

}
</script>

<style lang="scss">
@import './app-form';

</style>
