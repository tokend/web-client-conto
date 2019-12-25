<template>
  <div class="atomic-swaps-explore">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'atomic-swaps-explore.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="list.length">
          <card-list v-slot="{ item }" :list="list">
            <atomic-swap-card
              :atomic-swap-ask="item"
              @buy="buyAsset(item)"
              @vue-details="selectItem(item)"
            />
          </card-list>
        </template>

        <template v-else>
          <no-data-message
            class="atomic-swaps-explore__no-data-message"
            icon-name="swap-horizontal"
            :title="'atomic-swaps-explore.no-list-title' | globalize"
            :message="'atomic-swaps-explore.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-cards-loader />
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
    <template>
      <drawer
        v-if="isLoggedIn"
        :is-shown.sync="isBuyFormDrawerShown"
      >
        <template slot="heading">
          {{ 'atomic-swaps-explore.buying' |
            globalize({asset: atomicSwapToBrowse.baseAssetName}) }}
        </template>
        <atomic-swap-form
          @update-list="updateList()"
          @update-list-and-close-drawer="(isBuyFormDrawerShown = false) ||
            updateList()"
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
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import CardList from '@/vue/common/CardList'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'atomic-swaps-explore',

  components: {
    CollectionLoader,
    Drawer,
    AtomicSwapCard,
    AtomicSwapViewer,
    NoDataMessage,
    AtomicSwapForm,
    SkeletonCardsLoader,
    CardList,
    ErrorMessage,
  },

  mixins: [UpdateList],
  props: {
    businessId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      list: [],
      isBuyFormDrawerShown: false,
      isAtomicSwapDetailsDrawerShown: false,
      atomicSwapToBrowse: {},
      filters: {
        isOwnedByCurrentUser: false,
      },
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
      let response = {}
      let filter = {
        ...(
          this.businessId
            ? { owner: this.businessId }
            : { owner: this.accountId }
        ),
      }

      try {
        response = await api.get('/integrations/marketplace/offers', {
          filter: filter,
        })
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoaded = true
      return response
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
      this.isLoaded = false
      this.isLoadFailed = false
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
