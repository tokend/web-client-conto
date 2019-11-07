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

    <statistics-sales-history-table-row
      v-for="buyRequest in buyRequests"
      :buy-request="buyRequest"
      :key="buyRequest.id"
    />
  </table>
</template>

<script>
import StatisticsSalesHistoryTableRow from './StatisticsSalesHistoryTableRow'

export default {
  name: 'statistics-sales-history-table',
  components: {
    StatisticsSalesHistoryTableRow,
  },
  props: {
    buyRequests: {
      type: Array, /** {@link BuyRequestRecord} **/
      required: true,
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
