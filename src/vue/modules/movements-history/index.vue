<template>
  <div class="movements-history">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'movements-history.movements-load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="movements.length">
          <movements-table
            :movements="movements"
            :is-customer-movements="isCustomerMovements"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="chart-areaspline"
            :title="'movements-history.no-movements-title' | globalize"
            :message="'movements-history.no-movements-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-table
        :cells="isCustomerMovements ? 4 : 5"
        need-button
      />
    </template>

    <div class="movements-history__collection-loader-wrp">
      <collection-loader
        v-if="assetCode || isCustomerMovements"
        v-show="isLoaded"
        :first-page-loader="firstPageLoader"
        @first-page-load="setMovements"
        @next-page-load="concatMovements"
        :ref="REFS.collectionLoader"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import MovementsTable from './components/movements-table'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { CustomerRecord } from '@/js/records/entities/customer.record'

const REFS = {
  collectionLoader: 'collection-loader',
}

export default {
  name: 'movements-history-module',
  components: {
    MovementsTable,
    CollectionLoader,
    SkeletonLoaderTable,
    ErrorMessage,
    NoDataMessage,
  },
  props: {
    assetCode: {
      type: String,
      default: '',
    },
    isHistory: {
      type: Boolean,
      default: true,
    },
    customer: {
      type: CustomerRecord,
      default: null,
    },
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    REFS,
  }),

  computed: {
    ...mapGetters({
      movements: vuexTypes.movements,
    }),

    isCustomerMovements () {
      return Boolean(this.customer)
    },

    firstPageLoader () {
      // HACK: passing this.assetCode and this.customer.accountId directly
      // to function will lead to losing reactivity
      const assetCode = this.assetCode
      let accountId = ''

      if (this.isCustomerMovements) {
        accountId = this.customer.accountId
      }

      return _ => this.loadMovementsFirstPage(assetCode, accountId)
    },
  },

  methods: {
    ...mapMutations({
      setMovements: vuexTypes.SET_MOVEMENTS,
      concatMovements: vuexTypes.CONCAT_MOVEMENTS,
    }),
    ...mapActions({
      loadMovements: vuexTypes.LOAD_MOVEMENTS,
      loadShareMovements: vuexTypes.LOAD_SHARE_MOVEMENTS,
    }),

    async loadMovementsFirstPage (assetCode, accountId) {
      this.isLoaded = false
      this.isLoadFailed = false
      let response
      try {
        if (this.isHistory || this.isCustomerMovements) {
          response = await this.loadMovements({ assetCode, accountId })
        } else {
          response = await this.loadShareMovements(assetCode)
        }
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isLoadFailed = true
      }
      this.isLoaded = true
      return response
    },
  },
}
</script>

<style lang="scss" scoped>
.movements-history {
  overflow-x: auto;
  width: 100%;
}
</style>
