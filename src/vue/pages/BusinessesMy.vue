<template>
  <div class="businesses-my">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'businesses-my.loading-error-msg' | globalize" />
      </template>
      <template v-else>
        <template v-if="myBusinesses.length">
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
        <template v-else>
          <no-data-message
            class="businesses-my__no-data-message"
            icon-name="domain"
            :title="'businesses-my.no-list-title' | globalize"
            :message="'businesses-my.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <skeleton-cards-loader />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import BusinessCard from './businesses-all/BusinessCard'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'

import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'businesses-my',

  components: {
    BusinessCard,
    SkeletonCardsLoader,
    NoDataMessage,
    ErrorMessage,
  },

  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      myBusinesses: vuexTypes.myBusinesses,
    }),
  },

  async created () {
    try {
      await this.loadMyBusinesses()
    } catch (error) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
    }),
    ...mapMutations({
      setBusinessToBrowse: vuexTypes.SELECT_BUSINESS_TO_BROWSE,
    }),

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
