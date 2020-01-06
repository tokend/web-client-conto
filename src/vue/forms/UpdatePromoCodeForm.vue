<template>
  <div class="update-promo-code-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && submit()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.description"
            name="update-promo-code-form-description"
            @blur="touchField('form.description')"
            :label="'update-promo-code-form.description-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.description',{
              length: DESCRIPTION_MAX_LENGTH
            })"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            @blur="touchField('form.discount')"
            :error-message="getFieldErrorMessage('form.discount',{
              maxValue: MAX_PERCENT_DISCOUNT,
              minValue: MIN_PERCENT
            })"
            v-model="form.discount"
            :step="inputStep"
            :max="MAX_PERCENT_DISCOUNT"
            :min="MIN_PERCENT"
            type="number"
            name="update-promo-code-form-discount"
            :label="'update-promo-code-form.discount-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            @blur="touchField('form.maxUses')"
            :error-message="getFieldErrorMessage('form.maxUses', {
              minValue: MIN_INTEGER_VALUE,
              maxValue: MAX_INT_32
            })"
            v-model="form.maxUses"
            :max="MAX_INT_32"
            :min="MIN_INTEGER_VALUE"
            type="number"
            name="update-promo-code-form-max-uses"
            :label="'update-promo-code-form.max-uses-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'update-promo-code-form.update-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import config from '@/config'

import {
  required,
  integer,
  minValue,
  maxValue,
  maxLength,
  requiredIf,
} from '@validators'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import {
  MAX_INT_32,
  MIN_INTEGER_VALUE,
  MAX_PERCENT_DISCOUNT,
  MIN_PERCENT,
} from '@/js/const/numbers.const'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'
import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { MathUtil } from '@/js/utils'

const EVENTS = {
  promoCodeUpdated: 'promo-code-updated',
}

const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'update-promo-code-form',

  mixins: [FormMixin],

  props: {
    promoCode: {
      type: PromoCodeRecord,
      required: true,
    },
  },

  data: _ => ({
    form: {
      discount: '',
      description: '',
      maxUses: null,
    },
    userOffers: [],
    MAX_INT_32,
    MIN_INTEGER_VALUE,
    MAX_PERCENT_DISCOUNT,
    MIN_PERCENT,
    DESCRIPTION_MAX_LENGTH,
    config,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    inputStep () {
      return inputStepByDigitsCount(config.DECIMAL_POINTS)
    },
  },

  created () {
    this.populateForm()
  },

  validations () {
    return {
      form: {
        description: {
          required: requiredIf(function () {
            return Boolean(this.promoCode.description)
          }),
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
        maxUses: {
          required: requiredIf(function () {
            return Boolean(this.promoCode.maxUses)
          }),
          integer,
          minValue: minValue(MIN_INTEGER_VALUE),
          maxValue: maxValue(MAX_INT_32),
        },
        discount: {
          required,
          maxValue: maxValue(MAX_PERCENT_DISCOUNT),
          minValue: minValue(MIN_PERCENT),
        },
      },
    }
  },

  methods: {
    populateForm () {
      this.form = {
        description: this.promoCode.description,
        maxUses: this.promoCode.maxUses,
        discount: MathUtil.multiply(this.promoCode.discount, 100),
      }
    },

    async submit () {
      this.disableForm()

      try {
        const operation = this.buildUpdatePromoCodeOperation()
        await api.patchWithSignature(
          `/integrations/marketplace/promocodes/${this.promoCode.id}`,
          operation
        )

        this.$emit(EVENTS.promoCodeUpdated)
        Bus.success('update-promo-code-form.updated-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    buildUpdatePromoCodeOperation () {
      return {
        data: {
          attributes: {
            discount: String(this.form.discount / 100),
            ...(this.form.description
              ? { description: this.form.description }
              : {}
            ),
            ...(this.form.maxUses
              ? { max_uses: Number(this.form.maxUses) }
              : {}
            ),
          },
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
</style>
