<template>
  <div>
    <div
      class="atomic-swap__asset-description"
      v-if="assetByCode(atomicSwapAsk.baseAssetCode).description"
    >
      <p
        class="atomic-swap__asset-description-lbl"
      >
        {{ 'buy-atomic-swap-form.asset-description-lbl' | globalize }}:
      </p>
      <p>{{ assetByCode(atomicSwapAsk.baseAssetCode).description }}</p>
    </div>
    <buy-atomic-swap-form
      v-if="!isAtomicSwapBidCreated"
      :atomic-swap-ask="atomicSwapAsk"
      :former="former"
      :is-disabled="isDisabled"
      @submitted="handleAtomicSwapFormSubmitted"
    />
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
import BuyAtomicSwapForm from '@/vue/forms/BuyAtomicSwapForm'
import FormMixin from '@/vue/mixins/form.mixin'
import AddressViewer from '@/vue/common/address-viewer'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ATOMIC_SWAP_BID_TYPES } from '@/js/const/atomic-swap-bid-types.const'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { AtomicSwapBidRecord } from '@/js/records/entities/atomic-swap-bid.record'
import { BuyAtomicSwapFormer } from '@/js/formers/BuyAtomicSwapFormer'

const EVENTS = {
  updateList: 'update-list',
  updateListAndCloseDrawer: 'update-list-and-close-drawer',
}

export default {
  name: 'atomic-swap',
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
        quoteAssetCode: '',
      },
      isDisabled: false,
      atomicSwapBidDetails: {
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

    isAtomicSwapBidCreated () {
      return Boolean(this.atomicSwapBidDetails.address)
    },
  },
  methods: {
    async handleAtomicSwapFormSubmitted () {
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
            this.$emit(EVENTS.updateList)
            break
          case ATOMIC_SWAP_BID_TYPES.internal:
            await api.signAndSendTransaction(atomicSwapBid.tx)
            Bus.success('buy-atomic-swap-form.success-msg')
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

  .atomic-swap__asset-description {
    margin-bottom: 2.4rem;
  }

  .atomic-swap__asset-description-lbl {
    font-size: 1.2rem;
    color: $col-text-inactive;
  }
</style>
