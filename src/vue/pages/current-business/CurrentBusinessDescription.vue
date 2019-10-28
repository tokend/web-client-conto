<template>
  <div class="current-business-description">
    <div class="current-business-description__wrp">
      <div
        class="current-business-details__logo-wrp"
        v-if="business.bannerKey"
      >
        <img
          class="current-business-details__logo"
          :src="businessBannerUrl"
        >
      </div>

      <vue-markdown
        v-if="business.description"
        class="current-business-description__markdown"
        :source="business.description"
      />
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'

import { documentsManager } from '@/api'

import { BusinessRecord } from '@/js/records/entities/business.record'

export default {
  name: 'current-business-description',
  components: {
    VueMarkdown,
  },
  props: {
    business: {
      type: BusinessRecord,
      default: {},
    },
  },
  computed: {
    businessBannerUrl () {
      return documentsManager.getDocumentUrlByKey(this.business.bannerKey)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables.scss';

  .current-business-description {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    border-radius: 0.4rem;
  }

  .current-business-description__wrp {
    width: 100%;
    display: block;
    background-color: $col-current-bussiness-description-background;
    border-radius: 0.4rem;
  }

  .current-business-details__logo-wrp {
    position: relative;
    padding-bottom: 33.33%;
    background-color: $col-current-bussiness-description-logo-background;
    border-radius: 0.4rem;
  }

  .current-business-details__logo {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 0.4rem 0.4rem 0 0;
  }

</style>

<style lang="scss">
@import '~@scss/variables';
/* stylelint-disable selector-nested-pattern */
.current-business-description__markdown {
  padding: 2rem;
  border-radius: 0 0 0.4rem 0.4rem;

  img {
    max-width: 100%;
    margin: 0.8rem 0;
  }

  h1 {
    font-size: 2.8rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  h2 {
    font-size: 2.2rem;
    margin-bottom: 1.4rem;
    margin-top: 1.4rem;
  }

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  p {
    margin-bottom: 0.8rem;
  }

  ol,
  ul {
    padding-left: 2rem;

    li {
      margin-bottom: 0.8rem;
    }
  }

  ol {

    li {
      // stylelint-disable-next-line
      list-style-type: decimal !important;
    }
  }

  ul {

    li {
      // stylelint-disable-next-line
      list-style-type: disc !important;
    }
  }

  a {
    color: $col-secondary;
  }
}

</style>
