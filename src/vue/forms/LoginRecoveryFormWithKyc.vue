<template>
  <div>
    <form
      class="app-form auth-form"
      @submit.prevent="submit"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.code"
            @blur="touchField('form.code')"
            name="wallet-recovery-code"
            :label="'auth-pages.code' | globalize"
            :error-message="getFieldErrorMessage('form.code')"
            :white-autofill="false"
          />
        </div>
      </div>

      <p class="login-recovery-form-with-kyc__tfa-hint">
        <template
          v-if="errorPasswordEmail.error.meta.factorType === FACTOR_TYPES.email"
        >
          {{ 'kyc-recovery.email-code' | globalize }}
        </template>
        <template
          v-if="errorPasswordEmail.error.meta.factorType === FACTOR_TYPES.totp"
        >
          {{ 'kyc-recovery.tfa-code' | globalize }}}
        </template>
      </p>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="auth-form__submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'auth-pages.sign-in' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'
// import { errors } from '@/js/errors'
import { ErrorHandler } from '@/js/helpers/error-handler'
// import { vueRoutes } from '@/vue-router/routes'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { factorsManager } from '@/api'

const FACTOR_TYPES = {
  totp: 'totp',
  email: 'email',
}
export default {
  name: 'login-recovery-form-with-kyc',
  mixins: [FormMixin],
  props: {
    errorPasswordEmail: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    FACTOR_TYPES,
    form: {
      code: '',
    },
  }),
  validations: {
    form: {
      code: { required },
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountUnverified,
    ]),
  },
  methods: {
    ...mapActions({
      logInAccount: vuexTypes.LOG_IN,
      sendKycRecoveryRequest: vuexTypes.SEND_KYC_RECOVERY_REQUEST,
    }),
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await factorsManager.verifyTotpFactorAndRetry(
          this.errorPasswordEmail.error,
          this.form.code
        )
      } catch (err) {
        ErrorHandler.process(err)
        this.enableForm()
        return
      }
      try {
        await this.logInAccount({
          email: this.errorPasswordEmail.email.toLowerCase(),
          password: this.errorPasswordEmail.password,
        })
        await this.sendKycRecoveryRequest()
        await this.logInAccount({
          email: this.errorPasswordEmail.email.toLowerCase(),
          password: this.errorPasswordEmail.password,
        })
        location.reload()
      } catch (e) {
        this.enableForm()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';
  @import './auth-form';

  .login-recovery-form-with-kyc__tfa-hint {
    margin-top: 0.6rem;
    font-size: 1.4rem;
    color: $col-text;
  }
</style>
