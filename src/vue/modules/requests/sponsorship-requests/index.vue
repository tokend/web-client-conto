<template>
  <div>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'sponsorship-requests.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="requests.length">
          <requests-table
            :requests="requests"
            :is-incoming-requests="isIncomingRequests"
            @select="showRequestDetails"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="chart-areaspline"
            :title="'sponsorship-requests.no-history-title' | globalize"
            :message="'sponsorship-requests.no-history-desc' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-table :cells="5" />
    </template>

    <collection-loader
      class="sponsorship-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="loadRequests"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
      ref="listCollectionLoader"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'sponsorship-requests.details-title' | globalize }}
      </template>
      <request-viewer
        :request="selectedRequest"
        :is-incoming-requests="isIncomingRequests"
        @request-updated="closeDrawerAndUpdateList()"
      />
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import CollectionLoader from '@/vue/common/CollectionLoader'
import RequestsTable from './components/requests-table'
import RequestViewer from './components/request-viewer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'sponsorship-requests',
  components: {
    CollectionLoader,
    RequestsTable,
    Drawer,
    RequestViewer,
    NoDataMessage,
    ErrorMessage,
    SkeletonLoaderTable,
  },

  props: {
    isIncomingRequests: { type: Boolean, default: false },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    isDrawerShown: false,
    selectedRequest: {},
  }),

  computed: {
    ...mapGetters({
      requests: vuexTypes.sponsorshipRequests,
    }),
  },

  methods: {
    ...mapMutations({
      setRequests: vuexTypes.SET_SPONSORSHIP_REQUESTS,
      concatRequests: vuexTypes.CONCAT_SPONSORSHIP_REQUESTS,
    }),
    ...mapActions({
      loadSponsorshipRequests: vuexTypes.LOAD_SPONSORSHIP_REQUESTS,
    }),
    async loadRequests () {
      this.isLoaded = false
      this.isLoadFailed = false
      let response
      try {
        response = await this.loadSponsorshipRequests(
          this.isIncomingRequests
        )
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
      return response
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },

    showRequestDetails (request) {
      this.selectedRequest = request
      this.isDrawerShown = true
    },

    closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.reloadList()
    },
  },
}
</script>

<style scoped lang="scss">
.sponsorship-requests__loader {
  margin-top: 1rem;
}
</style>
