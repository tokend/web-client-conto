<template>
  <div class="auth-page">
    <template>
      <h2 class="auth-page__title">
        {{ 'auth-pages.signup-general-kyc-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <general-kyc-form
          @submitted="submit"
          @logout="logOut"
        />
      </div>
    </template>
  </div>
</template>

<script>
import GeneralKycForm from '@/vue/forms/GeneralKycForm'
import config from '@/config'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'signup-general-kyc',
  components: {
    GeneralKycForm,
  },

  computed: {
    ...mapGetters([
      vuexTypes.walletAccountId,
      vuexTypes.accountId,
      vuexTypes.businessToBrowse,
    ]),
  },

  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      logOutAccount: vuexTypes.LOG_OUT,
      loadBusinessById: vuexTypes.LOAD_BUSINESS_BY_ID,
    }),

    async submit () {
      await this.loadAccount(this.walletAccountId)
      await this.addBusiness() // only for forklog
      await this.loadBusinessById(config.BUSINESS_ID)
      this.$router.push({
        ...vueRoutes.app,
        query: {
          owner: this.businessToBrowse.accountId,
        },
      })
    },

    async addBusiness () {
      try {
        const endpoint = `/integrations/dns/clients/${this.accountId}/businesses`
        await api.postWithSignature(endpoint, {
          data: {
            id: config.BUSINESS_ID,
            type: 'businesses',
          },
        })
      } catch (error) {
        ErrorHandler.process(error)
      }
    },

    logOut () {
      this.logOutAccount()
      location.reload()
    },
  },
}
</script>

<style lang="scss">
@import './auth-page';

</style>
