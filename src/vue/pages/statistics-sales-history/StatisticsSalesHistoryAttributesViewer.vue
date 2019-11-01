<template>
  <div class="statistics-sales-history-attributes-viewer">
    <table class="attributes-viewer__table">
      <tbody>
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            123
          </td>
          <td class="attributes-viewer__table-cell">
            123
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'

export default {
  name: 'statistics-sales-history-attributes-viewer',
  props: {
    buyRequest: {
      type: BuyRequestRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';

.statistics-sales-history-attributes-viewer {
  width: 100%;
  overflow: auto;
  padding: 1.5rem 0 0;
  border-top: 0.1rem solid $col-button-flat-disabled-txt;
}

.attributes-viewer__table {
  max-width: 55rem;
  width: 100%;
}

.attributes-viewer__table-cell {
  max-width: 2rem;
  padding: 0.7rem 1.5rem 0.7rem 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $col-text;

  &:first-of-type {
    color: $col-table-head-text;
  }
}
</style>
