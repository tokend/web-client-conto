<template>
  <div class="statistics-sales-history">
    <statistics-filters
      @show-no-data-message="showNoDataMessage = true"
      @show-request-failed-message="showRequestFailedMessage = true"
      @filters-data-loaded="filtersDataLoaded = true"

    />
    <template v-if="filtersDataLoaded">
      <statistics-sales-history-table
        :buy-requests="buyRequests"
        :is-loaded="isLoaded"
        :is-load-failed="isLoadFailed"
      />
      <collection-loader
        :first-page-loader="getListBuyRequests"
        @first-page-load="setListBuyRequests"
        @next-page-load="concatListBuyRequests"
        :ref="REFS.collectionLoader"
      />
    </template>

    <no-data-message
      v-else-if="filtersDataLoaded && showNoDataMessage"
      icon-name="trending-up"
      :title="'op-pages.no-data-title' | globalize"
      :message="'op-pages.no-data-msg' | globalize"
    />

    <no-data-message
      v-else-if="!filtersDataLoaded && showRequestFailedMessage"
      icon-name="trending-up"
      :title="'op-pages.no-data-title' | globalize"
      :message="'op-pages.no-data-msg' | globalize"
    />

    <loader
      v-else
      message-id="op-pages.assets-loading-msg"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import StatisticsSalesHistoryTable from './statistics-sales-history/StatisticsSalesHistoryTable'
import StatisticsFilters from './statistics/StatisticsFilters'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'

const REFS = {
  collectionLoader: 'collection-loader',
}

export default {
  name: 'statistics-sales-history',
  components: {
    CollectionLoader,
    StatisticsSalesHistoryTable,
    StatisticsFilters,
    NoDataMessage,
    Loader,
  },
  data: _ => ({
    buyRequests: [],
    isLoaded: false,
    isLoadFailed: false,
    showNoDataMessage: false,
    filtersDataLoaded: false,
    showRequestFailedMessage: false,
    REFS,
  }),

  methods: {
    async getListBuyRequests () {
      try {
        const response = await api.getWithSignature('/integrations/marketplace/buy_requests')

        this.isLoaded = true
        return response
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    setListBuyRequests (list) {
      this.buyRequests = list
    },

    concatListBuyRequests (list) {
      this.buyRequests = this.buyRequests.concat(list)
    },

    reloadList () {
      return this.REFS.collectionLoader.loadFirstPage()
    },
  },
}
</script>

<style lang="scss" scoped>
.statistics-sales-history__list-wrp {
  overflow-x: auto;
  width: 100%;
}
</style>
