<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.kyc-recovery' | globalize }}
    </h2>

    <div class="auth-page__content">
      <wallet-recovery-form
        v-if="isWalletRecoveryFormDisplay"
        @error="checkError"
      />
      <wallet-recovery-tfa-code-form
        v-if="!isWalletRecoveryFormDisplay"
        :error="recoveryError"
        @send-kyc-recovery-request="createKycRecoveryRequest"
      />

      <template v-if="isKycRecoveryInProgress">
        <loader
          class="auth-page__verification-loader"
          message-id="auth-pages.verifying-email-msg"
        />
      </template>

      <div class="auth-page__tips">
        <div class="auth-page__tip">
          <span>
            {{ 'auth-pages.know-credentials-question' | globalize }}
          </span>
          <router-link class="auth-page__tip-link" :to="vueRoutes.login">
            {{ 'auth-pages.know-credentials-answer' | globalize }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WalletRecoveryForm from '@/vue/forms/WalletRecoveryForm'
import WalletRecoveryTfaCodeForm from '@/vue/forms/WalletRecoveryTfaCodeForm'
import Loader from '@/vue/common/Loader'

import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'kyc-recovery',
  components: {
    WalletRecoveryForm,
    WalletRecoveryTfaCodeForm,
    Loader,
  },
  data: _ => ({
    isWalletRecoveryFormDisplay: true,
    recoveryError: {},
    vueRoutes,
    isKycRecoveryInProgress: false,
  }),
  methods: {
    ...mapActions({
      sendKycRecoveryRequest: vuexTypes.SEND_KYC_RECOVERY_REQUEST,
    }),

    checkError (error) {
      this.recoveryError = error
      this.isWalletRecoveryFormDisplay = false
    },

    async createKycRecoveryRequest () {
      this.isKycRecoveryInProgress = true
      try {
        await this.sendKycRecoveryRequest()
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isKycRecoveryInProgress = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
