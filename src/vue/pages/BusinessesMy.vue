<template>
  <div class="businesses-my">
    <template v-if="isLoaded && myBusinesses.length">
      <div class="app__card-list">
        <div
          class="app__card-list-item"
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

    <template v-else-if="isLoadingFailed">
      <p>{{ 'businesses-my.loading-error-msg' | globalize }}</p>
    </template>

    <template v-else-if="!myBusinesses.length && !isLoaded">
      <no-data-message
        class="businesses-my__no-data-message"
        icon-name="domain"
        :title="'businesses-my.no-list-title' | globalize"
        :message="'businesses-my.no-list-msg' | globalize"
      />
    </template>

    <template v-else>
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
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import BusinessCard from './businesses-all/BusinessCard'
import SkeletonLoaderCard from '@/vue/common/skeleton-loader/SkeletonLoaderCard'

import { vueRoutes } from '@/vue-router/routes'
import { ITEMS_PER_SKELETON_LOADER } from '@/js/const/skeleton-cards-loader.const'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'businesses-my',

  components: {
    CollectionLoader,
    BusinessCard,
    SkeletonLoaderCard,
    NoDataMessage,
  },

  data () {
    return {
      isLoaded: false,
      ITEMS_PER_SKELETON_LOADER,
      isLoadingFailed: false,
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
      setBusinessToBrowse: vuexTypes.SELECT_BUSINESS_TO_BROWSE,
    }),

    async getList () {
      let result = {}
      try {
        result = await this.loadMyBusinesses(true)
        this.isLoaded = true
      } catch (error) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }

      return result
    },

    async selectItem (item) {
      this.setBusinessToBrowse(item.record)
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

$filter-field-to-filter-field-margin: 2rem;

.businesses-my__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.businesses-my__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.businesses-my__loader {
  margin-top: 1rem;
}

.businesses-my__no-data-message {
  margin-top: 4.8rem;
}
</style>
