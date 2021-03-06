<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          name="login-email"
          :label="'auth-pages.email' | globalize"
          :error-message="getFieldErrorMessage('form.email', {
            length: MAX_FIELD_LENGTH.email
          })"
          :white-autofill="false"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="touchField('form.password')"
          name="login-password"
          type="password"
          :trim="false"
          :error-message="getFieldErrorMessage('form.password', {
            length: MAX_FIELD_LENGTH.password
          })"
          :white-autofill="false"
          :label="'auth-pages.password' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <div
      v-if="tfaError"
      class="app__form-row"
    >
      <div class="app__form-field">
        <input-field
          v-model="form.tfaCode"
          @blur="touchField('form.tfaCode')"
          :error-message="getFieldErrorMessage('form.tfaCode')"
          :white-autofill="false"
          :label="'auth-pages.tfa-code' | globalize"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="auth-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ (isSubmitting
          ?'auth-pages.submit-processing'
          : 'auth-pages.sign-in'
        ) | globalize
        }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { required, requiredIf, email, maxLength } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'

import { factorsManager } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@tokend/js-sdk'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

export default {
  name: 'login-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: '',
      tfaCode: '',
    },
    tfaError: null,
    isSubmitting: false,
    MAX_FIELD_LENGTH,
  }),
  validations: {
    form: {
      email: {
        required,
        email,
        maxLength: maxLength(MAX_FIELD_LENGTH.email),
      },
      password: {
        required,
        maxLength: maxLength(MAX_FIELD_LENGTH.password),
      },
      tfaCode: {
        required: requiredIf(function () { return this.tfaError }),
      },
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.walletAccountId,
      vuexTypes.walletEmail,
    ]),
  },

  created () {
    const email = this.$route.params.email

    if (email) {
      this.form.email = email
    }
  },

  methods: {
    ...mapActions({
      logInAccount: vuexTypes.LOG_IN,
    }),
    ...mapMutations({
      clearWalletAndAccount: vuexTypes.CLEAR_WALLET_AND_ACCOUNT,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      this.isSubmitting = true
      try {
        await this.verifyTfaFactor()
        await this.logInAccount({
          email: this.form.email.toLowerCase(),
          password: this.form.password,
        })
        await this.$router.push({ name: 'app' })
      } catch (e) {
        this.processAuthError(e)
        this.enableForm()
        this.isSubmitting = false
      }
      this.enableForm()
      this.isSubmitting = false
    },
    async verifyTfaFactor () {
      if (this.tfaError) {
        await factorsManager.verifyTotpFactor(
          this.tfaError,
          this.form.tfaCode
        )
      }
    },
    processAuthError (error) {
      switch (error.constructor) {
        case errors.VerificationRequiredError:
          this.$router.push({
            ...vueRoutes.verify,
            params: {
              paramsBase64: btoa(JSON.stringify({
                walletId: error.meta.walletId,
                email: this.form.email.toLowerCase(),
              })),
            },
          })
          break
        case errors.TFARequiredError:
          this.tfaError = error
          break
        case errors.NotFoundError:
          ErrorHandler.process(
            error,
            'auth-pages.wrong-email-or-password-err'
          )
          break
        case errors.BadRequestError:
          ErrorHandler.process(
            error,
            'auth-pages.wrong-tfa-code-err'
          )
          break
        case errors.TransactionError:
          ErrorHandler.process(
            error,
            'errors.default'
          )
          this.clearWalletAndAccount()
          break
        default:
          ErrorHandler.process(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
