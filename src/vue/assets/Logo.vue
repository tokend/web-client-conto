<template>
  <router-link class="logotype" :to="vueRoutes.app">
    <img :src="logoUrl" alt="UNIT City">
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

const DEFAULT_LOGO_URL = '/static/conto-logo.png'

export default {
  data: _ => ({
    vueRoutes,
  }),

  computed: {
    logoUrl () {
      return SchemeRegistry.current.appLogoUrl || DEFAULT_LOGO_URL
    },
  },
}
</script>

<style lang="scss">
.logotype img {
  height: 1.5rem;
  width: inherit;
}
</style>
