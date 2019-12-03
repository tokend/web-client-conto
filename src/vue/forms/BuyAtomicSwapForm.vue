<template>
  <div class="buy-atomic-swap-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :label="'buy-atomic-swap-form.asset-in-which-buying' | globalize"
            name="buy-atomic-swap-quote-asset"
            :value="form.quoteAssetCode"
            @input="setQuoteAssetCode"
            :disabled="isDisabled"
            class="app__select"
          >
            <option
              v-for="quoteAsset in atomicSwapAsk.quoteAssets"
              :key="quoteAsset.asset.code"
              :value="quoteAsset.asset.code"
            >
              {{ quoteAsset.asset.name }}
            </option>
          </select-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <amount-input-field
            v-model="form.amount"
            name="buy-atomic-swap-amount"
            :asset="assetByCode(atomicSwapAsk.baseAssetCode)"
            :max="atomicSwapAsk.amount"
            :label="'buy-atomic-swap-form.amount' | globalize({
              asset: atomicSwapAsk.baseAssetName
            })"
            :disabled="isDisabled"
          />
          <p class="app__form-field-description">
            {{ 'buy-atomic-swap-form.available' | globalize({
              amount: atomicSwapAsk.amount,
              asset: '',
            }) }}
          </p>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.promoCode"
            name="buy-atomic-swap-promo-code"
            :label="'buy-atomic-swap-form.promo-code-lbl' | globalize"
            @blur="touchField('form.promoCode')"
            :error-message="getFieldErrorMessage('form.promoCode')"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <!-- eslint-disable max-len -->
          <readonly-field
            class="buy-atomic-swap-form__price"
            :label="'buy-atomic-swap-form.price' | globalize"
            :value="`${formatMoney(atomicSwapAsk.price)} ${statsQuoteAsset.code}`"
          />
          <!-- eslint-enable max-len -->

          <readonly-field
            v-if="isDiscountExist"
            class="buy-atomic-swap-form__discount"
            :label="'buy-atomic-swap-form.discount' | globalize"
            :value="`${formatPercent(discount)}`"
          />

          <readonly-field
            :label="'buy-atomic-swap-form.total-price' | globalize"
            :value="isLoadingDiscount
              ? `${globalize('buy-atomic-swap-form.calculating-msg')}`
              :`${formatMoney(totalPrice)} ${statsQuoteAsset.code}`
            "
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          :disabled="isDisabled"
          class="app__button-raised buy-atomic-swap-form__btn"
        >
          <template>
            {{ 'buy-atomic-swap-form.buy' | globalize }}
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ReadonlyField from '@/vue/fields/ReadonlyField'
import config from '@/config'
import debounce from 'lodash/debounce'

import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { formatMoney } from '@/vue/filters/formatMoney'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import {
  amountRange,
  required,
} from '@validators'
import { globalize } from '@/vue/filters/globalize'
import { formatPercent } from '@/vue/filters/formatPercent'

const PROMOCODE_ERROR_FIELD = 'promocode'
const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'buy-atomic-swap-form',
  components: {
    ReadonlyField,
  },
  mixins: [FormMixin],
  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
    isDisabled: { type: Boolean, default: false },
  },
  data () {
    return {
      config,
      form: {
        amount: '',
        quoteAssetCode: '',
        paymentMethodId: '',
        promoCode: '',
      },
      discount: '',
      totalPrice: '',
      isLoadingDiscount: false,
      isPromoCodeExist: false,
      globalize,
    }
  },
  validations () {
    return {
      form: {
        amount: {
          amountRange: amountRange(
            config.MIN_AMOUNT,
            this.atomicSwapAsk.amount
          ),
          required,
        },
        promoCode: this.form.promoCode && this.form.amount
          ? { promoCodeNotExist: () => this.isPromoCodeExist }
          : {},
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.statsQuoteAsset,
    ]),

    isDiscountExist () {
      return Boolean(+this.discount)
    },
  },
  watch: {
    form: {
      deep: true,
      handler: function () {
        this.totalPrice = 0
        this.discount = 0
        this.debounceCalculateDiscountPrice()
      },
    },
  },
  created () {
    this.setQuoteAssetCode(this.atomicSwapAsk.quoteAssets[0].asset.code)
    this.debounceCalculateDiscountPrice = debounce(
      this.calculateDiscountPrice,
      300
    )
  },
  methods: {
    formatMoney,
    formatPercent,

    submit () {
      this.$emit(EVENTS.submitted, this.form)
    },

    setQuoteAssetCode (code) {
      this.form.quoteAssetCode = code
      this.form.paymentMethodId = this.atomicSwapAsk
        .getPaymentMethodIdByAssetCode(code)
    },

    async calculateDiscountPrice () {
      this.isLoadingDiscount = true
      try {
        const { data } = await api.get('/integrations/marketplace/calculate-price', {
          'offer': this.atomicSwapAsk.id,
          'amount': this.form.amount,
          'payment-method': this.form.paymentMethodId,
          'promocode': this.form.promoCode,
        })
        this.discount = data.discount
        this.totalPrice = data.totalPrice

        if (this.form.promoCode) {
          this.isPromoCodeExist = true
        }
      } catch (error) {
        if (error.meta.field === PROMOCODE_ERROR_FIELD) {
          this.isPromoCodeExist = false
        }
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLoadingDiscount = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';

  .buy-atomic-swap-form__price,
  .buy-atomic-swap-form__discount {
    margin-bottom: 0.5rem;
  }

  .buy-atomic-swap-form__btn {
    max-width: 14rem;
    width: 100%;
  }
</style>
