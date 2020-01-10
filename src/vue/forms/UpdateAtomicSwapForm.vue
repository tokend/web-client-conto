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
          validation-type="outgoing"
          :label="'update-atomic-swap-form.amount-lbl' | globalize"
          :asset="atomicSwapAsk.baseAssetCode"
          :disabled="formMixin.isDisabled"
          is-max-button-shown
          :error-message="getFieldErrorMessage('form.amount', {
            minValue: atomicSwapAsk.amount
          })"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.price"
          type="number"
          :step="inputStep"
          :max="MAX_AMOUNT"
          :min="MIN_AMOUNT"
          @blur="touchField('form.price')"
          name="update-atomic-swap-quote-asset-price"
          :label="'update-atomic-swap-form.price-lbl' | globalize({
            asset: statsQuoteAsset.code
          })"
          :error-message="getFieldErrorMessage('form.price', {
            maxValue: MAX_AMOUNT,
            minValue: MIN_AMOUNT
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
import AtomicSwapAskMixin from '@/vue/mixins/atomic-swap-ask.mixin'
import config from '@/config'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  minValue,
  maxValue,
  required,
} from '@validators'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import { formatMoney } from '@/vue/filters/formatMoney'
import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  updatedAtomicSwap: 'updated-atomic-swap',
}

export default {
  name: 'update-atomic-swap-form',

  mixins: [FormMixin, AtomicSwapAskMixin],

  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
  },

  data: _ => ({
    form: {
      amount: '',
      price: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
  }),

  validations () {
    return {
      form: {
        amount: {
          minValue: minValue(this.atomicSwapAsk.amount),
        },
        price: {
          required,
          minValue: minValue(this.MIN_AMOUNT),
          maxValue: maxValue(this.MAX_AMOUNT),
        },
      },
    }
  },

  computed: {
    isPriceChanged () {
      return +this.form.price !== +this.atomicSwapAsk.price
    },

    isAmountChanged () {
      return +this.form.amount !== +this.atomicSwapAsk.amount
    },

    inputStep () {
      return inputStepByDigitsCount(config.DECIMAL_POINTS)
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
        amount: formatMoney(this.atomicSwapAsk.amount),
        price: formatMoney(this.atomicSwapAsk.price),
      }
    },

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      let amount = this.isAmountChanged
        ? MathUtil.subtract(this.form.amount, this.atomicSwapAsk.amount)
        : ''
      const price = this.isPriceChanged ? this.form.price : ''

      try {
        await this.updateAtomicSwapAsk({
          atomicSwapId: this.atomicSwapAsk.id,
          baseAssetCode: this.atomicSwapAsk.baseAssetCode,
          amount: amount,
          price: price,
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
