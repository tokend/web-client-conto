<template>
  <div class="businesses-all">
    <template v-if="allBusinesses.length">
      <div class="app__card-list">
        <div
          class="app__card-list-item"
          v-for="item in allBusinesses"
          :key="item.accountId"
        >
          <business-card
            :business="item"
            @vue-details="selectItem(item)"
            @business-added="loadMyBusinesses()"
          />
        </div>
      </div>
    </template>

    <template v-else-if="!allBusinesses.length && isLoading">
      <div class="app__card-list">
        <div
          class="app__card-list-item"
          v-for="item in 5"
          :key="item"
        >
          <business-card-skeleton />
        </div>
      </div>
    </template>

    <template v-else-if="!allBusinesses.length && !isLoading">
      <no-data-message
        class="businesses-all__no-data-message"
        icon-name="domain"
        :title="'businesses-all.no-list-title' | globalize"
        :message="'businesses-all.no-list-msg' | globalize"
      />
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'businesses-all.business-details-title' | globalize }}
      </template>

      <business-attributes
        :business="currentBusiness"
      />
      <template v-if="!isBusinessOwner">
        <h3 class="businesses-all__bussiness-assets-title">
          {{ 'businesses-all.business-assets-title' | globalize }}
        </h3>
        <business-assets-viewer
          :business="currentBusiness"
        />
      </template>
    </drawer>

    <div class="businesses-all__requests-collection-loader">
      <collection-loader
        class="businesses-all__loader"
        :first-page-loader="getList"
        @first-page-load="setAllBusinesses"
        @next-page-load="concatAllBusinesses"
        ref="listCollectionLoader"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import BusinessCard from './businesses-all/BusinessCard'
import BusinessCardSkeleton from './businesses-all/BusinessCardSkeleton'
import Drawer from '@/vue/common/Drawer'
import BusinessAttributes from './businesses-all/BusinessAttributes'
import BusinessAssetsViewer from './businesses-all/BusinessAssetsViewer'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'businesses-all',

  components: {
    CollectionLoader,
    BusinessCard,
    BusinessCardSkeleton,
    NoDataMessage,
    Drawer,
    BusinessAttributes,
    BusinessAssetsViewer,
  },

  data () {
    return {
      isLoading: false,
      isDrawerShown: false,
      currentBusiness: {},
      isMyBusiness: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isAccountGeneral: vuexTypes.isAccountGeneral,
      myBusinesses: vuexTypes.myBusinesses,
      allBusinesses: vuexTypes.allBusinesses,
    }),

    isBusinessOwner () {
      return Boolean(this.currentBusiness.accountId === this.accountId)
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
      setBusinessToBrowse: vuexTypes.SELECT_BUSINESS_TO_BROWSE,
    }),

    async getList () {
      this.isLoading = true

      let result
      try {
        result = await this.loadAllBusinesses()
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    async selectItem (item) {
      if (this.isAccountGeneral) {
        this.setBusinessToBrowse(item)
        await this.$router.push({
          ...vueRoutes.currentBusiness,
          params: {
            id: item.accountId,
          },
        })
      } else {
        this.currentBusiness = item
        this.isDrawerShown = true
      }
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
