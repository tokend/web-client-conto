<template>
  <div class="statistics-sales-history">
    <statistics-filters
      @set-filters-and-update-list="setFiltersAndUpdateList"
      @show-no-assets-message="showNoAssetsMessage = true"
    />

    <no-data-message
      v-if="showNoAssetsMessage"
      class="statistics-sales-history__no-assets-msg"
      icon-name="chart-areaspline"
      :title="'statistics-sales-history.no-assets-title' | globalize"
      :message="'statistics-sales-history.no-assets-msg' | globalize"
    />

    <template v-else>
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
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import StatisticsSalesHistoryTable from './statistics-sales-history/StatisticsSalesHistoryTable'
import StatisticsFilters from './statistics/StatisticsFilters'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'
import { DateUtil } from '@/js/utils/date.util'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'

export default {
  name: 'statistics-sales-history',
  components: {
    CollectionLoader,
    StatisticsSalesHistoryTable,
    StatisticsFilters,
    NoDataMessage,
  },
  data: _ => ({
    filters: {
      assetCode: '',
      dateFrom: '',
      dateTo: '',
      promoCode: '',
      buyRequestStatus: BUY_REQUEST_STATUSES.paid.value,
    },
    buyRequests: [],
    isLoaded: false,
    isLoadFailed: false,
    showNoAssetsMessage: false,
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

.statistics-sales-history__no-assets-msg {
  margin-top: 3rem;
}
</style>
