<template>
  <div class="business-assets-viewer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'business-assets-viewer.error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="businessAssets.length">
          <business-assets-table
            :business-assets="businessAssets"
            @select-business-asset="selectItem"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="coins"
            :title="'business-assets-viewer.no-data-title' | globalize"
            :message="'business-assets-viewer.no-data-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <skeleton-loader-table
      v-else
      :cells="3"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'sponsorship-form.form-heading' | globalize }}
      </template>
      <sponsorship-form
        :business-asset="selectedBusinessAsset"
        @contract-created="(isDrawerShown = false) || loadBalances()"
      />
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import SponsorshipForm from '@/vue/forms/SponsorshipForm'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'
import BusinessAssetsTable from './BusinessAssetsTable'
import { BusinessAssetRecord } from '@/js/records/entities/business-asset.record'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { BusinessRecord } from '@/js/records/entities/business.record'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'business-assets-viewer',

  components: {
    NoDataMessage,
    ErrorMessage,
    SkeletonLoaderTable,
    Drawer,
    SponsorshipForm,
    BusinessAssetsTable,
  },

  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },

  data () {
    return {
      businessAssets: [],
      selectedBusinessAsset: {},
      isLoaded: true,
      isLoadFailed: false,
      isDrawerShown: false,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.assetsByOwner,
    ]),
  },

  async created () {
    await this.init()
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async init () {
      try {
        await this.loadBalances()
        await this.loadAllBusinessAssets()
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    selectItem (item) {
      this.selectedBusinessAsset = item
      this.isDrawerShown = true
    },

    async loadAllBusinessAssets () {
      let response = await api.getWithSignature(
        `/integrations/dns/businesses/${this.business.accountId}/assets`
      )
      let assets = response.data
      let holders = response._rawResponse.data.meta

      while (response.data.length) {
        response = await response.fetchNext()
        assets = [...assets, ...response.data]
        Object.assign(holders, response._rawResponse.data.meta)
      }

      this.businessAssets = assets
        .map(asset => new BusinessAssetRecord(asset, holders))
    },
  },
}
</script>
