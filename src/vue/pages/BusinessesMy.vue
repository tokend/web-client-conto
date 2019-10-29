<template>
  <div class="businesses-my">
    <template v-if="myBusinesses.length">
      <div class="businesses-my__list">
        <div
          class="businesses-my__list-item-wrp"
          v-for="item in myBusinesses"
          :key="item.accountId"
        >
          <business-card
            :business="item"
            @vue-details="selectItem(item)"
          />
        </div>
      </div>
    </template>

    <template v-else-if="!myBusinesses.length && isLoading">
      <div class="businesses-my__list">
        <div
          class="businesses-my__list-item-wrp"
          v-for="item in 5"
          :key="item"
        >
          <business-card-skeleton />
        </div>
      </div>
    </template>

    <template v-else-if="!myBusinesses.length && !isLoading">
      <no-data-message
        class="businesses-my__no-data-message"
        icon-name="domain"
        :title="'businesses-my.no-list-title' | globalize"
        :message="'businesses-my.no-list-msg' | globalize"
      />
    </template>

    <div class="businesses-my__requests-collection-loader">
      <collection-loader
        class="businesses-my__loader"
        :first-page-loader="getList"
        @first-page-load="setMyBusinesses"
        @next-page-load="concatMyBusinesses"
        ref="listCollectionLoader"
      />
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import BusinessCard from './businesses-all/BusinessCard'
import BusinessCardSkeleton from './businesses-all/BusinessCardSkeleton'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'businesses-my',

  components: {
    CollectionLoader,
    BusinessCard,
    BusinessCardSkeleton,
    NoDataMessage,
  },

  data () {
    return {
      isLoading: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      myBusinesses: vuexTypes.myBusinesses,
    }),
  },

  methods: {
    ...mapActions({
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
    }),
    ...mapMutations({
      setMyBusinesses: vuexTypes.SET_MY_BUSINESSES,
      concatMyBusinesses: vuexTypes.CONCAT_MY_BUSINESSES,
    }),

    async getList () {
      this.isLoading = true

      let result = {}
      try {
        result = await this.loadMyBusinesses(true)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    async selectItem (item) {
      await this.$router.push({
        ...vueRoutes.currentBusiness,
        params: {
          id: item.accountId,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$list-item-margin: 2rem;
$filter-field-to-filter-field-margin: 2rem;

.businesses-my__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.businesses-my__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.businesses-my__list {
  display: flex;
  flex-wrap: wrap;
  margin: -$list-item-margin 0 0 (-$list-item-margin);
}

.businesses-my__list-item-wrp {
  margin: $list-item-margin 0 0 $list-item-margin;
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
    @include list-item-width(33%);
  }
  @include respond-to(small) {
    @include list-item-width(50%);
  }
  @include respond-to(xsmall) {
    @include list-item-width(100%);
  }
}

.businesses-my__loader {
  margin-top: 1rem;
}

.businesses-my__no-data-message {
  margin-top: 4.8rem;
}
</style>
