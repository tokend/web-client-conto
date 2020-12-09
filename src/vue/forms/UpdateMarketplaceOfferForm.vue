<template>
  <form
    novalidate
    class="app__form update-marketplace-offer-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.amount"
          name="update-marketplace-offer-amount"
          :max="maxAmount"
          :min="marketplaceOfferAsk.amount"
          :label="'update-marketplace-offer-form.amount-lbl' | globalize"
          :asset="marketplaceOfferAsk.baseAssetCode"
          :disabled="formMixin.isDisabled"
          is-max-button-shown
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.price"
          type="number"
          :step="minPrice"
          :max="MAX_PRICE"
          :min="minPrice"
          @blur="touchField('form.price')"
          name="update-marketplace-offer-quote-asset-price"
          :label="'update-marketplace-offer-form.price-lbl' | globalize({
            asset: statsQuoteAsset.code
          })"
          :error-message="getFieldErrorMessage('form.price', {
            maxValue: MAX_PRICE,
            minValue: minPrice
          })"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <button
      v-ripple
      class="app__button-raised update-marketplace-offer-form__update-btn"
      :disabled="formMixin.isDisabled || (!isPriceChanged && !isAmountChanged)"
      type="submit"
    >
      {{ 'update-marketplace-offer-form.update-btn' | globalize }}
    </button>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import MarketplaceOfferBidMixin from '@/vue/mixins/marketplace-offer-ask.mixin'
import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { MarketplaceOfferAskRecord } from '@/js/records/entities/marketplace-offer-ask.record'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  minValue,
  maxValue,
  required,
} from '@validators'
import { amountToPrecision } from '@/js/helpers/amount'
import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  updatedMarketplaceOffer: 'updated-marketplace-offer',
}

export default {
  name: 'update-marketplace-offer-form',
  mixins: [FormMixin, MarketplaceOfferBidMixin],
  props: {
    marketplaceOfferAsk: { type: MarketplaceOfferAskRecord, required: true },
  },
  data: _ => ({
    form: {
      amount: '',
      price: '',
    },
    MAX_PRICE: config.MAX_AMOUNT,
  }),

  validations () {
    return {
      form: {
        price: {
          required,
          minValue: minValue(this.minPrice),
          maxValue: maxValue(this.MAX_PRICE),
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

    isPriceChanged () {
      return +this.form.price !== +this.marketplaceOfferAsk.price
    },

    isAmountChanged () {
      return +this.form.amount !== +this.marketplaceOfferAsk.amount
    },

    maxAmount () {
      return MathUtil.add(
        this.accountBalanceByCode(
          this.marketplaceOfferAsk.baseAssetCode
        ).balance,
        this.marketplaceOfferAsk.amount
      )
    },
  },

  created () {
    this.populateForm()
    this.loadAccountBalances()
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    populateForm () {
      this.form = {
        amount: amountToPrecision(
          this.marketplaceOfferAsk.amount,
          this.assetByCode(
            this.marketplaceOfferAsk.baseAssetCode
          ).trailingDigitsCount
        ),
        price: amountToPrecision(
          this.marketplaceOfferAsk.price,
          this.statsQuoteAsset.trailingDigitsCount
        ),
      }
    },

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      const amount = this.isAmountChanged
        ? MathUtil.subtract(this.form.amount, this.marketplaceOfferAsk.amount)
        : ''
      const price = this.isPriceChanged ? this.form.price : ''

      try {
        await this.updateMarketplaceOfferAsk({
          marketplaceOfferId: this.marketplaceOfferAsk.id,
          baseAssetCode: this.marketplaceOfferAsk.baseAssetCode,
          amount: amount,
          price: price,
        })
        Bus.success('update-marketplace-offer-form.updated-marketplace-offer-msg')
        this.$emit(EVENTS.updatedMarketplaceOffer)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.update-marketplace-offer-form__update-btn {
  margin-top: 5rem;
}
</style>
