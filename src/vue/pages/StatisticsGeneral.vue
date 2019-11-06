<template>
  <div class="statistics-general">
    <statistics-filters
      @set-filters-and-update-list="setFiltersAndUpdateList"
      @show-no-assets-message="showNoAssetsMessage = true"
    />

    <no-data-message
      v-if="showNoAssetsMessage"
      class="statistics-general__no-assets-msg"
      icon-name="chart-areaspline"
      :title="'statistics-general.no-assets-title' | globalize"
      :message="'statistics-general.no-assets-msg' | globalize"
    />

    <template v-else>
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
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import StatisticsGeneralTable from './statistics-general/StatisticsGeneralTable'
import StatisticsFilters from './statistics/StatisticsFilters'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { SoldAssetRecord } from '@/js/records/entities/sold-asset.record'
import { DateUtil } from '@/js/utils/date.util'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'statistics-general',
  components: {
    CollectionLoader,
    StatisticsGeneralTable,
    StatisticsFilters,
    NoDataMessage,
  },
  data: _ => ({
    filters: {
      assetCode: '',
      dateFrom: '',
      dateTo: '',
    },
    soldAssets: [],
    showNoAssetsMessage: false,
    isLoaded: false,
    isLoadFailed: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },

  methods: {
    async getListSoldAssets () {
      let filters = this.getFilters()
      let response = {}
      try {
        response = await api.getWithSignature('/integrations/marketplace/statistics/sold', {
          filter: {
            'account_id': this.accountId,
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

.statistics-general__no-assets-msg {
  margin-top: 3rem;
}
</style>
