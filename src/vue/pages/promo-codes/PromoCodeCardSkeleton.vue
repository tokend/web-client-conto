<template>
  <div class="promo-code-card">
    <div class="promo-code-card__logo">
      <skeleton-loader
        template="bigIcon"
      />
    </div>

    <div class="promo-code-card__info">
      <p class="promo-code-card__code">
        <skeleton-loader width="45%" template="smallString" />
      </p>

      <p class="promo-code-card__discount">
        <skeleton-loader width="60%" template="smallString" />
      </p>
    </div>
  </div>
</template>

<script>
import SkeletonLoader from '@/vue/common/skeleton-loader/SkeletonLoader'
import PromoCodeCard from './PromoCodeCard.vue'

export default {
  name: 'promo-code-card-skeleton',

  components: {
    SkeletonLoader,
  },

  extends: PromoCodeCard,

  props: {
    promoCode: {
      type: Object,
      required: false,
      default: null,
    },
  },

}
</script>
