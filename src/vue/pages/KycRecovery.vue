<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.kyc-recovery' | globalize }}
    </h2>

    <div class="auth-page__content">
      <template v-if="isKycRecoveryInProgress">
        <loader
          class="auth-page__verification-loader"
          message-id="auth-pages.kyc-recovery-msg"
        />
      </template>
      <template v-else>
        <wallet-recovery-form
          v-if="isWalletRecoveryFormDisplay"
          @error="checkError"
          @set-password-and-email="setPasswordAndEmail"
        />
        <wallet-recovery-tfa-code-form
          v-if="!isWalletRecoveryFormDisplay"
          :error="recoveryError"
          @verified="accountRecovery"
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
import { vuexTypes } from '@/vuex'
import { mapActions, mapMutations } from 'vuex'
import { buildKycRecoveryOp } from '@/js/helpers/kyc-helpers'
import { api } from '@/api'

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
    email: '',
    password: '',
  }),

  methods: {
    ...mapActions({
      loadWallet: vuexTypes.LOAD_WALLET,
      initAccount: vuexTypes.INIT_ACCOUNT,
    }),
    ...mapMutations({
      clearWalletAndAccount: vuexTypes.CLEAR_WALLET_AND_ACCOUNT,
    }),

    checkError (error) {
      this.recoveryError = error
      this.isWalletRecoveryFormDisplay = false
    },

    setPasswordAndEmail ({ email, password }) {
      this.email = email
      this.password = password
    },

    async accountRecovery () {
      this.isKycRecoveryInProgress = true
      try {
        await this.loadWallet({
          email: this.email.toLowerCase(),
          password: this.password,
        })

        await api.postOperations(buildKycRecoveryOp())
        await this.initAccount()
        await this.$router.push({ name: 'app' })
      } catch (e) {
        ErrorHandler.process(e)
        this.clearWalletAndAccount()
        this.isWalletRecoveryFormDisplay = true
      }
      this.isKycRecoveryInProgress = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
