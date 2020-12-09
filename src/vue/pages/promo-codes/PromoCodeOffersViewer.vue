<template>
  <div class="promo-code-offers-viewer">
    <h3 class="promo-code-offers-table__offers-title">
      {{ 'promo-code-offers-viewer.offers-title' | globalize }}
    </h3>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'promo-code-offers-viewer.error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="promoCodeOffers.length">
          <promo-code-offers-table
            :promo-code-offers="promoCodeOffers"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="chart-areaspline"
            :title="'promo-code-offers-viewer.no-data-title' | globalize"
            :message="'promo-code-offers-viewer.no-data-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-table :cells="3" />
    </template>
  </div>
</template>

<script>
import PromoCodeOffersTable from '@/vue/pages/promo-codes/PromoCodeOffersTable'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { api } from '@/api'
import { MarketplaceOfferAskRecord } from '@/js/records/entities/marketplace-offer-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'promo-code-offers-viewer',
  components: {
    PromoCodeOffersTable,
    SkeletonLoaderTable,
    ErrorMessage,
    NoDataMessage,
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
        return new MarketplaceOfferAskRecord(data)
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
