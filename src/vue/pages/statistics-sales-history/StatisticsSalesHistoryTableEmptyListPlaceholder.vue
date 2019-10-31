<template>
  <tbody class="statistics-sales-history-table-empty-list-placeholder">
    <tr
      class="statistics-sales-history-table-empty-list-placeholder__brief
             statistics-sales-history-table-empty-list-placeholder__no-data"
    >
      <!-- eslint-disable max-len -->
      <td
        :colspan="cells"
        class="statistics-sales-history-table-empty-list-placeholder__cell--align-center"
      >
        <!-- eslint-enable max-len -->
        {{ message }}
      </td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'statistics-sales-history-table-empty-list-placeholder',
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  data: _ => ({
    cells: 5,
  }),
}
</script>

<style scoped lang="scss">
  @import '~@scss/mixins';
  @import '~@scss/variables';

  .statistics-sales-history-table-empty-list-placeholder__brief {
    background-color: $col-block-bg;

    @include box-shadow;
  }

  .statistics-sales-history-table-empty-list-placeholder__no-data {
    height: 5.1rem;
  }

  .statistics-sales-history-table-empty-list-placeholder__cell--align-center {
    text-align: center;
  }
</style>
