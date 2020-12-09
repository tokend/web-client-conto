<template>
  <div>
    <div
      class="marketplace-offer-form__asset-description"
      v-if="assetByCode(atomicSwapAsk.baseAssetCode).description"
    >
      <p
        class="marketplace-offer-form__asset-description-lbl"
      >
        {{ 'buy-marketplace-offer-form.asset-description-lbl' | globalize }}:
      </p>
      <p>{{ assetByCode(atomicSwapAsk.baseAssetCode).description }}</p>
    </div>
    <buy-marketplace-offer-form
      v-if="!isMarketplaceOfferBidCreated"
      :atomic-swap-ask="atomicSwapAsk"
      :is-disabled="isDisabled"
      @submitted="handleMarketplaceOfferFormSubmitted"
    />
    <address-viewer
      v-else
      :asset-code="form.quoteAssetCode"
      :amount="marketplaceOfferBidDetails.amount"
      :address="marketplaceOfferBidDetails.address"
      :end-time="marketplaceOfferBidDetails.endTime"
    />
  </div>
</template>

<script>
import BuyMarketplaceOfferForm from '@/vue/forms/BuyMarketplaceOfferForm'
import FormMixin from '@/vue/mixins/form.mixin'
import AddressViewer from '@/vue/common/address-viewer'
import MarketplaceOfferBidMixin from '@/vue/mixins/marketplace-offer-bid.mixin'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ATOMIC_SWAP_BID_TYPES } from '@/js/const/atomic-swap-bid-types.const'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  updateList: 'update-list',
  updateListAndCloseDrawer: 'update-list-and-close-drawer',
}

export default {
  name: 'marketplace-offer-form',
  components: {
    BuyMarketplaceOfferForm,
    AddressViewer,
  },
  mixins: [FormMixin, MarketplaceOfferBidMixin],
  props: {
    atomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
  },
  data () {
    return {
      form: {
        amount: '',
        quoteAssetCode: '',
        paymentMethodId: '',
        promoCode: '',
      },
      isDisabled: false,
      marketplaceOfferBidDetails: {
        address: '',
        endTime: -1,
        amount: '',
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

    isMarketplaceOfferBidCreated () {
      return Boolean(this.marketplaceOfferBidDetails.address)
    },
  },
  methods: {
    async handleMarketplaceOfferFormSubmitted (form) {
      if (!this.isFormValid()) return
      Object.assign(this.form, form)

      this.isDisabled = true
      try {
        // eslint-disable-next-line max-len
        const atomicSwapBid = await this.createAtomicSwapBidOperation(
          this.form.amount,
          this.form.paymentMethodId,
          this.atomicSwapAsk.id,
          this.form.promoCode
        )

        switch (atomicSwapBid.type) {
          case ATOMIC_SWAP_BID_TYPES.redirect:
            window.location.href = atomicSwapBid.payUrl
            break
          case ATOMIC_SWAP_BID_TYPES.cryptoInvoice:
            this.marketplaceOfferBidDetails = atomicSwapBid
            this.$emit(EVENTS.updateList)
            break
          case ATOMIC_SWAP_BID_TYPES.internal:
            await api.signAndSendTransaction(atomicSwapBid.tx)
            Bus.success('buy-marketplace-offer-form.success-msg')
            this.$emit(EVENTS.updateListAndCloseDrawer)
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
  @import '~@/scss/variables';

  .marketplace-offer-form__asset-description {
    margin-bottom: 2.4rem;
  }

  .marketplace-offer-form__asset-description-lbl {
    font-size: 1.2rem;
    color: $col-text-inactive;
  }
</style>
