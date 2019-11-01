<template>
  <table class="statistics-sales-history-table">
    <thead>
      <tr class="statistics-sales-history-table__head-row">
        <th
          class="statistics-sales-history-table__head-cell"
          :title="'statistics-sales-history-table.buyer-th' | globalize"
        >
          {{ 'statistics-sales-history-table.buyer-th' | globalize }}
        </th>
        <th
          class="statistics-sales-history-table__head-cell"
          :title="'statistics-sales-history-table.date-th' | globalize"
        >
          {{ 'statistics-sales-history-table.date-th' | globalize }}
        </th>
        <th
          class="statistics-sales-history-table__head-cell"
          :title="'statistics-sales-history-table.amount-th' | globalize"
        >
          {{ 'statistics-sales-history-table.amount-th' | globalize }}
        </th>
        <th
          class="statistics-sales-history-table__head-cell"
          :title="'statistics-sales-history-table.status-th' | globalize"
        >
          {{ 'statistics-sales-history-table.status-th' | globalize }}
        </th>
        <th
          class="statistics-sales-history-table__head-cell
                 statistics-sales-history-table__head-cell--expand-btn-wrp"
        />
      </tr>
    </thead>

    <template v-if="buyRequests.length">
      <statistics-sales-history-table-row
        v-for="buyRequest in buyRequests"
        :buy-request="buyRequest"
        :key="buyRequest.id"
      />
    </template>
    <statistics-sales-history-table-empty-list-placeholder
      v-else-if="isLoaded && !buyRequests.length"
      :message="'statistics-sales-history-table.no-data-msg' | globalize"
    />
    <statistics-sales-history-table-empty-list-placeholder
      v-else-if="isLoadFailed"
      :message="'statistics-sales-history-table.error-msg' | globalize"
    />
    <template v-else>
      <statistics-sales-history-table-skeleton-loader
        v-for="index in 3"
        :key="index"
      />
    </template>
  </table>
</template>

<script>
import StatisticsSalesHistoryTableRow from './StatisticsSalesHistoryTableRow'
import StatisticsSalesHistoryTableSkeletonLoader from './StatisticsSalesHistoryTableSkeletonLoader'
import StatisticsSalesHistoryTableEmptyListPlaceholder from './StatisticsSalesHistoryTableEmptyListPlaceholder'

export default {
  name: 'statistics-sales-history-table',
  components: {
    StatisticsSalesHistoryTableRow,
    StatisticsSalesHistoryTableSkeletonLoader,
    StatisticsSalesHistoryTableEmptyListPlaceholder,
  },
  props: {
    buyRequests: {
      type: Array, /** {@link BuyRequestRecord} **/
      required: true,
    },
    isLoaded: {
      type: Boolean,
      require: true,
    },

    isLoadFailed: {
      type: Boolean,
      require: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.statistics-sales-history-table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0 0.6rem;
  border-color: transparent;
  overflow-x: auto;
  padding: 0.4rem;
}

.statistics-sales-history-table__head-cell {
  padding: 0 1.5rem 1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 1.4rem;
  color: $col-text-secondary;
  font-weight: 400;
  width: 10rem;

  &--expand-btn-wrp {
    text-align: right;
    width: 6.7rem;
  }
}
</style>
