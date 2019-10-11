<template>
  <div class="promocode-card">
    <div class="promocode-card__logo">
      <skeleton-loader
        template="bigIcon"
      />
    </div>

    <div class="promocode-card__info">
      <p class="promocode-card__code">
        <skeleton-loader width="45%" template="smallString" />
      </p>

      <p class="promocode-card__discount">
        <skeleton-loader width="60%" template="smallString" />
      </p>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import PromocodeCard from './PromocodeCard.vue'

export default {
  name: 'promocode-card-skeleton',

  components: {
    SkeletonLoader,
  },

  extends: PromocodeCard,

}
</script>
