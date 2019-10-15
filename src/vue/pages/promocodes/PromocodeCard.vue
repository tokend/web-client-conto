<template>
  <div class="promocode-card">
    <div class="promocode-card__logo">
      <text-logo
        :text="promocode.code"
      />
    </div>
    <div class="promocode-card__info">
      <h3 class="promocode-card__title">
        {{ promocode.code }}
      </h3>

      <p class="promocode-card__discount">
        {{ 'promocode-card.discount' | globalize }}
        {{ promocode.discount | formatToPercent }}
      </p>
    </div>
  </div>
</template>

<script>
import TextLogo from '@/vue/common/TextLogo'
import { PromocodeRecord } from '@/js/records/entities/promocode.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'promocode-card',
  components: {
    TextLogo,
  },

  props: {
    promocode: {
      type: PromocodeRecord,
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

$promocode-card-header-height: 6.5rem;

.promocode-card {
  height: 100%;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.promocode-card__title {
  font-size: 1.6rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.promocode-card__logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
  padding-left: 1rem;
  height: $promocode-card-header-height;
  background-color: $col-asset-card-header-background;
}

.promocode-card__info {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - #{$promocode-card-header-height});
}

.promocode-card__discount {
  color: $col-text-secondary;
  font-size: 1.3rem;
  line-height: 1.5;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
}
</style>
