<template>
  <div class="customers-list">
    <div class="customers-list__table-wrp">
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message
            :message="'customers-table.error-msg' | globalize"
          />
        </template>

        <template v-else>
          <template v-if="list.length">
            <customers-table
              :customers-list="list"
              @details-button-clicked="setCustomerToBrowse($event)"
            />
          </template>

          <template v-else>
            <no-data-message
              icon-name="chart-areaspline"
              :title="'statistics-sales-history.no-data-title' | globalize"
              :message="'customers-table.no-data-msg' | globalize"
            />
          </template>
        </template>
      </template>

      <template v-else>
        <skeleton-loader-table
          :cells="4"
        />
      </template>
    </div>

    <collection-loader
      class="customers-list__loader"
      :first-page-loader="getList"
      @first-page-load="setList"
      @next-page-load="concatList"
      ref="listCollectionLoader"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'customers-list.customer-drawer-title' | globalize }}
      </template>

      <customer-attributes
        :customer="customerToBrowse"
        @close-drawer="isDrawerShown = false"
      />

      <template v-if="assetsCodes.length">
        <div class="customers-list__user-movements-history-select">
          <select-field
            :value="assetCode"
            @input="setAssetCode"
            class="app__select"
          >
            <option
              v-for="asset in assetsCodes"
              :key="asset"
              :value="asset"
            >
              {{ assetByCode(asset).name }}
            </option>
          </select-field>
        </div>

        <movements-history
          :customer="customerToBrowse"
          :asset-code="assetCode"
          class="customers-list__user-movements-history"
        />
      </template>
    </drawer>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'
import _isEmpty from 'lodash/isEmpty'
import MovementsHistory from '@/vue/modules/movements-history'

import CustomerAttributes from './customers-list/CustomerAttributes'
import CustomersTable from './customers-list/CustomersTable'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@tokend/js-sdk'
import { CustomerRecord } from '@/js/records/entities/customer.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'customers-list',

  components: {
    CollectionLoader,
    Drawer,
    CustomerAttributes,
    CustomersTable,
    SelectField,
    MovementsHistory,
    NoDataMessage,
    ErrorMessage,
    SkeletonLoaderTable,
  },

  data () {
    return {
      list: [],
      assetCode: '',
      isLoaded: false,
      isLoadFailed: false,
      isDrawerShown: false,
      customerToBrowse: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetByCode,
    ]),

    assetsCodes () {
      if (!_isEmpty(this.customerToBrowse)) {
        return this.customerToBrowse.balances.map(item => item.assetCode)
      } else {
        return []
      }
    },
  },

  created () {
    this.listen()
  },

  methods: {
    listen () {
      Bus.on('customers:updateList', () => {
        this.reloadList()
      })
    },

    async getList () {
      let result

      try {
        result = await api.getWithSignature(
          `/integrations/dns/businesses/${this.accountId}/clients`,
          { include: ['balances'] },
        )
        this.isLoaded = true
      } catch (error) {
        // TODO: remove whe back-end returns empty data instead of 404
        if (error instanceof errors.NotFoundError) {
          this.isLoaded = true
          result = {
            data: [],
            links: {},
          }
        } else {
          this.isLoaded = false
          this.isLoadFailed = true
          ErrorHandler.processWithoutFeedback(error)
        }
      }

      return result
    },

    setList (newList) {
      this.list = newList.map(i => new CustomerRecord(i))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new CustomerRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    setAssetCode (assetCode) {
      this.assetCode = assetCode
    },

    setCustomerToBrowse ($event) {
      this.customerToBrowse = $event
      this.assetCode = this.assetsCodes[0]
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss">
.customers-list__loader {
  margin-top: 1rem;
}

.customers-list__user-movements-history-select {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  padding: 0 1.6rem;
}
</style>
