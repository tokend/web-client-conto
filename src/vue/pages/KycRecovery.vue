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
          @send-kyc-recovery-request="createKycRecoveryRequest"
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
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

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

  computed: {
    ...mapGetters([
      vuexTypes.kvDefaultSignerRoleId,
      vuexTypes.walletAccountId,
      vuexTypes.walletPublicKey,
    ]),
  },

  methods: {
    ...mapActions({
      loadWallet: vuexTypes.LOAD_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
    }),

    checkError (error) {
      this.recoveryError = error
      this.isWalletRecoveryFormDisplay = false
    },

    setPasswordAndEmail ({ email, password }) {
      this.email = email
      this.password = password
    },

    async createKycRecoveryRequest () {
      this.isKycRecoveryInProgress = true
      try {
        await this.loadWallet({
          email: this.email.toLowerCase(),
          password: this.password,
        })
        const opts = {
          targetAccount: this.walletAccountId,
          signers: [
            {
              publicKey: this.walletPublicKey,
              roleID: String(this.kvDefaultSignerRoleId),
              weight: '1000',
              identity: '1',
              details: {},
            },
          ],
          creatorDetails: {},
        }
        await api.postOperations(
          base.CreateKYCRecoveryRequestBuilder.create(opts)
        )
        await this.loadAccount(this.walletAccountId)
        await this.loadKyc()
        await this.loadMyBusinesses()
        await this.$router.push({ name: 'app' })
      } catch (e) {
        ErrorHandler.process(e)
        this.isKycRecoveryInProgress = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
