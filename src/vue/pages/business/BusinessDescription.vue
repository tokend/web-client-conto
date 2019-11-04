<template>
  <div class="business-description">
    <div class="business-description__wrp">
      <div
        class="business-details__logo-wrp"
        v-if="business.bannerKey"
      >
        <img
          class="business-details__logo"
          :src="business.bannerUrl"
        >
      </div>
      <template v-if="business.description">
        <vue-markdown
          class="app__markdown"
          :source="business.description"
        />
      </template>
    </div>
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
  .business-description {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
  }

  .business-description__wrp {
    width: 100%;
    max-width: 100rem;
    display: block;
  }

  .business-details__logo-wrp {
    position: relative;
    padding-bottom: 33.33%;
    margin-bottom: 2rem;
  }

  .business-details__logo {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>
