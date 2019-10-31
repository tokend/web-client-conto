<template>
  <div class="statistics-sales-history">
    <statistics-filters
      @filters-data-loaded="filtersDataLoaded = true"
      @set-filters-and-update-list="setFiltersAndUpdateList"
    />
    <template v-if="filtersDataLoaded">
      <statistics-sales-history-table
        :buy-requests="buyRequests"
        :is-loaded="isLoaded"
        :is-load-failed="isLoadFailed"
      />
      <collection-loader
        v-show="buyRequests.length"
        :first-page-loader="getListBuyRequests"
        @first-page-load="setListBuyRequests"
        @next-page-load="concatListBuyRequests"
        ref="listCollectionLoader"
      />
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import StatisticsSalesHistoryTable from './statistics-sales-history/StatisticsSalesHistoryTable'
import StatisticsFilters from './statistics/StatisticsFilters'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'

export default {
  name: 'statistics-sales-history',
  components: {
    CollectionLoader,
    StatisticsSalesHistoryTable,
    StatisticsFilters,
  },
  data: _ => ({
    filters: {
      assetCode: '',
      periodStart: '',
      periodEnd: '',
      promoCode: '',
    },
    buyRequests: [],
    isLoaded: false,
    isLoadFailed: false,
    filtersDataLoaded: false,
  }),

  methods: {
    async getListBuyRequests () {
      try {
        const response = await api.getWithSignature('/integrations/marketplace/buy_requests', {
          filter: {
            bought_asset: this.filters.assetCode,
          },
        })

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
      this.isLoaded = false
      this.buyRequests = []
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    setFiltersAndUpdateList (value) {
      this.filters = value
      this.reloadList()
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
