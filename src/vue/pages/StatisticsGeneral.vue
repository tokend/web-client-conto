<template>
  <div class="statistics-general">
    <statistics-filters
      @filters-data-loaded="filtersDataLoaded = true"
      @show-no-data-message="showNoDataMessage = true"
      @show-request-failed-message="showRequestFailedMessage = true"
      @set-filters-and-update-list="setFiltersAndUpdateList"
    />
    <template v-if="filtersDataLoaded && !showNoDataMessage">
      <div class="statistics-general__table-wrp">
        <statistics-general-table
          :sold-assets="soldAssets"
          :is-loaded="isLoaded"
          :is-load-failed="isLoadFailed"
        />
      </div>
      <collection-loader
        v-show="soldAssets.length"
        :first-page-loader="getListSoldAssets"
        @first-page-load="setListSoldAssets"
        @next-page-load="concatListSoldAssets"
        ref="listCollectionLoader"
      />
    </template>

    <no-data-message
      v-else-if="filtersDataLoaded && showNoDataMessage"
      icon-name="chart-areaspline"
      :title="'statistics-general.no-data-title' | globalize"
      :message="'statistics-general.no-data-msg' | globalize"
    />

    <no-data-message
      v-else-if="!filtersDataLoaded && showRequestFailedMessage"
      icon-name="chart-areaspline"
      :message="'statistics-general.load-failed-msg' | globalize"
    />

    <loader
      v-else
      message-id="statistics-general.filters-data-loading-msg"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import StatisticsGeneralTable from './statistics-general/StatisticsGeneralTable'
import StatisticsFilters from './statistics/StatisticsFilters'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { SoldAssetRecord } from '@/js/records/entities/sold-asset.record'
import { DateUtil } from '@/js/utils/date.util'

export default {
  name: 'statistics-general',
  components: {
    CollectionLoader,
    StatisticsGeneralTable,
    StatisticsFilters,
    NoDataMessage,
    Loader,
  },
  data: _ => ({
    filters: {
      assetCode: '',
      dateFrom: '',
      dateTo: '',
    },
    soldAssets: [],
    isLoaded: false,
    isLoadFailed: false,
    showNoDataMessage: false,
    showRequestFailedMessage: false,
    filtersDataLoaded: false,
  }),

  methods: {
    async getListSoldAssets () {
      let filters = this.getFilters()

      try {
        const response = await api.getWithSignature('/integrations/marketplace/statistics/sold', {
          filter: filters,
        })

        this.isLoaded = true
        return response
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    setListSoldAssets (list) {
      this.soldAssets = list.map(i => new SoldAssetRecord(i))
    },

    concatListSoldAssets (list) {
      this.soldAssets = this.soldAssets.concat(
        list.map(i => new SoldAssetRecord(i))
      )
    },

    reloadList () {
      this.isLoaded = false
      this.soldAssets = []
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
            ? { 'asset': this.filters.assetCode }
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
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.statistics-general__table-wrp {
  width: 100%;
  margin-top: 3rem;
}
</style>
