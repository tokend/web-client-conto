<template>
  <div class="promo-code-card">
    <div class="promo-code-card__logo">
      <promo-code-logo
        :name="promoCode.code"
      />
    </div>
    <div class="promo-code-card__info">
      <h3 class="promo-code-card__title">
        {{ promoCode.code }}
      </h3>

      <p class="promo-code-card__discount">
        {{ 'promo-code-card.discount' | globalize }}
        {{ promoCode.discount | formatPercent }}
      </p>
    </div>
  </div>
</template>

<script>
import PromoCodeLogo from './PromoCodeLogo'
import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'promo-code-card',
  components: {
    PromoCodeLogo,
  },

  props: {
    promoCode: {
      type: PromoCodeRecord,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$promo-code-card-header-height: 6.5rem;

.promo-code-card {
  height: 100%;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.promo-code-card__title {
  font-size: 1.6rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.promo-code-card__logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
  padding-left: 1rem;
  height: $promo-code-card-header-height;
  background-color: $col-asset-card-header-background;
}

.promo-code-card__info {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - #{$promo-code-card-header-height});
}

.promo-code-card__discount {
  color: $col-text-secondary;
  font-size: 1.3rem;
  line-height: 1.5;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
}
</style>
