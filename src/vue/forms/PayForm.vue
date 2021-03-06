<template>
  <div>
    <form
      v-if="!isAtomicSwapBidCreated"
      novalidate
      class="pay-form app__form"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.email"
            @blur="touchField('form.email')"
            name="pay-email"
            :disabled="isLoggedIn"
            :label="'pay-form.email-lbl' | globalize(
              {
                appName: config.APP_NAME,
              }
            )"
            :error-message="getFieldErrorMessage('form.email', {
              length: MAX_FIELD_LENGTH.email
            })"
          />
        </div>
      </div>

      <buy-atomic-swap-form
        class="pay-form__atomic-swap-bid"
        @submitted="submit"
        :is-disabled="isDisabled"
        :atomic-swap-ask="atomicSwapAsk"
      />
    </form>

    <address-viewer
      v-else
      :asset-code="form.quoteAssetCode"
      :amount="atomicSwapBidDetails.amount"
      :address="atomicSwapBidDetails.address"
      :end-time="atomicSwapBidDetails.endTime"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import BuyAtomicSwapForm from '@/vue/forms/BuyAtomicSwapForm'
import AddressViewer from '@/vue/common/address-viewer'
import AtomicSwapBidMixin from '@/vue/mixins/atomic-swap-bid.mixin'
import config from '@/config'

import { required, email, maxLength } from '@validators'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ATOMIC_SWAP_BID_TYPES } from '@/js/const/atomic-swap-bid-types.const'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

const EVENTS = {
  reloadAtomicSwap: 'reload-atomic-swap',
}

export default {
  name: 'pay-form',
  components: {
    BuyAtomicSwapForm,
    AddressViewer,
  },
  mixins: [FormMixin, AtomicSwapBidMixin],
  props: { atomicSwapAsk: { type: AtomicSwapAskRecord, required: true } },
  data () {
    return {
      form: {
        email: '',
        amount: '',
        quoteAssetCode: '',
        paymentMethodId: '',
        promoCode: '',
      },
      isDisabled: false,
      atomicSwapBidDetails: {
        address: '',
        endTime: -1,
        amount: '',
      },
      config,
      MAX_FIELD_LENGTH,
    }
  },

  validations () {
    return {
      form: {
        email: {
          required,
          email,
          maxLength: maxLength(MAX_FIELD_LENGTH.email),
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.walletEmail,
    ]),

    isAtomicSwapBidCreated () {
      return Boolean(this.atomicSwapBidDetails.address)
    },
  },

  created () {
    this.form.email = this.walletEmail
  },

  methods: {
    async submit (form) {
      if (!this.isFormValid()) return
      Object.assign(this.form, form)

      this.isDisabled = true
      try {
        // eslint-disable-next-line max-len
        const atomicSwapBid = await this.createAtomicSwapBidOperation(
          this.form.amount,
          this.form.paymentMethodId,
          this.atomicSwapAsk.id,
          this.form.promoCode,
          this.form.email
        )
        switch (atomicSwapBid.type) {
          case ATOMIC_SWAP_BID_TYPES.redirect:
            window.location.href = atomicSwapBid.payUrl
            break
          case ATOMIC_SWAP_BID_TYPES.cryptoInvoice:
            this.atomicSwapBidDetails = atomicSwapBid
            break
          case ATOMIC_SWAP_BID_TYPES.internal:
            await api.signAndSendTransaction(atomicSwapBid.tx)
            Bus.success('pay-form.success-msg')
            this.$emit(EVENTS.reloadAtomicSwap)
            break
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDisabled = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';

  .pay-form__atomic-swap-bid {
    margin-top: 2.4rem;
  }
</style>
