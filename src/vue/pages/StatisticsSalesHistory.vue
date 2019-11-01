<template>
  <div class="statistics-sales-history">
    <statistics-filters
      @filters-data-loaded="filtersDataLoaded = true"
      @show-no-data-message="showNoDataMessage = true"
      @show-request-failed-message="showRequestFailedMessage = true"
      @set-filters-and-update-list="setFiltersAndUpdateList"
    />
    <template v-if="filtersDataLoaded && !showNoDataMessage">
      <div class="statistics-sales-history__list-wrp">
        <statistics-sales-history-table
          :buy-requests="buyRequests"
          :is-loaded="isLoaded"
          :is-load-failed="isLoadFailed"
        />
      </div>
      <collection-loader
        v-show="buyRequests.length"
        :first-page-loader="getListBuyRequests"
        @first-page-load="setListBuyRequests"
        @next-page-load="concatListBuyRequests"
        ref="listCollectionLoader"
      />
    </template>

    <no-data-message
      v-else-if="filtersDataLoaded && showNoDataMessage"
      icon-name="chart-areaspline"
      :title="'statistics-sales-history.no-data-title' | globalize"
      :message="'statistics-sales-history.no-data-msg' | globalize"
    />

    <no-data-message
      v-else-if="!filtersDataLoaded && showRequestFailedMessage"
      icon-name="chart-areaspline"
      :message="'statistics-sales-history.load-failed-msg' | globalize"
    />

    <loader
      v-else
      message-id="statistics-sales-history.filters-data-loading-msg"
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
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'
import { DateUtil } from '@/js/utils/date.util'

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
    filters: {
      assetCode: '',
      dateFrom: '',
      dateTo: '',
      promoCode: '',
      buyRequestStatus: '',
    },
    buyRequests: [],
    isLoaded: false,
    isLoadFailed: false,
    showNoDataMessage: false,
    showRequestFailedMessage: false,
    filtersDataLoaded: false,
  }),

  methods: {
    async getListBuyRequests () {
      let filters = this.getFilters()

      try {
        const response = await api.getWithSignature('/integrations/marketplace/buy_requests', {
          filter: filters,
        })

        this.isLoaded = true
        return response
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    setListBuyRequests (list) {
      this.buyRequests = list.map(i => new BuyRequestRecord(i))
    },

    concatListBuyRequests (list) {
      this.buyRequests = this.buyRequests.concat(
        list.map(i => new BuyRequestRecord(i))
      )
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

    getFilters () {
      return {
        ...(
          this.filters.assetCode
            ? { 'bought_asset': this.filters.assetCode }
            : {}
        ),
        ...(
          this.filters.dateFrom
            ? { 'date_from': DateUtil.toTimestamp(this.filters.dateFrom) }
            : {}
        ),
        ...(
          this.filters.dateTo
            ? { 'date_to': DateUtil.toTimestamp(this.filters.dateTo) }
            : {}
        ),
        ...(
          this.filters.promoCode
            ? { 'promo': this.filters.promoCode }
            : {}
        ),
        ...(
          this.filters.buyRequestStatus
            ? { 'status': this.filters.buyRequestStatus }
            : {}
        ),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.statistics-sales-history__list-wrp {
  overflow-x: auto;
  width: 100%;
  margin-top: 3rem;
}
</style>
