<template>
  <form
    novalidate
    class="app__form information-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          name="create-asset-name"
          :label="'create-asset-form.name-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.name',
            { length: NAME_MAX_LENGTH }
          )"
          :maxlength="NAME_MAX_LENGTH"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.code"
          @blur="touchField('form.code')"
          name="create-asset-code"
          :label="'create-asset-form.code-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.code')"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.description"
          @blur="touchField('form.description')"
          name="create-asset-form-description"
          :label="'create-asset-form.description-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.description')"
          :maxlength="DESCRIPTION_MAX_LENGTH"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.transferable"
          :disabled="isDisabled"
        >
          {{ 'create-asset-form.transferable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          name="create-asset-logo"
          v-model="form.logo"
          :note="'create-asset-form.logo-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'create-asset-form.logo-lbl' | globalize"
          :min-width="120"
          :min-height="120"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || submit()"
        @cancel="hideConfirmation()"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
        :disabled="isDisabled"
      >
        {{ 'create-asset-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import { required, maxLength, assetCode } from '@validators'

import config from '@/config'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

const NAME_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateAssetRequest, default: null },
    isDisabled: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      name: '',
      code: '',
      logo: null,
      policies:
        ASSET_POLICIES.canBeBaseInAtomicSwap |
        ASSET_POLICIES.canBeQuoteInAtomicSwap,
      description: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    ASSET_POLICIES,
    DOCUMENT_TYPES,
    NAME_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        code: {
          required,
          assetCode,
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  created () {
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      this.form = {
        name: this.request.assetName,
        code: this.request.assetCode,
        logo: this.request.logoKey
          ? new DocumentContainer(this.request.logo)
          : null,
        policies: this.request.policy,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },

    setConfirmationState () {
      this.showConfirmation()
      this.$emit(EVENTS.updateIsDisabled, true)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.information-step-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>