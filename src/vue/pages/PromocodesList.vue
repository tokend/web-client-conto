<template>
  <div class="promocodes-list">
    <template v-if="list.length">
      <div class="promocodes-list__cards">
        <div
          class="promocodes-list__card"
          v-for="item in list"
          :key="item.id"
        >
          <button
            class="promocodes-list__card-btn"
            @click="setPromocodeToBrowse(item)"
          >
            <promocode-card :promocode="item" />
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!list.length && isLoading">
      <div class="promocodes-list__cards">
        <div
          class="promocodes-list__card"
          v-for="item in 5"
          :key="item"
        >
          <promocode-card-skeleton />
        </div>
      </div>
    </template>

    <template v-else>
      <no-data-message
        icon-name="ticket-percent"
        :title="'promocodes-list.no-list-title' | globalize"
        :message="'promocodes-list.no-list-msg' | globalize"
      />
    </template>

    <collection-loader
      class="promocodes-list__loader"
      :first-page-loader="getList"
      @first-page-load="setList"
      @next-page-load="concatList"
      ref="listCollectionLoader"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'promocodes-list.promocode-drawer-title' | globalize }}
      </template>

      <promocode-viewer
        :promocode="promocodeToBrowse"
        @promocode-deleted="closeDrawerAndUpdateList"
      />
    </drawer>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import PromocodeCard from './promocodes/PromocodeCard'
import PromocodeCardSkeleton from './promocodes/PromocodeCardSkeleton'
import PromocodeViewer from './promocodes/PromocodeViewer'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { Bus } from '@/js/helpers/event-bus'
import { PromocodeRecord } from '@/js/records/entities/promocode.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'promocodes-list',

  components: {
    CollectionLoader,
    Drawer,
    PromocodeViewer,
    PromocodeCardSkeleton,
    PromocodeCard,
    NoDataMessage,
  },

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
      isLoading: false,
      isDrawerShown: false,
      promocodeToBrowse: {},
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
      Bus.on('promocodes:updateList', () => {
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
      this.list = newList.map(i => new PromocodeRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new PromocodeRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    setPromocodeToBrowse ($event) {
      this.promocodeToBrowse = $event
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

.promocodes-list__cards {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.promocodes-list__card {
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
