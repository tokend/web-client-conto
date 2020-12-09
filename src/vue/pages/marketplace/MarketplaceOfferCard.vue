<template>
  <div class="marketplace-offer-card">
    <card>
      <card-logo
        slot="media"
        :img-url="asset.logoUrl"
        :logo-text="asset.name"
      />
      <template slot="header">
        {{ marketplaceOfferAsk.baseAssetName }}
      </template>
      <template slot="accent-title">
        <span :title="marketplaceOfferAsk.price | formatMoney">
          {{ marketplaceOfferAsk.price | formatMoney }}
          {{ statsQuoteAsset.code }}
        </span>
      </template>
      <template slot="content">
        {{ asset.description }}
      </template>
      <template slot="actions">
        <button
          v-if="marketplaceOfferAsk.ownerId !== accountId"
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.buy)"
        >
          {{ 'marketplace-offer-card.buy-lbl' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.vueDetails)"
        >
          {{ 'marketplace-offer-card.details-lbl' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'
import { MarketplaceOfferAskRecord } from '@/js/records/entities/marketplace-offer-ask.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  buy: 'buy',
  vueDetails: 'vue-details',
}

export default {
  name: 'marketplace-offer-card',
  components: {
    Card,
    CardLogo,
  },

  props: {
    marketplaceOfferAsk: {
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
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountId,
    ]),
    asset () {
      return this.assetByCode(this.marketplaceOfferAsk.baseAssetCode)
    },
  },
}
</script>
