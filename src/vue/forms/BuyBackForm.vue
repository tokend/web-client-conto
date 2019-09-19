<template>
  <form
    v-if="isLoaded"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.quoteAsset"
          name="trade-offer-base-asset"
          :disabled="formMixin.isDisabled"
          :label="'create-trade-offer-form.asset-to-sell-lbl' | globalize"
        >
          <option
            v-for="asset in accountAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.name }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model.trim="form.price"
          name="trade-offer-price"
          type="number"
          :min="0"
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          :label="
            'create-trade-offer-form.price-lbl' | globalize({
              baseAsset: form.baseAsset,
              quoteAsset: form.quoteAsset
            })
          "
          :error-message="getFieldErrorMessage(
            'form.price', {
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
              available: quoteAssetBalance
            }
          )"
          @blur="touchField('form.price')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <template v-if="!isExistAmount">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model.trim="form.amount"
            name="trade-offer-amount"
            type="number"
            :min="0"
            :max="config.MAX_AMOUNT"
            :step="config.MIN_AMOUNT"
            :label="'create-trade-offer-form.amount-lbl' | globalize({
              asset: form.baseAsset
            })"
            :error-message="getFieldErrorMessage(
              'form.amount',
              {
                available: baseAssetBalance,
                from: config.MIN_AMOUNT,
                to: config.MAX_AMOUNT,
              }
            )"
            @blur="touchField('form.amount')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
    </template>

    <div class="app__form-row">
      <div class="app__form-field">
        <readonly-field
          :label="'create-trade-offer-form.total-amount-lbl' | globalize"
          :value="{
            value: quoteAmount,
            currency: form.quoteAsset,
          } | formatMoney"
          :error-message="getFieldErrorMessage(
            'quoteAmount',
            {
              available: quoteAssetBalance,
              from: config.MIN_AMOUNT,
              to: config.MAX_AMOUNT,
            }
          )"
        />
      </div>
    </div>

    <template v-if="formMixin.isConfirmationShown">
      <form-confirmation
        @cancel="hideConfirmation"
        @ok="submit"
        :is-pending="isOfferCreating"
        class="app__form-confirmation"
      />
    </template>

    <template v-else>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="app__button-raised create-trade-offer-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'create-trade-offer-form.buy-btn' | globalize }}
        </button>
      </div>
    </template>
  </form>
  <skeleton-loader-offer-form
    v-else
  />
</template>

<script>
import ReadonlyField from '@/vue/fields/ReadonlyField'
import SkeletonLoaderOfferForm from './market-orders/SkeletonLoaderOfferForm'

import FormMixin from '@/vue/mixins/form.mixin'
import OfferManagerMixin from '@/vue/mixins/offer-manager.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { MathUtil } from '@/js/utils/math.util'
import config from '@/config'

import {
  required,
  amountRange,
  maxValueBig,
  decimal,
} from '@validators'

const EVENTS = {
  offerCreated: 'offer-created',
}

export default {
  name: 'buy-back-form',
  components: {
    ReadonlyField,
    SkeletonLoaderOfferForm,
  },
  mixins: [
    FormMixin,
    OfferManagerMixin,
  ],

  props: {
    baseAsset: { type: String, default: '' },
    amount: { type: String, default: '' },
  },

  data: () => ({
    form: {
      baseAsset: '',
      price: '',
      amount: '',
      quoteAsset: '',
    },
    isBuy: true,
    isLoaded: false,
    isOfferCreating: false,
    config,
  }),

  validations () {
    return {
      form: {
        price: {
          required,
          decimal,
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
        amount: {
          required,
          decimal,
          noMoreThanAvailableOnBalance: this.isBuy ||
            maxValueBig(this.baseAssetBalance),
          amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
        },
      },

      quoteAmount: {
        noMoreThanAvailableOnBalance: maxValueBig(this.quoteAssetBalance),
        amountRange: amountRange(config.MIN_AMOUNT, config.MAX_AMOUNT),
      },
    }
  },

  computed: {
    ...mapGetters({
      accountOwnedAssetsBalances: vuexTypes.accountOwnedAssetsBalances,
    }),

    isExistAmount () {
      return Boolean(this.amount)
    },

    accountAssets () {
      return this.accountOwnedAssetsBalances
        .map(balance => balance.asset)
        .filter(asset => asset.code !== this.form.baseAsset)
    },

    baseAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset.code === this.form.baseAsset)

      return balanceItem ? balanceItem.balance : ''
    },

    quoteAssetBalance () {
      const balanceItem = this.accountBalances
        .find(balance => balance.asset.code === this.form.quoteAsset)
      return balanceItem ? balanceItem.balance : ''
    },

    quoteAmount () {
      if (this.form.price && this.form.amount) {
        return MathUtil.multiply(this.form.price, this.form.amount)
      } else {
        return ''
      }
    },

    createOfferOpts () {
      return {
        pair: {
          base: this.form.baseAsset,
          quote: this.form.quoteAsset,
        },
        baseAmount: this.form.amount,
        quoteAmount: this.quoteAmount,
        price: this.form.price,
        isBuy: this.isBuy,
      }
    },
  },

  async created () {
    try {
      await this.loadBalances()
      this.form.baseAsset = this.baseAsset
      this.form.quoteAsset = this.accountAssets[0].code
      this.form.amount = this.amount
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    async submit () {
      this.isOfferCreating = true
      try {
        await this.createOffer(this.createOfferOpts)

        Bus.success('create-trade-offer-form.order-created-msg')
        this.$emit(EVENTS.offerCreated)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isOfferCreating = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.create-trade-offer-form__btn {
  max-width: 14rem;
  width: 100%;
}

.create-trade-offer-form__fees {
  margin-top: 1rem;
}
</style>
