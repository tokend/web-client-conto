<template>
  <div class="business-description">
    <div
      class="business-description__logo-wrp"
      v-if="business.bannerKey"
    >
      <img
        class="business-description__logo"
        :src="business.bannerUrl"
      >
    </div>

    <vue-markdown
      v-if="business.description"
      class="business-description__markdown app__markdown"
      :source="business.description"
    />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import { BusinessRecord } from '@/js/records/entities/business.record'

export default {
  name: 'business-description',
  components: {
    VueMarkdown,
  },
  props: {
    business: {
      type: BusinessRecord,
      default: {},
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables.scss';

  .business-description {
    width: 100%;
    max-width: 100%;
    display: block;
    margin-bottom: 2rem;
    background-color: $col-bussiness-description-background;
    border-radius: 0.4rem;
  }

  .business-description__logo-wrp {
    position: relative;
    padding-bottom: 33.33%;
    background-color: $col-bussiness-description-logo-background;
    border-radius: 0.4rem;
  }

  .business-description__logo {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 0.4rem 0.4rem 0 0;
  }

  .business-description__markdown {
    padding: 2rem;
  }

</style>
