<template>
  <router-link class="logotype" :to="logoRout">
    <img
      v-if="isLoggedIn"
      :src="yellowLogoUrl"
      class="logo"
      :alt="config.APP_NAME"
    >
    <img
      v-else
      :src="blackLogoUrl"
      class="logo"
      :alt="config.APP_NAME"
    >
  </router-link>
</template>

<script>
import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const DEFAULT_LOGO_URL = '/static/branding/logo-yellow.svg'
const BLACK_LOGO_URL = '/static/branding/logo-black.svg'

export default {
  data: _ => ({
    vueRoutes,
    config,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountGeneral,
      vuexTypes.isLoggedIn,
    ]),
    yellowLogoUrl () {
      return DEFAULT_LOGO_URL
    },
    blackLogoUrl () {
      return BLACK_LOGO_URL
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
  height: 2rem;
}
</style>
