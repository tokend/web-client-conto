<template>
  <form
    class="kyc-general-form"
    @submit.prevent="confirm"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="!isSignUpKycPage"
          v-model="form.firstName"
          @change="former.setAttr('firstName', form.firstName)"
          name="kyc-general-first-name"
          :label="'kyc-general-form.first-name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.firstName')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          :white-autofill="!isSignUpKycPage"
          v-model="form.lastName"
          @change="former.setAttr('lastName', form.lastName)"
          @blur="touchField('form.lastName')"
          name="kyc-general-last-name"
          :label="'kyc-general-form.last-name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.lastName')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation(); submit()"
        @cancel="hideConfirmation"
      />
      <button
        v-ripple
        v-else
        type="submit"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{
          (isSignUpKycPage
            ? 'kyc-general-form.login-btn'
            : former.willUpdateRequest
              ? 'kyc-general-form.update-btn'
              : 'kyc-general-form.create-btn'
          ) | globalize
        }}
      </button>

      <button
        v-if="isSignUpKycPage"
        type="button"
        @click="logOutAccount"
        v-ripple
        class="kyc-general-form__submit-btn app__button-flat"
        :disabled="formMixin.isDisabled"
      >
        {{ 'kyc-general-form.logout-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import config from '@/config'

import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { required } from '@validators'
import { delay } from '@/js/helpers/delay'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'kyc-general-form',

  mixins: [formMixin],

  props: {
    former: {
      type: KycGeneralFormer,
      default: () => new KycGeneralFormer(),
    },
  },

  data () {
    const attrs = this.former.attrs || {}
    return {
      form: {
        firstName: attrs.firstName || '',
        lastName: attrs.lastName || '',
      },
      EVENTS,
    }
  },

  validations: {
    form: {
      firstName: { required },
      lastName: { required },
    },
  },

  computed: {
    isSignUpKycPage () {
      return this.$route.name === vueRoutes.signupKyc.name
    },
  },

  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      logOutAccount: vuexTypes.LOG_OUT,
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),

    async submit () {
      this.disableForm()
      try {
        const ops = await this.former.buildOps()
        await api.postOperations(...ops)

        if (this.isSignUpKycPage) {
          await this.afterSignUpKycSubmit()
        } else if (this.former.isUpdateOpBuilder) {
          await this.afterKycSubmit()
        } else if (this.former.isRecoveryOpBuilder) {
          await this.afterKycRecoverySubmit()
        }

        this.$emit(EVENTS.submitted)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },

    async afterKycSubmit () {
      await delay(config.RELOAD_TIMEOUT) // w8 for the horizon ingest
      await this.loadKyc() // update the current kyc state
      Bus.success('kyc-general-form.request-submitted-msg')
    },

    async afterSignUpKycSubmit () {
      await delay(config.RELOAD_TIMEOUT) // w8 for the horizon ingest
      await this.loadAccount(this.walletAccountId)
      await this.$router.push(vueRoutes.app)
    },

    async afterKycRecoverySubmit () {
      await delay(config.RELOAD_TIMEOUT)
      await this.loadAccount()
      await this.loadKycRecovery()
      Bus.success('kyc-general-form.request-submitted-msg')
    },

    async confirm () {
      if (!this.isFormValid()) return
      if (this.isSignUpKycPage) {
        this.submit()
      } else {
        this.showConfirmation()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';

.app__form-actions {
  display: flex;
  justify-content: space-between;
}
</style>
