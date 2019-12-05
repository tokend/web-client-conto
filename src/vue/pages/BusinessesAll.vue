<template>
  <div class="businesses-all">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'businesses-all.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="businesses.length">
          <card-list v-slot="{ item }" :list="businesses">
            <business-card
              :business="item"
              @vue-details="selectItem(item)"
              @business-added="loadMyBusinesses()"
            />
          </card-list>
        </template>

        <template v-else>
          <no-data-message
            class="businesses-all__no-data-message"
            icon-name="domain"
            :title="'businesses-all.no-list-title' | globalize"
            :message="'businesses-all.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-cards-loader />
    </template>

    <div class="businesses-all__requests-collection-loader">
      <collection-loader
        class="businesses-all__loader"
        :first-page-loader="getList"
        @first-page-load="setAllBusinesses"
        @next-page-load="concatAllBusinesses"
        ref="listCollectionLoader"
      />
    </div>
    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'businesses-all.business-details-title' | globalize }}
      </template>

      <business-attributes
        :business="currentBusiness"
      />

      <h3 class="businesses-all__bussiness-assets-title">
        {{ 'businesses-all.business-assets-title' | globalize }}
      </h3>
      <business-assets-viewer
        :business="currentBusiness"
      />
    </drawer>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import BusinessCard from './businesses-all/BusinessCard'
import SkeletonCardsLoader
  from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import Drawer from '@/vue/common/Drawer'
import BusinessAttributes from './businesses-all/BusinessAttributes'
import BusinessAssetsViewer from './businesses-all/BusinessAssetsViewer'
import CardList from '@/vue/common/CardList'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'businesses-all',

  components: {
    CollectionLoader,
    BusinessCard,
    SkeletonCardsLoader,
    NoDataMessage,
    ErrorMessage,
    Drawer,
    BusinessAttributes,
    BusinessAssetsViewer,
    CardList,
  },

  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
      currentBusiness: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.allBusinesses,
    ]),

    isSponsorshipPage () {
      return this.$route.name === vueRoutes.sponsorshipAllBusinesses.name
    },

    businesses () {
      let businesses = []
      if (this.isSponsorshipPage) {
        businesses = this.allBusinesses
          .filter(item => item.accountId !== this.accountId)
      } else {
        businesses = this.allBusinesses
      }
      return businesses
    },
  },

  async created () {
    await this.loadMyBusinesses()
  },

  methods: {
    ...mapActions({
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
      loadAllBusinesses: vuexTypes.LOAD_ALL_BUSINESSES,
    }),
    ...mapMutations({
      setAllBusinesses: vuexTypes.SET_ALL_BUSINESSES,
      concatAllBusinesses: vuexTypes.CONCAT_ALL_BUSINESSES,
    }),

    async getList () {
      this.isLoadFailed = false
      this.isLoaded = false
      let result
      try {
        result = await this.loadAllBusinesses()
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLoaded = true
      return result
    },

    async selectItem (item) {
      this.currentBusiness = item
      this.isDrawerShown = true
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    async closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.reloadList()
      await this.loadMyBusinesses()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/mixins.scss';
@import '~@scss/variables.scss';

$filter-field-to-filter-field-margin: 2rem;

.businesses-all__filters {
  margin: -$filter-field-to-filter-field-margin 0 2.4rem
    (-$filter-field-to-filter-field-margin);
}

.businesses-all__filter-field {
  margin: $filter-field-to-filter-field-margin 0 0
    $filter-field-to-filter-field-margin;
}

.businesses-all__list-item-btn {
  display: block;
  width: 100%;
  max-width: 100%;
  text-align: left;
}

.businesses-all__loader {
  margin-top: 1rem;
}

.businesses-all__no-data-message {
  margin-top: 4.8rem;
}

.businesses-all__bussiness-assets-title {
  margin: 2rem 0;
}
</style>
