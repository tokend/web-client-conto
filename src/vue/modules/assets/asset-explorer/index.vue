<template>
  <div class="assets-explorer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'assets.loading-error-msg' | globalize" />
      </template>
      <template v-else>
        <template v-if="accountBalances.length">
          <div class="app__card-list">
            <div
              class="app__card-list-item"
              v-for="accountBalance in accountBalances"
              :key="accountBalance.id"
            >
              <asset-card
                :balance="accountBalance"
                @transfer="transfer"
                @vue-details="selectBalance(accountBalance)"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <no-data-message
            icon-name="trending-up"
            :title="'assets.no-assets-title' | globalize"
            :message="'assets.no-assets-msg' | globalize"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <skeleton-cards-loader />
    </template>

    <drawer :is-shown.sync="isAssetDetailsDrawerShown">
      <template slot="heading">
        {{ 'assets.details-drawer-title' | globalize }}
      </template>

      <asset-attributes-viewer
        v-if="selectedBalance.asset"
        :asset-code="selectedBalance.asset.code"
      />

      <div class="assets-explorer__actions">
        <asset-actions
          :asset="selectedBalance.asset"
          @transfer="transfer"
          @update-asset="isAssetUpdateDrawerShown = true"
          @asset-deleted="(isAssetDetailsDrawerShown = false) ||
            loadAccountBalances()"
        />
      </div>
    </drawer>

    <drawer :is-shown.sync="isAssetUpdateDrawerShown">
      <template slot="heading">
        {{ 'assets.update-drawer-title' | globalize }}
      </template>

      <update-asset-form-simplified-module
        v-if="selectedBalance.asset"
        :asset-code="selectedBalance.asset.code"
        @submitted="(isAssetUpdateDrawerShown = false) ||
          loadAccountBalances() && loadAssets()"
      />
    </drawer>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form
        v-if="selectedBalance.asset"
        @operation-submitted="(isTransferDrawerShown = false) ||
          loadAccountBalances()
        "
        :asset-to-transfer="selectedBalance.asset.code"
      />
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'

import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import AssetActions from './components/asset-actions'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import UpdateAssetFormSimplifiedModule from '@modules/update-asset-form-simplified'
import AssetCard from './components/asset-card'
import TransferForm from '@/vue/forms/TransferForm'
import UpdateList from '@/vue/mixins/update-list.mixin'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'assets-explorer',
  components: {
    Drawer,
    NoDataMessage,
    ErrorMessage,
    AssetAttributesViewer,
    AssetActions,
    SkeletonCardsLoader,
    UpdateAssetFormSimplifiedModule,
    AssetCard,
    TransferForm,
  },

  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isAssetDetailsDrawerShown: false,
    isTransferDrawerShown: false,
    isAssetUpdateDrawerShown: false,
    selectedBalance: {},
    businessOwnerId: '',
    isUpdateMode: false,
  }),

  computed: {
    ...mapGetters({
      accountBalancesByOwner: vuexTypes.accountBalancesByOwner,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      accountOwnedAssetsBalances: vuexTypes.accountOwnedAssetsBalances,
      isAccountGeneral: vuexTypes.isAccountGeneral,
      myBusinesses: vuexTypes.myBusinesses,
    }),

    accountBalances () {
      try {
        let accountBalances = []
        if (this.isAccountGeneral) {
          /* eslint-disable max-len */
          let businessAccountBalances = this.businessOwnerId
            ? this.accountBalancesByOwner(this.businessOwnerId)
            : this.myBusinesses.flatMap(business => this.accountBalancesByOwner(business.accountId))
          /* eslint-enable max-len */

          accountBalances = businessAccountBalances
            .filter(item => +item.balance > 0)
        } else {
          accountBalances = this.accountOwnedAssetsBalances
        }

        return accountBalances
      } catch (error) {
        console.error(error)
        return []
      }
    },
    isDrawerShown () {
      return this.isAssetDetailsDrawerShown ||
         this.isTransferDrawerShown ||
        this.isAssetUpdateDrawerShown
    },
  },

  async created () {
    try {
      const isAssetPurchased = this.$route.params.isAssetPurchased

      if (typeof isAssetPurchased !== 'undefined') {
        if (isAssetPurchased) {
          Bus.success('assets.asset-purchased-successfully')
        } else {
          Bus.error('assets.payment-failed')
        }
      }
      await this.loadAccountBalances()
      Bus.on('assets:setBusinessOwnerId', id => {
        this.businessOwnerId = id || ''
      })
      this.listenUpdateList('assets:updateList', this.loadAccountBalancesAndSetSelectedBalance)
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isLoaded = true
  },

  beforeDestroy () {
    this.resetUpdateListEvent('assets:updateList')
  },

  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    selectBalance (balance) {
      this.selectedBalance = balance
      this.isUpdateMode = false
      this.isAssetDetailsDrawerShown = true
    },

    transfer (assetCode) {
      this.selectedBalance = this.accountBalanceByCode(assetCode)
      this.isTransferDrawerShown = true
    },

    async loadAccountBalancesAndSetSelectedBalance () {
      await this.loadAccountBalances()
      await this.loadAssets()
      if (this.isDrawerShown) {
        this.selectedBalance = this.accountBalances.find(item => {
          return item.id === this.selectedBalance.id
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins';

$media-small-height: 460px;

.assets-explorer__actions {
  margin-top: 4.9rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}
</style>
