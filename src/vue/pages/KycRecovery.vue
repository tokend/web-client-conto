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
import { mapGetters } from 'vuex'

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

  computed: {
    ...mapGetters([
      vuexTypes.kvDefaultSignerRoleId,
    ]),
  },

  methods: {
    checkError (error) {
      this.recoveryError = error
      this.isWalletRecoveryFormDisplay = false
    },

    async createKycRecoveryRequest (wallet) {
      this.isKycRecoveryInProgress = true
      try {
        const opts = {
          targetAccount: wallet.accountId,
          signers: [
            {
              publicKey: wallet.keypair.accountId(),
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
