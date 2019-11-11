<template>
  <div class="table-sorter">
    <slot />
    <i
      @click="setOrderAndEmitSort()"
      class="mdi table-sorter__icon"
      :class="[
        {'table-sorter__icon--active': isActive},
        sortOrder === PAGE_SORT_ORDERS.asc
          ? 'mdi-arrow-up-bold'
          : 'mdi-arrow-down-bold'
      ]"
    />
  </div>
</template>

<script>
import { PAGE_SORT_ORDERS } from '@/js/const/page-sort-orders.const'

const EVENTS = {
  sortChanged: 'sort-changed',
}

export default {
  name: 'table-sorter',
  props: {
    isActive: { type: Boolean, default: false },
    sortKey: { type: String, required: true },
    initialOrder: { type: String, default: PAGE_SORT_ORDERS.desc },
  },

  data: _ => ({
    sortOrder: '',
    PAGE_SORT_ORDERS,
  }),

  watch: {
    isActive (newValue) {
      if (!newValue) {
        this.sortOrder = this.initialOrder
      }
    },
  },

  created () {
    this.sortOrder = this.initialOrder
  },

  methods: {
    setOrderAndEmitSort () {
      this.sortOrder = this.sortOrder === PAGE_SORT_ORDERS.asc
        ? PAGE_SORT_ORDERS.desc
        : PAGE_SORT_ORDERS.asc

      this.$emit(EVENTS.sortChanged, {
        key: this.sortKey,
        order: this.sortOrder,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.table-sorter__icon {
  cursor: pointer;

  &:hover {
    color: $col-btn;
  }

  &--active {
    color: $col-btn;
  }
}
</style>
