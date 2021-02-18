<template>
  <form
    novalidate
    class="app__form information-step-form"
    @submit.prevent="submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          @change="former.setAttr('assetName', form.name)"
          name="update-asset-name"
          :label="'update-asset-form-simplified.name-lbl' | globalize"
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
          v-model="form.description"
          @blur="touchField('form.description')"
          @change="former.setAttr('description', form.description)"
          name="update-asset-form-simplified-description"
          :label="'update-asset-form-simplified.description-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.description')"
          :maxlength="DESCRIPTION_MAX_LENGTH"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <!-- eslint-disable max-len -->
        <date-field
          v-model="form.expirationDate"
          @input="former.setAttr('expirationDate', form.expirationDate)"
          :label="'update-asset-form-simplified.expiration-date-lbl' | globalize"
          :disable-before="moment().subtract(1, 'days').toISOString()"
          :disabled="isDisabled"
        />
        <!-- eslint-enable max-len -->
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <clipper-field
          name="update-asset-logo"
          v-model="form.logo"
          @input="former.setAttr('logo', form.logo)"
          :note="'update-asset-form-simplified.logo-note' | globalize"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'update-asset-form-simplified.logo-lbl' | globalize"
          :min-width="120"
          :min-height="120"
          :ratio="1"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
        :disabled="isDisabled"
      >
        {{ 'update-asset-form-simplified.update-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import moment from 'moment'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import {
  required,
  maxLength,
} from '@validators'

import { Document } from '@tokend/js-sdk'
import { AssetFormer } from '@/js/formers/AssetFormer'

const EVENTS = {
  submit: 'submit',
}

const NAME_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    isDisabled: { type: Boolean, default: false },
    former: { type: AssetFormer, required: true },
  },

  data: _ => ({
    form: {
      name: '',
      code: '',
      logo: new Document(),
      policies: 0,
      description: '',
      expirationDate: '',
    },
    DOCUMENT_TYPES,
    NAME_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
    moment,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  created () {
    this.form = {
      name: this.former.attrs.assetName,
      code: this.former.attrs.assetCode,
      description: this.former.attrs.description,
      logo: new Document(this.former.attrs.logo),
      policies: this.former.attrs.policies,
      expirationDate: this.former.attrs.expirationDate,
    }
  },

  methods: {
    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit)
      }
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
</style>
