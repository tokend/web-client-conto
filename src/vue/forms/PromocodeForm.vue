<template>
  <div class="promocode-form">
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
              name="promocode-code"
              :label="'promocode-form.code-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.code')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.description"
              name="promocode-form-description"
              :label="'promocode-form.description-lbl' | globalize"
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
                maxValue: MAX_PERCENT,
                minValue: MIN_PERCENT
              })"
              v-model="form.discount"
              :step="inputStep"
              :max="MAX_PERCENT"
              :min="MIN_PERCENT"
              type="number"
              name="promocode-form-discount"
              :label="'promocode-form.discount-lbl' | globalize"
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
              name="promocode-form-max-uses"
              :label="'promocode-form.max-uses-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <promocode-offers-table
          @update-offers="form.offers = $event"
          :offers="userOffers"
        />

        <p class="promocode-form__offers-error-message">
          {{ getFieldErrorMessage('form.offers') }}
        </p>

        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'promocode-form.create-btn' | globalize }}
          </button>
        </div>
      </form>
    </template>

    <loader
      v-else-if="isLoading"
      message-id="promocode-form.loading"
    />

    <no-data-message
      v-else
      :title="'promocode-form.no-offers-msg-title' | globalize"
      :message="'promocode-form.no-offers-msg-description' | globalize"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import config from '@/config'
import NoDataMessage from '@/vue/common/NoDataMessage'
import PromocodeOffersTable from '@/vue/pages/promocodes/PromocodeOffersTable'
import Loader from '@/vue/common/Loader'

import { required, integer, minValue, maxValue } from '@validators'
import { inputStepByDigitsCount } from '@/js/helpers/input-trailing-digits-count'
import {
  MAX_INT_32,
  MIN_INTEGER_VALUE,
  MAX_PERCENT,
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

export default {
  name: 'promocode-form',

  components: {
    NoDataMessage,
    PromocodeOffersTable,
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
    MAX_PERCENT,
    MIN_PERCENT,
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
        code: { required },
        maxUses: {
          integer,
          minValue: minValue(MIN_INTEGER_VALUE),
          maxValue: maxValue(MAX_INT_32),
        },
        discount: {
          required,
          maxValue: maxValue(MAX_PERCENT),
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
        const operation = this.buildCreatePromocodeOperation()
        await api.postWithSignature('/integrations/marketplace/promocodes', operation)

        this.$emit(EVENTS.closeDrawerAndUpdateList)
        Bus.success('promocode-form.created-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },

    buildCreatePromocodeOperation () {
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
            max_uses: this.form.maxUses,
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

.promocode-form__offers-error-message {
  color: $col-accent;
  margin-top: 0.4rem;
  font-size: 1.2rem;
}
</style>
