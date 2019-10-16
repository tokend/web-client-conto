<template>
  <div class="promo-codes-list">
    <template v-if="list.length">
      <div class="promo-codes-list__cards">
        <div
          class="promo-codes-list__card"
          v-for="item in list"
          :key="item.id"
        >
          <button
            class="promo-codes-list__card-btn"
            @click="setPromoCodeToBrowse(item)"
          >
            <promo-code-card :promo-code="item" />
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && isLoading">
      <div class="promo-codes-list__cards">
        <div
          class="promo-codes-list__card"
          v-for="item in 5"
          :key="item"
        >
          <promo-code-card-skeleton />
        </div>
      </div>
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
import PromoCodeCardSkeleton from './promo-codes/PromoCodeCardSkeleton'
import PromoCodeViewer from './promo-codes/PromoCodeViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'

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
    PromoCodeCardSkeleton,
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
<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;

.promo-codes-list__cards {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.promo-codes-list__card {
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

.promo-codes-list__card-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
}
</style>
