<template>
  <div class="business-viewer-description">
    <div
      class="business-viewer-description__logo-wrp"
      v-if="business.bannerKey"
    >
      <img
        class="business-viewer-description__logo"
        :src="business.bannerUrl"
      >
    </div>

    <vue-markdown
      v-if="business.description"
      class="business-viewer-description__markdown app__markdown"
      :source="business.description"
    />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import { BusinessRecord } from '@/js/records/entities/business.record'

export default {
  name: 'business-viewer-description',
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

  .business-viewer-description {
    width: 100%;
    max-width: 100%;
    display: block;
    margin-bottom: 2rem;
    background-color: $col-current-bussiness-description-background;
    border-radius: 0.4rem;
  }

  .business-viewer-description__logo-wrp {
    position: relative;
    padding-bottom: 33.33%;
    background-color: $col-current-bussiness-description-logo-background;
    border-radius: 0.4rem;
  }

  .business-viewer-description__logo {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 0.4rem 0.4rem 0 0;
  }

  .business-viewer-description__markdown {
    padding: 2rem;
  }

</style>
