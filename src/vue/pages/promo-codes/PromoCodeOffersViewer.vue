<template>
  <div class="promo-code-offers-viewer">
    <h3 class="promo-code-offers-table__offers-title">
      {{ 'promo-code-offers-table.offers-title' | globalize }}
    </h3>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'promo-code-offers-table.error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="soldAssets.length">
          <statistics-general-table
            :sold-assets="soldAssets"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="chart-areaspline"
            :title="'statistics-general.no-data-title' | globalize"
            :message="'promo-code-offers-table.no-data-msg' | globalize"
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

import { api } from '@/api'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  updateOffers: 'update-offers',
}
export default {
  name: 'promo-code-offers-table',

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
