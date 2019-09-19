<template>
  <div class="user-offers">
    <offers-table
      class="user-offers__orders"
      :is-loaded="isLoaded"
      :offers="offers"
      @canceled="initFirstPageLoader()"
    />

    <collection-loader
      v-show="isLoaded && offers.length"
      class="user-offers__collection-loader"
      :first-page-loader="firstPageLoader"
      @first-page-load="setOffers"
      @next-page-load="concatOffers"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import OffersTable from '@/vue/pages/offers/OffersTable'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'
import { OfferRecord } from '@/js/records/entities/offer.record'

export default {
  name: 'user-offers',
  components: {
    OffersTable,
    CollectionLoader,
  },
  data: () => ({
    offers: [],
    selectedOffer: {},
    isLoaded: false,
    firstPageLoader: _ => {},
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadOffers()
    },
    setOffers (offers) {
      this.offers = offers.map(offer => new OfferRecord(offer))
    },
    concatOffers (offers) {
      this.offers = this.offers.concat(
        offers.map(offer => new OfferRecord(offer))
      )
    },

    async loadOffers () {
      try {
        const response = await api.getWithSignature('/v3/offers', {
          filter: {
            order_book: SECONDARY_MARKET_ORDER_BOOK_ID,
            owner: this.accountId,
          },
        })
        this.isLoaded = true
        return response
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss">
.user-offers__orders {
  margin-top: 4.8rem;
}

.user-offers__collection-loader {
  margin-top: 1rem;
}
</style>
