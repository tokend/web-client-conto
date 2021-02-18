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
          v-model="form.description"
          @blur="touchField('form.description')"
          @change="former.setAttr('description', form.description)"
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
        <input-field
          white-autofill
          v-model="form.price"
          type="number"
          :step="inputStep"
          :max="MAX_AMOUNT"
          @blur="touchField('form.price')"
          @change="former.setAttr('price', form.price)"
          name="create-asset-form-price"
          :label="'create-asset-form.price-lbl' | globalize({
            quoteAsset: businessStatsQuoteAsset
          })"
          :error-message="getFieldErrorMessage('form.price', {
            from: {
              value: MIN_AMOUNT,
              currency: form.code,
            },
            to: {
              value: MAX_AMOUNT,
              currency: form.code,
            },
          })"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.expirationDate"
          @input="former.setAttr('expirationDate', form.expirationDate)"
          :label="'create-asset-form.expiration-date-lbl' | globalize"
          :disable-before="moment().subtract(1, 'days').toISOString()"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <clipper-field
          name="create-asset-logo"
          v-model="form.logo"
          @input="former.setAttr('logo', form.logo)"
          :note="'create-asset-form.logo-note' | globalize"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'create-asset-form.logo-lbl' | globalize"
          :min-width="120"
          :min-height="120"
          :ratio="1"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.isSellable"
          :disabled="isDisabled"
          @input="updateIsSellable"
        >
          {{ 'create-asset-form.can-be-bought-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
        :disabled="isDisabled"
      >
        {{ (form.isSellable
          ? 'create-asset-form.next-btn'
          : 'create-asset-form.create-btn'
        ) | globalize
        }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import md5 from 'js-md5'
import moment from 'moment'
import config from '@/config'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES, Document } from '@tokend/js-sdk'

import {
  required,
  maxLength,
  amountRange,
} from '@validators'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { AssetFormer } from '@/js/formers/AssetFormer'

import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'

const EVENTS = {
  submit: 'submit',
  updateIsSellable: 'update-is-sellable',
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
      policies: ASSET_POLICIES.canBeBaseInAtomicSwap |
        ASSET_POLICIES.transferable,
      description: '',
      isSellable: false,
      expirationDate: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
    NAME_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
    EVENTS,
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
        price: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.businessStatsQuoteAsset,
      vuexTypes.accountId,
    ]),
    inputStep () {
      return inputStepByDigitsCount(config.DECIMAL_POINTS)
    },
  },

  watch: {
    'form.expirationDate' () {
      if (moment(this.form.expirationDate).isBefore(moment())) {
        this.form.expirationDate = moment().format('YYYY-MM-DD HH:mm')
      }
    },
    'form.name' () {
      this.form.code = this.getAssetCode()
      this.former.setAttr('assetCode', this.form.code)
    },
  },

  methods: {
    updateIsSellable () {
      this.$emit(EVENTS.updateIsSellable, this.form.isSellable)
    },
    getAssetCode () {
      let hash = md5.create()
      const assetInformation = this.form.name + this.accountId + +new Date()
      hash.update(assetInformation)
      return hash.toString().substring(0, 6).toUpperCase()
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
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

.information-step-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>
