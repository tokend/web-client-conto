<template>
  <div class="promocodes-list">
    <collection-loader
      class="promocodes-list__loader"
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
        :customer="promocodeToBrowse"
        @close-drawer="isDrawerShown = false"
      />
    </drawer>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Drawer from '@/vue/common/Drawer'

import CustomerAttributes from './customers-list/CustomerAttributes'
import { Bus } from '@/js/helpers/event-bus'
import { CustomerRecord } from '@/js/records/entities/customer.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'promocodes-list',

  components: {
    CollectionLoader,
    Drawer,
    CustomerAttributes,
  },

  data () {
    return {
      list: [],
      isLoaded: false,
      isLoadFailed: false,
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

    setPromocodeToBrowse ($event) {
      this.promocodeToBrowse = $event
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
