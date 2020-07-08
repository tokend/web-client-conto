<template>
  <router-link class="logotype" :to="logoRout">
    <img :src="logoUrl" :alt="config.APP_NAME">
  </router-link>
</template>

<script>
import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const DEFAULT_LOGO_URL = '/static/branding/logo.png'

export default {
  data: _ => ({
    vueRoutes,
    config,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountGeneral,
    ]),
    logoUrl () {
      return DEFAULT_LOGO_URL
    },
    logoRout () {
      if (this.isAccountCorporate) {
        return vueRoutes.customers
      } else {
        return vueRoutes.businesses
      }
    },
  },
}
</script>

<style lang="scss">
.logotype img {
  max-height: 4.5rem;
  height: inherit;
}
</style>
