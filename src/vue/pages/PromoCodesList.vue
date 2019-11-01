<template>
  <div class="promo-codes-list">
    <template v-if="list.length">
      <div class="app__card-list">
        <div
          class="app__card-list-item"
          v-for="item in list"
          :key="item.id"
        >
          <promo-code-card
            :promo-code="item"
            @vue-details="setPromoCodeToBrowse(item)"
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

    <template v-else-if="isLoadFailed">
      <p>{{ 'promo-codes-list.load-failed-msg' | globalize }}</p>
    </template>

    <template v-else>
      <no-data-message
        icon-name="ticket-percent"
        :title="'promo-codes-list.no-list-title' | globalize"
        :message="'promo-codes-list.no-list-msg' | globalize"
      />
    </template>

    <collection-loader
      class="promo-codes-list__loader"
      :first-page-loader="getList"
      @first-page-load="setList"
      @next-page-load="concatList"
      ref="listCollectionLoader"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'promo-codes-list.promo-code-drawer-title' | globalize }}
      </template>

      <promo-code-viewer
        :promo-code="promoCodeToBrowse"
        @promo-code-deleted="closeDrawerAndUpdateList"
      />
    </drawer>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import PromoCodeCard from './promo-codes/PromoCodeCard'
import SkeletonLoaderCard from '@/vue/common/skeleton-loader/SkeletonLoaderCard'
import PromoCodeViewer from './promo-codes/PromoCodeViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { Bus } from '@/js/helpers/event-bus'
import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ITEMS_PER_SKELETON_LOADER } from '@/js/const/skeleton-cards-loader.const'

export default {
  name: 'promo-codes-list',

  components: {
    CollectionLoader,
    Drawer,
    PromoCodeViewer,
    SkeletonLoaderCard,
    PromoCodeCard,
    NoDataMessage,
  },

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
      isLoading: false,
      isDrawerShown: false,
      promoCodeToBrowse: {},
      ITEMS_PER_SKELETON_LOADER,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },

  created () {
    this.listen()
  },

  methods: {
    listen () {
      Bus.on('promoCodes:updateList', () => {
        this.reloadList()
      })
    },

    async getList () {
      this.isLoading = true
      let result

      try {
        result = await api.getWithSignature(
          `/integrations/marketplace/promocodes`,
          { filter: { owner: this.accountId } },
        )
        this.isLoaded = true
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    setList (newList) {
      this.list = newList.map(i => new PromoCodeRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new PromoCodeRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    setPromoCodeToBrowse ($event) {
      this.promoCodeToBrowse = $event
      this.isDrawerShown = true
    },

    closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.reloadList()
    },
  },
}
</script>
