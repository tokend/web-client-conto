<template>
  <div class="atomic-swaps-explore">
    <template v-if="list.length">
      <div class="app__card-list">
        <div
          class="app__card-list-item"
          v-for="item in list"
          :key="item.id"
        >
          <atomic-swap-card
            :atomic-swap-ask="item"
            @buy="buyAsset(item)"
            @vue-details="selectItem(item)"
          />
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && isLoading">
      <div class="app__card-list">
        <div
          class="app__card-list-item"
          v-for="index in ITEMS_PER_SKELETON_LOADER"
          :key="index"
        >
          <skeleton-loader-card />
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && !isLoading">
      <no-data-message
        class="atomic-swaps-explore__no-data-message"
        icon-name="swap-horizontal"
        :title="'atomic-swaps-explore.no-list-title' | globalize"
        :message="'atomic-swaps-explore.no-list-msg' | globalize"
      />
    </template>

    <div class="atomic-swaps-explore__requests-collection-loader">
      <collection-loader
        class="atomic-swaps-explore__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>
    <template v-if="isLoggedIn">
      <drawer :is-shown.sync="isBuyFormDrawerShown">
        <template slot="heading">
          {{ 'atomic-swaps-explore.buying' |
            globalize({asset: atomicSwapToBrowse.baseAssetName}) }}
        </template>
        <atomic-swap-form
          @update-list="updateList()"
          :atomic-swap-ask="atomicSwapToBrowse"
        />
      </drawer>
      <drawer :is-shown.sync="isAtomicSwapDetailsDrawerShown">
        <template slot="heading">
          {{ 'atomic-swaps-explore.atomic-swap-drawer-title' | globalize }}
        </template>

        <atomic-swap-viewer
          :current-atomic-swap-ask="atomicSwapToBrowse"
          @close-drawer-and-update-list="closeDrawerAndUpdateList()"
        />
      </drawer>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import AtomicSwapCard from './AtomicSwapCard'
import AtomicSwapViewer from './AtomicSwapViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import UpdateList from '@/vue/mixins/update-list.mixin'
import AtomicSwapForm from '@modules/atomic-swap-form'
import SkeletonLoaderCard from '@/vue/common/skeleton-loader/SkeletonLoaderCard'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ITEMS_PER_SKELETON_LOADER } from '@/js/const/skeleton-loader.const'

export default {
  name: 'atomic-swaps-explore',

  components: {
    CollectionLoader,
    Drawer,
    AtomicSwapCard,
    AtomicSwapViewer,
    NoDataMessage,
    AtomicSwapForm,
    SkeletonLoaderCard,
  },

  mixins: [UpdateList],
  props: {
    businessId: {
      type: String,
      default: '',
    },
    selectedAssetCode: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isLoading: false,
      list: [],
      isBuyFormDrawerShown: false,
      isAtomicSwapDetailsDrawerShown: false,
      atomicSwapToBrowse: {},
      filters: {
        isOwnedByCurrentUser: false,
      },
      ITEMS_PER_SKELETON_LOADER,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isCorporate: vuexTypes.isAccountCorporate,
      isLoggedIn: vuexTypes.isLoggedIn,
    }),
  },

  watch: {
    'filters.isOwnedByCurrentUser' () {
      this.reloadList()
    },
  },

  async created () {
    await this.loadAssets()
    this.listenUpdateList('atomicSwaps:updateList', this.reloadList)
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    async getList () {
      this.isLoading = true

      let result
      let filter = {
        ...(
          this.businessId
            ? { owner: this.businessId }
            : { owner: this.accountId }
        ),
      }

      try {
        result = await api.get('/integrations/marketplace/offers', {
          filter: filter,
        })
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    setList (newList) {
      this.list = newList.map(i => new AtomicSwapAskRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new AtomicSwapAskRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    async buyAsset (item) {
      if (this.$route.name === vueRoutes.business.name) {
        await this.$router.push({
          ...vueRoutes.pay,
          query: {
            id: item.id,
          },
        })
      } else {
        this.atomicSwapToBrowse = item
        this.isBuyFormDrawerShown = true
      }
    },

    selectItem (item) {
      this.atomicSwapToBrowse = item
      this.isAtomicSwapDetailsDrawerShown = true
    },

    closeDrawerAndUpdateList () {
      this.isAtomicSwapDetailsDrawerShown = false
      this.isBuyFormDrawerShown = false
      this.emitUpdateList('atomicSwaps:updateList')
    },
    updateList () {
      this.emitUpdateList('atomicSwaps:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
.atomic-swaps-explore__loader {
  margin-top: 1rem;
}
</style>
