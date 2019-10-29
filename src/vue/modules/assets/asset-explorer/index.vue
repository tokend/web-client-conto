<template>
  <div class="assets-explorer">
    <template>
      <drawer :is-shown.sync="isDrawerShown">
        <template v-if="isUpdateMode">
          <template slot="heading">
            {{ 'assets.update-drawer-title' | globalize }}
          </template>

          <update-asset-form-simplified-module
            :asset-code="selectedBalance.asset.code"
            @submitted="(isDrawerShown = false) || loadAccountBalances()"
          />
        </template>

        <template v-else>
          <template slot="heading">
            {{ 'assets.details-drawer-title' | globalize }}
          </template>

          <asset-attributes-viewer
            :asset="selectedBalance.asset"
          />

          <div class="assets-explorer__actions">
            <asset-actions
              :asset="selectedBalance.asset"
              @update-asset="isUpdateMode = true"
              @asset-transfered="loadAccountBalances()"
              @asset-deleted="(isDrawerShown = false) || loadAccountBalances()"
            />
          </div>
        </template>
      </drawer>

      <div class="assets-explorer__asset-list-wrp">
        <div class="assets-explorer__asset-list">
          <template v-for="accountBalance in accountBalances">
            <asset-card
              :key="accountBalance.id"
              :balance="accountBalance"
              @vue-details="selectBalance(accountBalance)"
            />
          </template>
          <template v-for="index in itemsPerSkeletonLoader">
            <asset-skeleton-loader
              v-if="!isLoaded && !accountBalances.length"
              :key="index"
            />
          </template>
        </div>

        <no-data-message
          v-if="isLoaded && !accountBalances.length"
          icon-name="trending-up"
          :title="'assets.no-assets-title' | globalize"
          :message="'assets.no-assets-msg' | globalize"
        />
      </div>
    </template>

    <template v-if="isLoadFailed">
      <p class="assets-explorer__error-msg">
        {{ 'assets.load-failed-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'

import AssetAttributesViewer from '../shared/components/asset-attributes-viewer'
import AssetActions from './components/asset-actions'
import AssetSkeletonLoader from './components/asset-skeleton-loader'
import UpdateAssetFormSimplifiedModule from '@modules/update-asset-form-simplified'
import AssetCard from './components/asset-card'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ALL_VALUE } from '@/js/const/select-field-default-values.const'
import { ErrorHandler } from '@/js/helpers/error-handler'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'assets-explorer',
  components: {
    Drawer,
    NoDataMessage,
    AssetAttributesViewer,
    AssetActions,
    AssetSkeletonLoader,
    UpdateAssetFormSimplifiedModule,
    AssetCard,
  },

  mixins: [UpdateList],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    selectedBalance: {},
    businessOwnerId: ALL_VALUE,
    itemsPerSkeletonLoader: 3,
    isUpdateMode: false,
  }),

  computed: {
    ...mapGetters({
      accountBalancesByOwner: vuexTypes.accountBalancesByOwner,
      accountOwnedAssetsBalances: vuexTypes.accountOwnedAssetsBalances,
      isCustomerUiShown: vuexTypes.isCustomerUiShown,
      myBusinesses: vuexTypes.myBusinesses,
    }),

    accountBalances () {
      try {
        let accountBalances = []
        // if (this.isCustomerUiShown) {
        /* eslint-disable max-len */
        let businessAccountBalances = this.businessOwnerId === ALL_VALUE
          ? this.myBusinesses.flatMap(business => this.accountBalancesByOwner(business.accountId))
          : this.accountBalancesByOwner(this.businessOwnerId)
          /* eslint-enable max-len */

        accountBalances = businessAccountBalances
          .filter(item => +item.balance > 0)
        // } else {
        //   accountBalances = this.accountOwnedAssetsBalances
        // }

        return accountBalances
      } catch (error) {
        console.error(error)
        return []
      }
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
      this.isDrawerShown = true
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

$asset-card-margin: 0.75rem;
$media-small-height: 460px;
$list-item-margin: 2rem;

.assets-explorer__actions {
  margin-top: 4.9rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}

.assets-explorer__asset-list-wrp {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -$asset-card-margin;
}

.assets-explorer__asset-list {
  margin: $list-item-margin $list-item-margin 0 0;
  width: calc(100% + #{$list-item-margin});

  $media-desktop: 1130px;
  $media-small-desktop: 960px;

  @mixin list-item-width($width) {
    flex: 0 1 calc(#{$width} - (#{$list-item-margin}));
    max-width: calc(#{$width} - (#{$list-item-margin}));
  }

  @include list-item-width(25%);
  @include respond-to-custom($media-desktop) {
    @include list-item-width(33%);
  }
  @include respond-to-custom($media-small-desktop) {
    @include list-item-width(50%);
  }
  @include respond-to-custom($sidebar-hide-bp) {
    @include list-item-width(50%);
  }
  @include respond-to(small) {
    @include list-item-width(100%);
  }
  @include respond-to(xsmall) {
    @include list-item-width(100%);
  }
}
</style>
