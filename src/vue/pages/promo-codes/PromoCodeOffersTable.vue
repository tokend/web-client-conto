<template>
  <div class="promo-code-offers-table">
    <h3 class="promo-code-offers-table__offers-title">
      {{ 'promo-code-offers-table.offers-title' | globalize }}
    </h3>

    <div class="app__table">
      <table>
        <thead>
          <tr>
            <th :title="'promo-code-offers-table.name-th' | globalize">
              {{ 'promo-code-offers-table.name-th' | globalize }}
            </th>
            <th :title="'promo-code-offers-table.amount-th' | globalize">
              {{ 'promo-code-offers-table.amount-th' | globalize }}
            </th>
            <th :title="'promo-code-offers-table.price-th' | globalize">
              {{ 'promo-code-offers-table.price-th' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody v-if="promoCodeOffers.length">
          <tr
            v-for="offer in promoCodeOffers"
            :key="offer.id"
          >
            <td :title="offer.baseAssetName">
              {{ offer.baseAssetName }}
            </td>

            <td :title="offer.amount | formatMoney">
              {{ offer.amount | formatBalance }}
            </td>

            <td :title="offer.price | formatMoney">
              {{ offer.price | formatMoney }} {{ offer.priceAsset }}
            </td>
          </tr>
        </tbody>

        <empty-tbody-placeholder
          v-else-if="isLoaded"
          :colspan="3"
          :message="'promo-code-offers-table.no-data-msg' | globalize"
        />

        <empty-tbody-placeholder
          v-else-if="isLoadFailed"
          :colspan="3"
          :message="'promo-code-offers-table.error-msg' | globalize"
        />

        <skeleton-loader-table-body
          v-else
          :cells="3"
          template="smallString"
        />
      </table>
    </div>
  </div>
</template>

<script>
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

import { api } from '@/api'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  updateOffers: 'update-offers',
}
export default {
  name: 'promo-code-offers-table',

  components: {
    EmptyTbodyPlaceholder,
    SkeletonLoaderTableBody,
  },

  props: {
    offersId: {
      type: Array,
      required: true,
    },
  },

  data: _ => ({
    promoCodeOffers: [],
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  async created () {
    this.promoCodeOffers = await Promise.all(
      this.offersId.map(id => this.loadOffer(id))
    )
    this.isLoaded = true
  },

  methods: {
    async loadOffer (id) {
      try {
        const { data } = await api.get(`/integrations/marketplace/offers/${id}`)
        return new AtomicSwapAskRecord(data)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },

}
</script>

<style lang="scss" scoped>
.promo-code-offers-table__offers-title {
  margin-top: 2rem;
}
</style>
