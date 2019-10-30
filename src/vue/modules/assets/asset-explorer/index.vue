<template>
  <div class="assets-explorer">
    <div class="app__card-list">
      <template v-for="accountBalance in accountBalances">
        <div class="app__card-list-item" :key="accountBalance.id">
          <asset-card
            :balance="accountBalance"
            @transfer="transfer"
            @vue-details="selectBalance(accountBalance)"
          />
        </div>
      </template>
      <template v-for="index in ITEMS_PER_SKELETON_LOADER">
        <div class="app__card-list-item" :key="index">
          <skeleton-loader-card
            v-if="!isLoaded && !accountBalances.length"
          />
        </div>
      </template>

      <no-data-message
        v-if="isLoaded && !accountBalances.length"
        icon-name="trending-up"
        :title="'assets.no-assets-title' | globalize"
        :message="'assets.no-assets-msg' | globalize"
      />
    </div>

    <template v-if="isLoadFailed">
      <p class="assets-explorer__error-msg">
        {{ 'assets.load-failed-msg' | globalize }}
      </p>
    </template>

    <drawer :is-shown.sync="isAssetDetailsDrawerShown">
      <template slot="heading">
        {{ 'assets.details-drawer-title' | globalize }}
      </template>

      <asset-attributes-viewer
        :asset="selectedBalance.asset"
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
          loadAccountBalances()"
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

import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import AssetActions from './components/asset-actions'
import SkeletonLoaderCard from '@/vue/common/skeleton-loader/SkeletonLoaderCard'
import UpdateAssetFormSimplifiedModule from '@modules/update-asset-form-simplified'
import AssetCard from './components/asset-card'
import TransferForm from '@/vue/forms/TransferForm'
import UpdateList from '@/vue/mixins/update-list.mixin'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ALL_VALUE } from '@/js/const/select-field-default-values.const'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { ITEMS_PER_SKELETON_LOADER } from '@/js/const/skeleton-loader.const'

export default {
  name: 'assets-explorer',
  components: {
    Drawer,
    NoDataMessage,
    AssetAttributesViewer,
    AssetActions,
    SkeletonLoaderCard,
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
    businessOwnerId: ALL_VALUE,
    ITEMS_PER_SKELETON_LOADER,
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
          let businessAccountBalances = this.businessOwnerId === ALL_VALUE
            ? this.myBusinesses.flatMap(business => this.accountBalancesByOwner(business.accountId))
            : this.accountBalancesByOwner(this.businessOwnerId)
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
      await this.loadAccountBalances()
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback()
    }

    Bus.on('assets:setBusinessOwnerId', id => {
      this.businessOwnerId = id || ''
    })

    this.listenUpdateList('assets:updateList', this.loadAccountBalancesAndSetSelectedBalance)
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
