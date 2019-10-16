<template>
  <div class="promo-code-form">
    <template v-if="isLoaded && userOffers.length">
      <form
        novalidate
        class="app__form"
        @submit.prevent="isFormValid() && submit()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-model="form.code"
              @blur="touchField('form.code')"
              name="promo-code-code"
              :label="'promo-code-form.code-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.code',{
                length: PROMOCODE_MAX_LENGTH
              })"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.description"
              name="promo-code-form-description"
              @blur="touchField('form.description')"
              :label="'promo-code-form.description-lbl' | globalize"
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
              name="promo-code-form-discount"
              :label="'promo-code-form.discount-lbl' | globalize"
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
              name="promo-code-form-max-uses"
              :label="'promo-code-form.max-uses-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <promo-code-offers-table
          @update-offers="form.offers = $event"
          :offers="userOffers"
        />

        <p class="promo-code-form__offers-error-message">
          {{ getFieldErrorMessage('form.offers') }}
        </p>

        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'promo-code-form.create-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>

    <loader
      v-else-if="isLoading"
      message-id="promo-code-form.loading"
    />

    <no-data-message
      v-else
      :title="'promo-code-form.no-offers-msg-title' | globalize"
      :message="'promo-code-form.no-offers-msg-description' | globalize"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import config from '@/config'
import NoDataMessage from '@/vue/common/NoDataMessage'
import PromoCodeOffersTable from '@/vue/pages/promo-codes/PromoCodeOffersTable'
import Loader from '@/vue/common/Loader'

import { required, integer, minValue, maxValue, maxLength } from '@validators'
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
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

const PROMOCODE_MAX_LENGTH = 12
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'promo-code-form',

  components: {
    NoDataMessage,
    PromoCodeOffersTable,
    Loader,
  },

  mixins: [FormMixin],

  data: _ => ({
    form: {
      code: '',
      discount: '',
      description: '',
      maxUses: null,
      offers: [],
    },
    userOffers: [],
    isLoaded: false,
    isLoading: false,
    MAX_INT_32,
    MIN_INTEGER_VALUE,
    MAX_PERCENT_DISCOUNT,
    MIN_PERCENT,
    PROMOCODE_MAX_LENGTH,
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

  async created () {
    await this.loadOffers()
    this.isLoaded = true
  },

  validations () {
    return {
      form: {
        code: {
          required,
          maxLength: maxLength(PROMOCODE_MAX_LENGTH),
        },
        description: {
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
        maxUses: {
          integer,
          minValue: minValue(MIN_INTEGER_VALUE),
          maxValue: maxValue(MAX_INT_32),
        },
        discount: {
          required,
          maxValue: maxValue(MAX_PERCENT_DISCOUNT),
          minValue: minValue(MIN_PERCENT),
        },
        offers: { required },
      },
    }
  },

  methods: {
    async loadOffers () {
      this.isLoading = true
      try {
        const { data } = await api.get('/integrations/marketplace/offers', {
          filter: {
            owner: this.accountId,
          },
        })
        this.userOffers = data.map(i => new AtomicSwapAskRecord(i))
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLoading = false
    },

    async submit () {
      this.disableForm()

      try {
        const operation = this.buildCreatePromoCodeOperation()
        await api.postWithSignature('/integrations/marketplace/promocodes', operation)

        this.$emit(EVENTS.closeDrawerAndUpdateList)
        Bus.success('promo-code-form.created-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    buildCreatePromoCodeOperation () {
      const offers = this.form.offers
        .map((offer) => {
          return {
            id: offer.id,
            type: 'marketplace-offer',
          }
        })

      return {
        data: {
          type: 'marketplace-create-promocode',
          attributes: {
            description: this.form.description,
            code: this.form.code,
            max_uses: Number(this.form.maxUses) || null,
            discount: String(this.form.discount / 100),
          },
          relationships: {
            offers: {
              data: offers,
            },
          },
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import './app-form';

.promo-code-form__offers-error-message {
  color: $col-accent;
  margin-top: 0.4rem;
  font-size: 1.2rem;
}
</style>
