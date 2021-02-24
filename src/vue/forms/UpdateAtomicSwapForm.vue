<template>
  <form
    novalidate
    class="app__form update-atomic-swap-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.amount"
          name="update-atomic-swap-amount"
          :max="maxAmount"
          :min="former.attrs.amountToSell"
          :label="'update-atomic-swap-form.amount-lbl' | globalize"
          :asset="former.attrs.assetCode"
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
          @change="former.setAttr('price', form.price)"
          name="update-atomic-swap-quote-asset-price"
          :label="'update-atomic-swap-form.price-lbl' | globalize({
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
      class="app__button-raised update-atomic-swap-form__update-btn"
      :disabled="formMixin.isDisabled || (!isPriceChanged && !isAmountChanged)"
      type="submit"
    >
      {{ 'update-atomic-swap-form.update-btn' | globalize }}
    </button>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import config from '@/config'
import { api } from '@/api'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AtomicSwapFormer } from '@/js/formers/AtomicSwapFormer'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  minValue,
  maxValue,
  required,
} from '@validators'
import { amountToPrecision } from '@/js/helpers/amount'
import { MathUtil } from '@/js/utils/math.util'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'

const EVENTS = {
  updatedAtomicSwap: 'updated-atomic-swap',
}

export default {
  name: 'update-atomic-swap-form',
  mixins: [FormMixin],
  props: {
    former: { type: AtomicSwapFormer, required: true },
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
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountBalanceByCode,
    ]),

    isPriceChanged () {
      return +this.form.price !== +this.former.attrs.price
    },

    isAmountChanged () {
      return +this.form.amount !== +this.former.attrs.amountToSell
    },

    maxAmount () {
      return MathUtil.add(
        this.accountBalanceByCode(this.former.attrs.assetCode).balance,
        this.former.attrs.amountToSell
      )
    },

    minPrice () {
      return this.statsQuoteAsset.trailingDigitsCount
        ? inputStepByDigitsCount(this.statsQuoteAsset.trailingDigitsCount)
        : inputStepByDigitsCount(config.DECIMAL_POINTS)
    },
  },

  created () {
    this.form = {
      amount: amountToPrecision(
        this.former.attrs.amountToSell,
        this.assetByCode(this.former.attrs.assetCode).trailingDigitsCount
      ),
      price: amountToPrecision(
        this.former.attrs.price,
        this.statsQuoteAsset.trailingDigitsCount
      ),
    }
    this.loadAccountBalances()
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      const amount = this.isAmountChanged
        ? MathUtil.subtract(this.form.amount, this.former.attrs.amountToSell)
        : '0'
      this.former.setAttr('amountToSell', amount)

      try {
        const attributes = await this.former.buildOps()
        await api.patchWithSignature(`/integrations/marketplace/offers/${this.former.attrs.requestId}`, {
          data: {
            type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
            attributes: attributes,
          },
        })
        Bus.success('update-atomic-swap-form.updated-atomic-swap-msg')
        this.$emit(EVENTS.updatedAtomicSwap)
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

.update-atomic-swap-form__update-btn {
  margin-top: 5rem;
}
</style>
