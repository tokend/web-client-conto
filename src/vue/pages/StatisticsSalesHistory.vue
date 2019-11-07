<template>
  <div class="statistics-sales-history">
    <statistics-filters
      @set-filters-and-update-list="setFiltersAndUpdateList"
    />

    <template v-if="isHaveAssets">
      <div class="statistics-sales-history__table-wrp">
        <template v-if="isLoaded">
          <template v-if="isLoadFailed">
            <error-message
              :message="'statistics-sales-history.error-msg' | globalize"
            />
          </template>

          <template v-else>
            <template v-if="buyRequests.length">
              <statistics-sales-history-table
                :buy-requests="buyRequests"
              />
            </template>

            <template v-else>
              <no-data-message
                icon-name="chart-areaspline"
                :title="'statistics-sales-history.no-data-title' | globalize"
                :message="'statistics-sales-history.no-data-msg' | globalize"
              />
            </template>
          </template>
        </template>

        <template v-else>
          <skeleton-loader-table
            :cells="5"
            need-button
          />
        </template>
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
      v-else
      class="statistics-sales-history__no-assets-msg"
      icon-name="chart-areaspline"
      :title="'statistics-sales-history.no-assets-title' | globalize"
      :message="'statistics-sales-history.no-assets-msg' | globalize"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import StatisticsSalesHistoryTable from './statistics-sales-history/StatisticsSalesHistoryTable'
import StatisticsFilters from './statistics/StatisticsFilters'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'
import { DateUtil } from '@/js/utils/date.util'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'statistics-sales-history',
  components: {
    CollectionLoader,
    StatisticsSalesHistoryTable,
    StatisticsFilters,
    NoDataMessage,
    ErrorMessage,
    SkeletonLoaderTable,
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
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.ownedAssets,
    ]),

    isHaveAssets () {
      return Boolean(this.ownedAssets.length)
    },
  },

  methods: {
    async getListBuyRequests () {
      let filters = this.getFilters()
      let response = {}

      try {
        response = await api.getWithSignature('/integrations/marketplace/buy_requests', {
          filter: {
            seller: this.accountId,
            ...filters,
          },
        })
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoaded = true
      return response
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
      this.isLoadFailed = false
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
.statistics-sales-history__table-wrp {
  overflow-x: auto;
  width: 100%;
  margin-top: 3rem;
}

.statistics-sales-history__no-assets-msg {
  margin-top: 3rem;
}
</style>
