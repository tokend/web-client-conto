<template>
  <form
    class="kyc-corporate-form"
    @submit.prevent="confirm"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.company"
          @change="former.setAttr('company', form.company)"
          @blur="touchField('form.company')"
          name="kyc-corporate-form-company"
          :label="'kyc-corporate-form.company-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.company')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <clipper-field
          v-model="form.avatar"
          @input="former.setAttr('avatar', form.avatar)"
          name="kyc-corporate-form-avatar"
          :note="'kyc-corporate-form.image-type-note' | globalize"
          :document-type="$DOCUMENT_TYPES.kycAvatar"
          :label="'kyc-corporate-form.avatar-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :ratio="1"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <clipper-field
          v-model="form.banner"
          @input="former.setAttr('banner', form.banner)"
          name="kyc-corporate-form-banner"
          :note="'kyc-corporate-form.image-type-note' | globalize"
          :document-type="$DOCUMENT_TYPES.bravo"
          :label="'kyc-corporate-form.banner-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :ratio="3/1"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.industry"
          @change="former.setAttr('industry', form.industry)"
          name="kyc-corporate-form-industry"
          :label="'kyc-corporate-form.industry-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <span class="kyc-corporate-form__account-description-title">
          {{ 'kyc-corporate-form.description-lbl' | globalize }}
        </span>
        <markdown-field
          v-model="form.description"
          @input="former.setAttr('description', form.description)"
          @blur="touchField('form.description')"
          :error-message="getFieldErrorMessage(
            'form.description',
            { length: DESCRIPTION_MAX_LENGTH }
          )"
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
        <template v-if="former.willUpdateRequest">
          {{ 'kyc-corporate-form.update-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'kyc-corporate-form.create-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'

import { KycCorporateFormer } from '@/js/formers/KycCorporateFormer'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { required, maxLength } from '@validators'

const DESCRIPTION_MAX_LENGTH = 8000
const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'kyc-corporate-form',

  mixins: [formMixin],

  props: {
    former: {
      type: KycCorporateFormer,
      default: () => new KycCorporateFormer(),
    },
  },

  data () {
    const attrs = this.former.attrs || {}
    return {
      form: {
        company: attrs.company || '',
        avatar: attrs.avatar || null,
        banner: attrs.banner || null,
        industry: attrs.industry || '',
        description: attrs.description || '',
      },
      DESCRIPTION_MAX_LENGTH,
    }
  },

  validations () {
    return {
      form: {
        company: { required },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),

    async submit () {
      this.disableForm()
      try {
        const ops = await this.former.buildOps()
        console.log('ops', ops)
        console.log('...ops', ...ops)
        await api.postOperations(...ops)

        if (this.former.isUpdateOpBuilder) {
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
      await this.loadKyc()
      Bus.success('kyc-corporate-form.request-submitted-msg')
    },

    async afterKycRecoverySubmit () {
      await this.loadAccount()
      await this.loadKycRecovery()
      Bus.success('kyc-corporate-form.request-submitted-msg')
    },

    async confirm () {
      if (!this.isFormValid()) return
      this.showConfirmation()
    },
  },
}
</script>
