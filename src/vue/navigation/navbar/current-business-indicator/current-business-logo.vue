<template>
  <img
    v-if="url"
    class="current-business-logo current-business-logo__image"
    :src="url"
  >
  <p
    v-else
    class="current-business-logo current-business-logo__code-abbr"
  >
    {{ getFirstLetterOfName }}
  </p>
</template>

<script>
import { BusinessRecord } from '@/js/records/entities/business.record'
import { documentsManager } from '@/api'

export default {
  name: 'current-business-logo',
  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },
  computed: {
    url () {
      return documentsManager.getDocumentUrlByKey(this.business.logoKey)
    },

    getFirstLetterOfName () {
      const name = this.business.name
      return name.substr(0, 1).toUpperCase()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.current-business-logo {
  width: 4.8rem;
  height: 4.8rem;
  min-width: 4.8rem;
  border-radius: 50%;
}

.current-business-logo__image {
  display: block;
}

.current-business-logo__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-dark-background;
  color: $col-asset-logo-dark-text;
  line-height: 1;
}
</style>
