<template>
  <form
    novalidate
    class="app__form update-atomic-swap-form"
    @submit.prevent="submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.amount"
          name="update-atomic-swap-amount"
          :validation-type="VALIDATION_TYPES.outgoing"
          :label="'update-atomic-swap-form.amount-lbl' | globalize"
          :asset="atomicSwapAsk.baseAssetCode"
          :disabled="formMixin.isDisabled"
          is-max-button-shown
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.price"
          name="update-atomic-swap-quote-asset-price"
          :label="'update-atomic-swap-form.price-lbl' | globalize({
            asset: statsQuoteAsset.code
          })"
          :asset="statsQuoteAsset.code"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import AtomicSwapAskMixin from '@/vue/mixins/atomic-swap-ask.mixin'
import {
  required,
} from '@validators'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'

const EVENTS = {
  updatedAtomicSwap: 'updated-atomic-swap',
}

const VALIDATION_TYPES = {
  outgoing: 'outgoing',
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
    VALIDATION_TYPES,
  }),

  validations () {
    return {
      form: {
        amount: {
          required,
        },
        price: {
          required,
        },
      },
    }
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      try {
        await this.createAtomicSwapAsk(
          this.atomicSwapAsk.baseAssetCode,
          this.form.amount,
          this.form.price,
        )
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
</style>
