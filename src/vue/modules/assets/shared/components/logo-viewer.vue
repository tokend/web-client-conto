<template>
  <img
    v-if="url"
    :src="url"
    class="logo-viewer logo-viewer--image"
    :class="{ 'logo-viewer--full-cover' : isFullCover }"
  >
  <p
    v-else
    class="logo-viewer logo-viewer--abbr"
    :class="{ 'logo-viewer--dark' : darkMode }"
  >
    {{ asset.code | abbreviate }}
  </p>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { documentsManager } from '@/api'

export default {
  name: 'logo-viewer',
  props: {
    asset: { type: AssetRecord, required: true },
    darkMode: { type: Boolean, default: false },
    isFullCover: { type: Boolean, default: false },
  },
  computed: {
    url () {
      return documentsManager.getDocumentUrlByKey(this.asset.logoKey)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;

  &--image {
    display: block;
  }

  &--abbr {
    font-size: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $col-asset-logo-background;
    color: $col-asset-logo-text;
  }

  &--dark {
    background: $col-asset-logo-dark-background;
    color: $col-asset-logo-dark-text;
  }

  &--full-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
}
</style>
