<template>
  <form
    novalidate
    class="app__form atomic-swap-quote-assets-form"
    @submit.prevent="submit()"
  >
    <div
      class="atomic-swap-quote-assets-form__asset-wrp"
      v-for="(quoteAsset, index) in form.quoteAssets"
      :key="index"
    >
      <div class="atomic-swap-quote-assets-form__asset">
        <div class="atomic-swap-quote-assets-form__assets-subheading-wrp">
          <!-- eslint-disable-next-line max-len -->
          <h3 class="app__form-subheading atomic-swap-quote-assets-form__assets-subheading">
            {{ 'atomic-swap-quote-assets-form.assets-subheading' |
              globalize({number: index + 1})
            }}
          </h3>

          <button
            v-if="canDeleteQuoteAsset(index + 1)"
            type="button"
            class="atomic-swap-quote-assets-form__delete-asset-btn"
            @click="deleteQuoteAsset(index)"
            :disabled="isDisabled"
          >
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-minus-circle-outline atomic-swap-quote-assets-form__delete-asset-icon" />
          </button>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <!-- eslint-disable max-len -->
            <select-field
              :value="form.quoteAssets[index].type"
              @input="setQuoteAssetType($event, index)"
              name="create-atomic-swap-quote-asset-type"
              :label="'atomic-swap-quote-assets-form.type-lbl' | globalize"
              @blur="touchField(`form.quoteAssets[${index}].type`)"
              :error-message="getFieldErrorMessage(`form.quoteAssets[${index}].type`)"
              :disabled="isDisabled"
            >
              <option
                v-for="paymentMethod in PAYMENT_METHODS"
                :key="paymentMethod.value"
                :value="paymentMethod.value"
              >
                {{ paymentMethod.labelTranslationId | globalize }}
              </option>
            </select-field>
            <!-- eslint-enable max-len -->
          </div>
        </div>

        <template
          v-if="!isInternalPaymentMethod(form.quoteAssets[index].type)"
        >
          <div class="app__form-row">
            <div class="app__form-field">
              <!-- eslint-disable max-len -->
              <select-field
                :value="form.quoteAssets[index].asset.code"
                @input="setQuoteAssetByCode($event, index)"
                name="create-atomic-swap-asset"
                :label="'atomic-swap-quote-assets-form.asset-lbl' | globalize"
                @blur="touchField(`form.quoteAssets[${index}].asset`)"
                :error-message="getFieldErrorMessage(`form.quoteAssets[${index}].asset`)"
                :disabled="isDisabled"
              >
                <option
                  v-for="asset in quoteAtomicSwapAssets"
                  :key="asset.code"
                  :value="asset.code"
                >
                  {{ getAssetName(asset) }}
                </option>
              </select-field>
            <!-- eslint-enable max-len -->
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <!-- eslint-disable max-len -->
              <input-field
                white-autofill
                v-model="form.quoteAssets[index].destination"
                @blur="touchField(`form.quoteAssets[${index}].destination`)"
                :error-message="getFieldErrorMessage(
                  `form.quoteAssets[${index}].destination`,
                  {
                    destinationLabel: getDestinationLabel(form.quoteAssets[index].type)
                  }
                )"
                :name="'create-atomic-swap-quote-asset-destination'"
                :label="getDestinationLabel(form.quoteAssets[index].type)"
                :disabled="isDisabled"
              />
            <!-- eslint-enable max-len -->
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      class="atomic-swap-quote-assets-form__add-asset-wrp"
    >
      <div class="atomic-swap-quote-assets-form__add-asset">
        <button
          class="atomic-swap-quote-assets-form__add-asset-btn"
          type="button"
          @click="addQuoteAsset()"
          :disabled="isDisabled"
        >
          {{ 'atomic-swap-quote-assets-form.add-asset-btn' | globalize }}
        </button>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        class="atomic-swap-quote-assets-form__submit-btn app__button-raised"
        :disabled="isDisabled"
      >
        {{ 'atomic-swap-quote-assets-form.create-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import {
  required,
  cardNumber,
  address,
} from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { globalize } from '@/vue/filters/globalize'
import { PAYMENT_METHODS } from '@/js/const/payment-methods.const'

const EVENTS = {
  submit: 'submit',
}

const UAH_CODE = 'UAH'

export default {
  name: 'atomic-swap-quote-assets-form',
  mixins: [FormMixin],
  props: {
    isDisabled: { type: Boolean, default: false },
  },
  data: _ => ({
    form: {
      quoteAssets: [{ asset: {}, destination: '', type: PAYMENT_METHODS.fourBill.value }],
    },
    isLoaded: false,
    isLoadFailed: false,
    isFormSubmitting: false,
    PAYMENT_METHODS,
  }),

  validations () {
    return {
      form: {
        quoteAssets: {
          $each: {
            asset: {
              required,
              // eslint-disable-next-line max-len
              selectedSameAssetCode: (asset, quoteAsset) => !this.isAssetRepeated(asset.code, quoteAsset.type),
            },
            destination: {
              cryptoAddressOrCreditCardNumber: (value, quoteAsset) => {
                if (value.length > 0) {
                  switch (quoteAsset.type) {
                    case PAYMENT_METHODS.fourBill.value:
                      return cardNumber(value)
                    case PAYMENT_METHODS.coinpayments.value:
                      return address(quoteAsset.asset.code)(value)
                    default:
                      return true
                  }
                } else {
                  return true
                }
              },
            },
            type: {
              required,
              assetPaymentType: (value, quoteAsset) => {
                switch (value) {
                  case PAYMENT_METHODS.fourBill.value:
                    return !quoteAsset.asset.isCoinpayments
                  case PAYMENT_METHODS.coinpayments.value:
                    return quoteAsset.asset.isCoinpayments
                  default:
                    return true
                }
              },
              selectedInternalSameType: _ => !this.isInternalTypeRepeated(),
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.quoteAtomicSwapAssets,
      vuexTypes.assetByCode,
      vuexTypes.accountId,
      vuexTypes.statsQuoteAsset,
    ]),
  },

  async created () {
    this.form.quoteAssets[0].asset = this.quoteAtomicSwapAssets[0] || {}
  },
  methods: {
    submit () {
      this.$emit(EVENTS.submit, this.form)
    },

    isAssetRepeated (assetCode, type) {
      const repeatedAssets = this.form.quoteAssets
        .reduce((count, quoteAsset) => {
          return quoteAsset.asset.code === assetCode && quoteAsset.type === type
            ? ++count
            : count
        }, 0)

      return repeatedAssets > 1
    },

    isInternalTypeRepeated () {
      const repeatedTypes = this.form.quoteAssets
        .reduce((count, quoteAsset) => {
          return this.isInternalPaymentMethod(quoteAsset.type)
            ? ++count
            : count
        }, 0)

      return repeatedTypes > 1
    },

    setQuoteAssetByCode (code, index) {
      this.form.quoteAssets[index].asset = this.assetByCode(code)
    },

    setQuoteAssetType (type, index) {
      if (this.isInternalPaymentMethod(type)) {
        this.form.quoteAssets[index].destination = this.accountId
        this.form.quoteAssets[index].asset = this.statsQuoteAsset
      } else {
        this.form.quoteAssets[index].destination = ''
      }
      this.form.quoteAssets[index].type = type
    },

    addQuoteAsset () {
      this.form.quoteAssets.push({
        destination: '',
        asset: this.quoteAtomicSwapAssets[0],
        type: PAYMENT_METHODS.fourBill.value,
      })
    },

    deleteQuoteAsset (index) {
      this.form.quoteAssets.splice(index, 1)
    },

    canDeleteQuoteAsset (index) {
      return this.form.quoteAssets.length > 1
    },

    getDestinationLabel (type) {
      return globalize(
        type === PAYMENT_METHODS.coinpayments.value
          ? 'atomic-swap-quote-assets-form.address-lbl'
          : 'atomic-swap-quote-assets-form.card-number-lbl'
      )
    },

    isInternalPaymentMethod (type) {
      return type === PAYMENT_METHODS.internal.value
    },

    getAssetName (asset) {
      return asset.code === UAH_CODE
        ? 'Ukrainian hryvnia'
        : asset.name
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.atomic-swap-quote-assets-form__add-asset {
  margin-top: 1rem;
}

.atomic-swap-quote-assets-form__add-asset-btn {
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  color: $col-btn;

  &:after {
    content: '';
    position: absolute;
    border-bottom: dotted 0.1rem;
    bottom: 0.1rem;
    left: 0;
    width: 100%;
    height: 0.1rem;
  }

  &:disabled {
    filter: grayscale(1);
    opacity: 0.7;
    cursor: default;
  }
}

.atomic-swap-quote-assets-form__asset-wrp {
  margin-top: 3rem;
}

.atomic-swap-quote-assets-form__delete-asset-btn {
  margin-top: 1.4rem;
  margin-left: 0.6rem;
  max-width: 2.4rem;
  max-height: 2.4rem;
  color: $col-primary-flat-inactive;
  transition: 0.2s color;

  &:disabled {
    filter: grayscale(100%);
    cursor: default;
  }

  &:enabled:hover,
  &:enabled:focus {
    color: $col-btn;
  }
}

.atomic-swap-quote-assets-form__delete-asset-icon {
  font-size: 2.4rem;
}

.atomic-swap-quote-assets-form__assets-subheading-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.atomic-swap-quote-assets-form__assets-subheading {
  margin-top: 0;
}
</style>
