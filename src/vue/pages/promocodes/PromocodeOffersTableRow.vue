<template>
  <tr>
    <template v-if="isLoaded">
      <td :title="offer.baseAssetName">
        {{ offer.baseAssetName }}
      </td>

      <td :title="offer.amount | formatMoney">
        {{ offer.amount | formatBalance }}
      </td>

      <td :title="offer.price | formatMoney">
        {{ offer.price | formatMoney }} {{ offer.priceAsset }}
      </td>
    </template>
    <template v-else-if="isLoading">
      <td v-for="item in 3" :key="item">
        <skeleton-loader
          template="smallString"
        />
      </td>
    </template>
  </tr>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'

export default {
  name: 'promocode-offers-table-row',

  components: {
    SkeletonLoader,
  },

  props: {
    offerId: {
      type: String,
      required: true,
    },
  },

  data: _ => ({
    offer: {},
    isLoaded: false,
    isLoading: false,
  }),

  async created () {
    await this.loadOffer()
    this.isLoaded = true
  },

  methods: {
    async loadOffer () {
      this.isLoading = true
      try {
        const { data } = await api.get(`/integrations/marketplace/offers/${this.offerId}`)
        this.offer = new AtomicSwapAskRecord(data)
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoading = false
    },
  },
}
</script>
