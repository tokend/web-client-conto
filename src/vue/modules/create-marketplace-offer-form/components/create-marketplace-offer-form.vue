<template>
  <form
    novalidate
    class="app__form create-marketplace-offer-form"
    @submit.prevent="submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :value="form.asset.code"
          @input="setAssetByCode"
          name="create-marketplace-offer-asset"
          :label="'create-marketplace-offer-form.asset-lbl' | globalize"
          @blur="touchField('form.asset')"
          :disabled="formMixin.isDisabled"
        >
          <option
            v-for="asset in baseAtomicSwapBalancesAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.name }}
          </option>
        </select-field>
        <template v-if="form.asset.code">
          <p
            class="app__form-field-description"
            :class="{ 'app__form-field-description--error': isHaveBalance }"
          >
            {{
              'create-marketplace-offer-form.available-balance' | globalize({
                amount: accountBalance.balance,
                available: accountBalance.balance
              })
            }}
          </p>
        </template>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.amount"
          name="create-marketplace-offer-amount"
          :validation-type="getValidationType"
          :label="'create-marketplace-offer-form.amount-lbl' | globalize"
          :asset="form.asset"
          :disabled="formMixin.isDisabled || isHaveBalance"
          is-max-button-shown
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.price"
          type="number"
          :step="minPrice"
          :max="MAX_PRICE"
          :min="minPrice"
          @blur="touchField('form.price')"
          name="create-marketplace-offer-quote-asset-price"
          :label="'create-marketplace-offer-form.price-lbl' | globalize({
            asset: statsQuoteAsset.code
          })"
          :error-message="getFieldErrorMessage('form.price', {
            maxValue: MAX_PRICE,
            minValue: minPrice
          })"
          :disabled="formMixin.isDisabled || isHaveBalance"
        />
      </div>
    </div>
    <marketplace-offer-quote-assets-form
      :is-disabled.sync="formMixin.isDisabled || isHaveBalance"
      @submit="setQuoteAssets($event) || submit()"
    />
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import MarketplaceOfferBidMixin from '@/vue/mixins/marketplace-offer-ask.mixin'
import MarketplaceOfferQuoteAssetsForm from '@/vue/forms/MarketplaceOfferQuoteAssetsForm'
import config from '@/config'

import {
  required,
  minValue,
  maxValue,
} from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  createdMarketplaceOffer: 'created-marketplace-offer',
}

const VALIDATION_TYPES = {
  outgoing: 'outgoing',
  marketplaceOffer: 'marketplaceOffer',
}

export default {
  name: 'create-marketplace-offer-form',
  components: {
    MarketplaceOfferQuoteAssetsForm,
  },
  mixins: [FormMixin, MarketplaceOfferBidMixin],
  data: _ => ({
    form: {
      asset: {},
      amount: '',
      price: '',
      quoteAssets: [],
    },
    isLoaded: false,
    isLoadFailed: false,
    MAX_PRICE: config.MAX_AMOUNT,
  }),

  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
        },
        price: {
          required,
          minValue: minValue(this.minPrice),
          maxValue: maxValue(this.MAX_PRICE),
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      baseAtomicSwapBalancesAssets: vuexTypes.baseAtomicSwapBalancesAssets,
      accountId: vuexTypes.accountId,
    }),

    accountBalance () {
      return this.accountBalanceByCode(this.form.asset.code)
    },

    isHaveBalance () {
      return +this.accountBalance.balance === 0
    },

    isAssetOwner () {
      return this.accountId === this.form.asset.owner
    },

    getValidationType () {
      return this.isAssetOwner
        ? VALIDATION_TYPES.marketplaceOffer
        : VALIDATION_TYPES.outgoing
    },
  },

  async created () {
    this.form.asset = this.baseAtomicSwapBalancesAssets[0] || {}
  },
  methods: {
    setAssetByCode (code) {
      this.form.asset = this.baseAtomicSwapBalancesAssets
        .find(item => item.code === code)
    },

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()

      try {
        if (this.isAssetOwner && this.isAmountMoreThanBalance()) {
          const createIssuanceOperation = this.buildCreateIssuanceOperation()
          await api.postOperations(createIssuanceOperation)
        }

        await this.createAtomicSwapAsk({
          baseAssetCode: this.form.asset.code,
          amount: this.form.amount,
          price: this.form.price,
          quoteAssets: this.form.quoteAssets,
        })
        Bus.success('create-marketplace-offer-form.created-marketplace-offer-msg')
        this.$emit(EVENTS.createdMarketplaceOffer)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.enableForm()
    },

    buildCreateIssuanceOperation () {
      const operation = base.CreateIssuanceRequestBuilder
        .createIssuanceRequest({
          asset: this.form.asset.code,
          amount: this.getIssuanceAmount(),
          receiver: this.accountBalance.id,
          reference: this.getReference(),
          creatorDetails: {},
        })

      return operation
    },

    getReference () {
      return btoa(Math.random())
    },

    getIssuanceAmount () {
      const availbaleBalance = this.accountBalance.balance
      const amount = this.form.amount
      return MathUtil.subtract(amount, availbaleBalance)
    },

    isAmountMoreThanBalance () {
      return MathUtil.compare(this.form.amount, this.accountBalance.balance) > 0
    },

    setQuoteAssets (form) {
      this.form.quoteAssets = form.quoteAssets
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.create-marketplace-offer-form__amount-wrapper {
  display: flex;
}

.create-marketplace-offer-form__asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}
</style>
