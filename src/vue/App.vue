<template>
  <div
    id="app"
    v-if="isAppInitialized"
    :key="appKey"
  >
    <template v-if="isLoggedIn && isNavigationRendered">
      <warning-banner
        v-if="isAccountBlocked"
        :message="'warning-banner.blocked-desc' | globalize({
          reason: kycRequest.blockReason
        })"
        message-type="danger"
      />
      <div class="app__container">
        <sidebar />

        <div class="app__main-content">
          <div class="app__navbar">
            <navbar />
          </div>

          <div class="app__main">
            <router-view />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <router-view />
    </template>

    <status-message />
    <smart-app-banner />
  </div>
</template>

<script>
import StatusMessage from '@/vue/common/StatusMessage'
import Navbar from '@/vue/navigation/Navbar.vue'
import Sidebar from '@/vue/navigation/Sidebar.vue'
import WarningBanner from '@/vue/common/WarningBanner'
import SmartAppBanner from '@/vue/common/SmartAppBanner'
import config from '@/config'

import {
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

import { i18n } from '@/i18n'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'app',

  components: {
    Navbar,
    Sidebar,
    StatusMessage,
    WarningBanner,
    SmartAppBanner,
  },

  data: () => ({
    isAppInitialized: false,
    vueRoutes,
    lang: i18n.language,
    accountRole: '',
  }),

  computed: {
    ...mapGetters([
      vuexTypes.walletEmail,
      vuexTypes.walletAccountId,
      vuexTypes.walletId,
      vuexTypes.isLoggedIn,
      vuexTypes.isAccountBlocked,
      vuexTypes.kycRequest,
      vuexTypes.account,
      vuexTypes.isAccountCorporate,
    ]),
    isNavigationRendered () {
      return this.$route.matched.some(m => m.meta.isNavigationRendered)
    },
    appKey () {
      return `${this.accountRole}${this.lang}`
    },
  },

  watch: {
    isLoggedIn (value) {
      if (!document.hasFocus() || !value) {
        this.isAppInitialized = false
        location.reload()
      }
    },
  },

  async created () {
    this.setAppTitle()
    await this.initApp()

    this.startIdle()

    i18n.onLanguageChanged(lng => (this.lang = lng))

    this.watchChangesInLocalStorage()
    Bus.on('updateAccountRole', () => this.updateAccountRole())
    this.isAppInitialized = true
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      decryptSecretSeed: vuexTypes.DECRYPT_SECRET_SEED,
      startIdle: vuexTypes.START_IDLE,
      logoutSession: vuexTypes.LOGOUT_SESSION,
      restoreSession: vuexTypes.RESTORE_SESSION,
      loadBusiness: vuexTypes.LOAD_BUSINESS,
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
    }),
    ...mapMutations({
      popState: vuexTypes.POP_STATE,
      clearState: vuexTypes.CLEAR_STATE,
    }),
    async initApp () {
      if (this.isLoggedIn) {
        await this.restoreSession()
        await this.loadAccount(this.walletAccountId)
        await this.loadMyBusinesses()
      }
      if (this.isAccountCorporate) this.loadBusiness(this.walletAccountId)
      await this.loadAssets()
    },

    async getDecryptedSecretSeed () {
      const key = await this.decryptSecretSeed()
      return key
    },

    watchChangesInLocalStorage () {
      window.onstorage = (storage) => {
        const isLocalStorageExists = localStorage.getItem(config.STORAGE_KEY)

        if ((this.isLoggedIn ||
          storage.newValue !== storage.oldValue) && isLocalStorageExists) {
          this.popState()
        } else {
          this.clearState()
        }
      }
    },

    async updateAccountRole () {
      this.accountRole = ((this.account || {}).role || {}).id || ''
    },

    setAppTitle () {
      document.title = config.APP_NAME
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.app__container {
  display: flex;
  align-items: stretch;
  overflow-x: hidden;
  flex: 1;
}

.app__main-content {
  flex: 1;
  overflow: hidden;
}

.app__navbar {
  position: relative;
  z-index: $z-app-navbar;
  min-height: 6.4rem;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property:
    opacity,
    background-color,
    box-shadow,
    transform,
    color,
    min-height,
    -webkit-transform;
  will-change:
    opacity,
    background-color,
    box-shadow,
    transform,
    color,
    min-height;
}

.app__main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding:
    $content-padding-top
    $content-padding-right
    $content-padding-bottom
    $content-padding-left;
  background-color: $col-app-content-background;

  @include respond-to-custom($sidebar-hide-bp) {
    width: 100vw;
    padding: 0 $content-side-paddings-sm 3rem;
  }
}

.app__warning-message-link {
  margin-left: 0.4rem;
  color: $col-message-box-text;
  font-size: 1.6rem;
}
</style>
