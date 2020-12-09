<template>
  <div class="marketplace-offer-viewer">
    <marketplace-offer-attributes
      :marketplace-offer-ask="currentMarketplaceOfferAsk"
    />
    <template v-if="isMarketplaceOfferOwner">
      <marketplace-offer-actions
        :marketplace-offer-ask="currentMarketplaceOfferAsk"
        @close-drawer-and-update-list="$emit(EVENTS.closeDrawerAndUpdateList)"
      />
      <marketplace-offer-requests
        :marketplace-offer-ask="currentMarketplaceOfferAsk"
      />
    </template>
  </div>
</template>

<script>
import MarketplaceOfferAttributes from './MarketplaceOfferAttributes'
import MarketplaceOfferRequests from './MarketplaceOfferRequests'
import MarketplaceOfferActions from './MarketplaceOfferActions'
import { MarketplaceOfferAskRecord } from '@/js/records/entities/marketplace-offer-ask.record'
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
    currentMarketplaceOfferAsk: {
      type: MarketplaceOfferAskRecord,
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
      return this.currentMarketplaceOfferAsk.ownerId === this.accountId
    },
  },
}
</script>
