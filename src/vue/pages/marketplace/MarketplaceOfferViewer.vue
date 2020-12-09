<template>
  <div class="marketplace-offer-viewer">
    <marketplace-offer-attributes :atomic-swap-ask="currentAtomicSwapAsk" />
    <template v-if="isMarketplaceOfferOwner">
      <marketplace-offer-actions
        :atomic-swap-ask="currentAtomicSwapAsk"
        @close-drawer-and-update-list="$emit(EVENTS.closeDrawerAndUpdateList)"
      />
      <marketplace-offer-requests :atomic-swap-ask="currentAtomicSwapAsk" />
    </template>
  </div>
</template>

<script>
import MarketplaceOfferAttributes from './MarketplaceOfferAttributes'
import MarketplaceOfferRequests from './MarketplaceOfferRequests'
import MarketplaceOfferActions from './MarketplaceOfferActions'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

export default {
  name: 'marketplace-offer-viewer',

  components: {
    MarketplaceOfferAttributes,
    MarketplaceOfferActions,
    MarketplaceOfferRequests,
  },

  props: {
    currentAtomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
  },

  data () {
    return {
      EVENTS,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
    isMarketplaceOfferOwner () {
      return this.currentAtomicSwapAsk.ownerId === this.accountId
    },
  },
}
</script>
