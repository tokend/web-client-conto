<template>
  <div class="marketplace-offer-requests">
    <h4 class="marketplace-offer-requests__header">
      {{ 'marketplace-offer-requests.purchases' | globalize }}
    </h4>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'marketplace-offer-requests.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="marketplaceOfferRequests.length">
          <marketplace-offer-requests-table
            :marketplace-offer-requests="marketplaceOfferRequests"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="swap-horizontal"
            :title="'marketplace-offer-requests.no-data-title' | globalize"
            :message="'marketplace-offer-requests.no-data-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-table :cells="3" />
    </template>

    <collection-loader
      v-show="isLoaded"
      :first-page-loader="loadMarketplaceOfferRequestsFirstPage"
      @first-page-load="setMarketplaceOfferRequests"
      @next-page-load="concatMarketplaceOfferRequests"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'
import NoDataMessage from '@/vue/common/NoDataMessage'
import MarketplaceOfferRequestsTable from './MarketplaceOfferRequestsTable'

import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'

export default {
  name: 'marketplace-offer-requests',
  components: {
    CollectionLoader,
    ErrorMessage,
    SkeletonLoaderTable,
    NoDataMessage,
    MarketplaceOfferRequestsTable,
  },
  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
  },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      marketplaceOfferRequests: [],
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  methods: {
    async loadMarketplaceOfferRequestsFirstPage () {
      let response = {}

      try {
        response = await api.getWithSignature(
          '/integrations/marketplace/buy_requests',
          {
            filter: {
              'seller': this.accountId,
              'offer': this.atomicSwapAsk.id,
              'status': BUY_REQUEST_STATUSES.paid.value,
            },
            include: ['request_details', 'request_details.quote_asset'],
          })
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isLoadFailed = true
      }
      this.isLoaded = true
      return response
    },
    setMarketplaceOfferRequests (marketplaceOfferRequests) {
      this.marketplaceOfferRequests = marketplaceOfferRequests
        .map(item => new BuyRequestRecord(item))
    },
    concatMarketplaceOfferRequests (marketplaceOfferRequests) {
      this.marketplaceOfferRequests.concat(
        marketplaceOfferRequests.data
          .map(item => new BuyRequestRecord(item))
      )
    },
  },
}
</script>

<style lang="scss" scoped>
  .marketplace-offer-requests__header {
    margin: 2rem 0;
  }
</style>
