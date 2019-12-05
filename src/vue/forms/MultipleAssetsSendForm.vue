<template>
  <form
    novalidate
    class="app__form multiple-assets-send-form"
    @submit.prevent="submit"
  >
    <div
      class="multiple-assets-send-form__asset-wrp"
      v-for="(_, index) in form.assets"
      :key="index"
    >
      <div class="multiple-assets-send-form__asset">
        <div
          v-if="isMoreThanOneAsset"
          class="multiple-assets-send-form__assets-subheading-wrp"
        >
          <!-- eslint-disable-next-line max-len -->
          <h3 class="app__form-subheading multiple-assets-send-form__assets-subheading">
            {{ 'multiple-assets-send-form.assets-subheading' |
              globalize({number: index + 1})
            }}
          </h3>

          <button
            type="button"
            class="multiple-assets-send-form__delete-asset-btn"
            @click="deleteAsset(index)"
            :disabled="isDisabled"
          >
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-minus-circle-outline multiple-assets-send-form__delete-asset-icon" />
          </button>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <!-- eslint-disable max-len -->
            <select-field
              :value="form.assets[index].code"
              @input="setAssetCode($event, index)"
              name="multiple-assets-send-asset"
              :label="'multiple-assets-send-form.asset-lbl' | globalize"
              @blur="touchField(`form.assets[${index}].code`)"
              :error-message="getFieldErrorMessage(`form.assets[${index}].code`)"
              :disabled="isDisabled"
            >
              <option
                v-for="asset in assets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.name }}
              </option>
            </select-field>
            <template v-if="form.assets[index].code">
              <p class="app__form-field-description">
                {{
                  'multiple-assets-send-form.balance' | globalize({
                    amount: accountBalanceByCode(form.assets[index].code).balance,
                  })
                }}
              </p>
            </template>
            <!-- eslint-enable max-len -->
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <amount-input-field
              v-model="form.assets[index].amount"
              name="multiple-assets-send-amount"
              validation-type="outgoing"
              :label="'multiple-assets-send-form.amount-lbl' | globalize"
              :asset="assetByCode(form.assets[index].code)"
              :disabled="isDisabled"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="multiple-assets-send-form__add-asset-wrp"
    >
      <div class="multiple-assets-send-form__add-asset">
        <button
          class="multiple-assets-send-form__add-asset-btn"
          type="button"
          @click="addAsset"
          :disabled="isDisabled"
        >
          {{ 'multiple-assets-send-form.add-asset-btn' | globalize }}
        </button>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        class="multiple-assets-send-form__submit-btn app__button-raised"
        :disabled="isDisabled"
      >
        {{ 'multiple-assets-send-form.send-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'multiple-assets-send-form',
  mixins: [FormMixin],
  props: {
    isDisabled: { type: Boolean, default: false },
    assets: { type: Array /** {@link AssetRecord} **/, required: true },
  },
  data: _ => ({
    form: {
      assets: [ { code: '', amount: '' } ],
    },
  }),

  validations () {
    return {
      form: {
        assets: {
          $each: {
            code: {
              required,
              selectedSameAssetCode: code => !this.isAssetRepeated(code),
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.accountBalanceByCode,
    ]),

    isMoreThanOneAsset () {
      return this.form.assets.length > 1
    },
  },

  async created () {
    this.form.assets[0].code = this.assets[0].code
  },
  methods: {
    submit () {
      this.$emit(EVENTS.submit, this.form.assets)
    },

    isAssetRepeated (assetCode) {
      const repeatedAssets = this.form.assets
        .reduce((count, asset) => {
          return asset.code === assetCode
            ? ++count
            : count
        }, 0)

      return repeatedAssets > 1
    },

    setAssetCode (code, index) {
      this.form.assets[index].code = code
    },

    addAsset () {
      this.form.assets.push({
        amount: '',
        code: this.assets[0].code,
      })
    },

    deleteAsset (index) {
      this.form.assets.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.multiple-assets-send-form__add-asset {
  margin-top: 1rem;
}

.multiple-assets-send-form__add-asset-btn {
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

.multiple-assets-send-form__asset-wrp {
  margin-top: 3rem;
}

.multiple-assets-send-form__delete-asset-btn {
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

.multiple-assets-send-form__delete-asset-icon {
  font-size: 2.4rem;
}

.multiple-assets-send-form__assets-subheading-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.multiple-assets-send-form__assets-subheading {
  margin-top: 0;
}
</style>
