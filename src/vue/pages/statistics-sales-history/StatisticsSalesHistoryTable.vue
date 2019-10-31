<template>
  <table class="statistics-sales-history-table">
    <thead>
      <tr class="statistics-sales-history-table__head-row">
        <th
          class="statistics-sales-history-table__head-cell"
          :title="'movements-history.type-th' | globalize"
        >
          {{ 'movements-history.type-th' | globalize }}
        </th>
        <th
          class="statistics-sales-history-table__head-cell
                 statistics-sales-history-table__head-cell--expand-btn-wrp"
        />
      </tr>
    </thead>

    <template v-if="buyRequests.length">
      <!-- <movements-table-row
        v-for="buyRequest in buyRequests"
        :buy-request="buyRequest"
        :key="buyRequest.id"
      /> -->
    </template>

    <empty-tbody-placeholder
      v-else-if="isLoaded && !buyRequests.length"
    />

    <empty-tbody-placeholder
      v-else-if="isLoadFailed"
      :colspan="4"
      :message="'customers-table.error-msg' | globalize"
    />

    <skeleton-loader-table-body
      v-else
      :cells="4"
      template="smallString"
    />
  </table>
</template>

<script>
// import MovementsTableRow from './movements-table-row'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

export default {
  name: 'statistics-sales-history-table',
  components: {
    // MovementsTableRow,
    SkeletonLoaderTableBody,
    EmptyTbodyPlaceholder,
  },
  props: {
    buyRequests: {
      type: Array, /** {@link Movement} **/
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
