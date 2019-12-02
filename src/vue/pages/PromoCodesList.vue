<template>
  <div class="promo-codes-list">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'promo-codes-list.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="list.length">
          <card-list v-slot="{ item }" :list="list">
            <promo-code-card
              :promo-code="item"
              @vue-details="setPromoCodeToBrowse(item)"
            />
          </card-list>
        </template>

        <template v-else>
          <no-data-message
            icon-name="ticket-percent"
            :title="'promo-codes-list.no-list-title' | globalize"
            :message="'promo-codes-list.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-cards-loader />
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
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import PromoCodeViewer from './promo-codes/PromoCodeViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CardList from '@/vue/common/CardList'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { Bus } from '@/js/helpers/event-bus'
import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'promo-codes-list',

  components: {
    CollectionLoader,
    Drawer,
    PromoCodeViewer,
    SkeletonCardsLoader,
    PromoCodeCard,
    NoDataMessage,
    CardList,
    ErrorMessage,
  },

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
      promoCodeToBrowse: {},
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
      let response = {}

      try {
        response = await api.getWithSignature(
          `/integrations/marketplace/promocodes`,
          { filter: { owner: this.accountId } },
        )
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoaded = true
      return response
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
      this.isLoaded = false
      this.isLoadFailed = false
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
