<template>
  <tbody class="statistics-sales-history-table-skeleton-loader">
    <tr
      class="statistics-sales-history-table-skeleton-loader__brief
             statistics-sales-history-table-skeleton-loader__no-data"
    >
      <td
        v-for="item in cells"
        :key="item"
        class="statistics-sales-history-table-skeleton-loader__cell"
      >
        <skeleton-loader
          :template="getTemplateNameSkeletonLoader(item)"
        />
      </td>
    </tr>
  </tbody>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'

export default {
  name: 'statistics-sales-history-table-skeleton-loader',
  components: {
    SkeletonLoader,
  },

  data: _ => ({
    cells: 5,
  }),

  methods: {
    getTemplateNameSkeletonLoader (item) {
      return (item === this.cells)
        ? 'smallIcon'
        : 'bigString'
    },
  },
}
</script>

<style scoped lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.statistics-sales-history-table-skeleton-loader__cell {
  padding: 0.7rem 1.5rem;

  &:last-child {
    display: flex;
    justify-content: flex-end;
  }
}

.statistics-sales-history-table-skeleton-loader__brief {
  background-color: $col-block-bg;

  @include box-shadow;
}

.statistics-sales-history-table-skeleton-loader__no-data {
  height: 5.1rem;
}
</style>
