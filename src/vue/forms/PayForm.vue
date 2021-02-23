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
        :former="former"
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
import { BuyAtomicSwapFormer } from '@/js/formers/BuyAtomicSwapFormer'
import { AtomicSwapBidRecord } from '@/js/records/entities/atomic-swap-bid.record'

const EVENTS = {
  reloadAtomicSwap: 'reload-atomic-swap',
}

export default {
  name: 'pay-form',
  components: {
    BuyAtomicSwapForm,
    AddressViewer,
  },
  mixins: [FormMixin],
  props: {
    atomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
    former: {
      type: BuyAtomicSwapFormer,
      default: () => new BuyAtomicSwapFormer(),
    },
  },
  data () {
    return {
      form: {
        email: '',
        quoteAssetCode: '',
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
      vuexTypes.isLoggedIn,
    ]),

    isAtomicSwapBidCreated () {
      return Boolean(this.atomicSwapBidDetails.address)
    },
  },

  created () {
    this.form.email = this.walletEmail
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return

      this.isDisabled = true
      try {
        const opts = this.former.buildOp()
        const { data } = await api.post(
          '/integrations/marketplace/buy',
          opts
        )
        const atomicSwapBid = new AtomicSwapBidRecord(data)

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
