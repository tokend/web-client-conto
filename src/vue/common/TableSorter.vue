<template>
  <div class="table-sorter">
    <slot />
    <i
      @click="setOrderAndEmitSorting()"
      class="mdi table-sorter__icon"
      :class="[
        {'table-sorter__icon--active': isActive},
        isAscSortingOrder ? 'mdi-arrow-up' : 'mdi-arrow-down'
      ]"
    />
  </div>
</template>

<script>
import { PAGE_SORTING_ORDERS } from '@/js/const/page-sorting-orders.const'

const EVENTS = {
  sortingChanged: 'sorting-changed',
}

export default {
  name: 'table-sorter',
  props: {
    isActive: { type: Boolean, default: false },
    sortingKey: { type: String, required: true },
    initialOrder: { type: String, default: PAGE_SORTING_ORDERS.desc },
  },

  data: _ => ({
    sortingOrder: '',
    PAGE_SORTING_ORDERS,
  }),

  computed: {
    isAscSortingOrder () {
      return this.sortingOrder === PAGE_SORTING_ORDERS.asc
    },
  },

  watch: {
    isActive (newValue) {
      if (!newValue) {
        this.sortingOrder = this.initialOrder
      }
    },
  },

  created () {
    this.sortingOrder = this.initialOrder
  },

  methods: {
    setOrderAndEmitSorting () {
      this.sortingOrder = this.isAscSortingOrder
        ? PAGE_SORTING_ORDERS.desc
        : PAGE_SORTING_ORDERS.asc
      this.$emit(EVENTS.sortingChanged, {
        sortingKey: this.sortingKey,
        sortingOrder: this.sortingOrder,
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
