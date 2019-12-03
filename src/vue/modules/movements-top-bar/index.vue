<template>
  <div>
    <top-bar>
      <div
        slot="main"
        class="movements-top-bar__filters"
      >
        <template v-if="isBusinessesExists">
          <div class="movements-top-bar__filter">
            <select-field
              :value="businessOwnerId"
              @input="setBusinessOwnerId"
              :label="'movements-top-bar.business-filter-label' | globalize"
              class="app__select app__select-with-label--no-border"
              need-all-option
            >
              <option
                v-for="business in myBusinesses"
                :key="business.accountId"
                :value="business.accountId"
              >
                {{ business.name }}
              </option>
            </select-field>
          </div>
        </template>

        <template v-if="isAssetsExists">
          <div class="movements-top-bar__filter">
            <select-field
              v-if="assetCode"
              :value="assetCode"
              @input="setAssetCode"
              :label="'movements-top-bar.asset-filter-label' | globalize"
              :key="`${businessOwnerId}-${assetCode}`"
              class="app__select app__select-with-label--no-border"
            >
              <option
                v-for="asset in assets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.name }}
              </option>
            </select-field>
          </div>
        </template>
      </div>
      <div
        v-if="assetCode"
        class="movements-top-bar__actions"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised movements-top-bar__actions-btn"
          @click="isTransferDrawerShown = true"
          :disabled="!(assetByCode(assetCode).isTransferable && isHaveBalance)"
          :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isTransferable) |
            globalize({ asset: assetCode })
          "
        >
          <i class="mdi mdi-send movements-top-bar__btn-icon" />
          {{ 'op-pages.send' | globalize }}
        </button>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form
        @operation-submitted="$emit(EVENTS.movementsUpdateRequired)"
        :asset-to-transfer="assetCode"
      />
    </drawer>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'
import TransferForm from '@/vue/forms/TransferForm'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  assetCodeUpdated: 'asset-code-updated',
  movementsUpdateRequired: 'movements-update-required',
}

const ASSET_POLICIES_STR = {
  isTransferable: 'isTransferable',
}

export default {
  name: 'movements-top-bar',
  components: {
    SelectField,
    TopBar,
    Drawer,
    TransferForm,
  },

  data: _ => ({
    isTransferDrawerShown: false,
    assetCode: '',
    businessOwnerId: '',
    EVENTS,
    ASSET_POLICIES_STR,
    isHaveBalance: true,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.assetsByOwner,
      vuexTypes.accountBalanceByCode,
      vuexTypes.assetByCode,
      vuexTypes.myBusinesses,
      vuexTypes.balancesAssets,
    ]),

    assets () {
      if (this.businessOwnerId) {
        return this.assetsByOwner(this.businessOwnerId)
      } else {
        return this.balancesAssets
      }
    },

    isAssetsExists () {
      return Boolean(this.assets.length)
    },

    isBusinessesExists () {
      return Boolean(this.myBusinesses.length)
    },
  },

  watch: {
    assetCode (value) {
      this.getBalance()
      this.$emit(EVENTS.assetCodeUpdated, value)
    },

    businessOwnerId () {
      if (this.isAssetsExists) {
        this.assetCode = this.assets[0].code
      } else {
        this.assetCode = ''
      }
    },
  },

  async created () {
    if (this.isAssetsExists) {
      this.assetCode = this.assets[0].code
    }
    try {
      await this.loadMyBusinesses()
      await this.loadAccountBalancesDetails()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  },

  methods: {
    ...mapActions({
      loadAccountBalancesDetails: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
    }),

    setAssetCode (code) {
      this.assetCode = code
    },

    setBusinessOwnerId (id) {
      this.businessOwnerId = id
    },

    getMessageIdForPolicy (policy) {
      let messageId = ''
      const asset = this.assetByCode(this.assetCode)
      if (!asset[policy]) {
        messageId = 'op-pages.not-transferable-msg'
      }
      return messageId
    },

    getBalance () {
      const balance = +this.accountBalanceByCode(this.assetCode).balance
      this.isHaveBalance = balance > 0
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.movements-top-bar__actions {
  display: flex;
  justify-content: space-between;
}

.movements-top-bar__actions-btn {
  margin-right: 1.2rem;

  &:last-child {
    margin-right: 0;
  }
}

.movements-top-bar__actions-btn.app__button-raised {
  line-height: 1;
}

.movements-top-bar__btn-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.movements-top-bar__filters {
  display: flex;
  flex-direction: row;

  @include respond-to-custom($sidebar-hide-bp) {
    flex-direction: column;
  }
}

.movements-top-bar__filter {
  margin-right: 3rem;

  @include respond-to-custom($sidebar-hide-bp) {
    margin-bottom: 1rem;
  }
}
</style>
