<template>
  <div class="atomic-swap-card">
    <div class="atomic-swap-card__logo">
      <skeleton-loader template="bigIcon" />
    </div>

    <div class="atomic-swap-card__info">
      <p class="atomic-swap-card__title">
        <skeleton-loader width="60%" template="smallString" />
      </p>
      <p class="atomic-swap-card__amount">
        <skeleton-loader width="45%" template="smallString" />
      </p>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import AtomicSwapCard from './AtomicSwapCard.vue'

export default {
  name: 'atomic-swap-card-skeleton',

  components: {
    SkeletonLoader,
  },

  extends: AtomicSwapCard,

  props: {
    atomicSwapAsk: {
      type: Object,
      required: false,
      default: null,
    },
  },
}
</script>
