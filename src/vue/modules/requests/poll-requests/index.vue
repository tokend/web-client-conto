<template>
  <div>
    <template v-if="isLoaded">
      <template v-if="isLoadingFailed">
        <p>{{ 'poll-requests.loading-error-msg' | globalize }}</p>
      </template>

      <template v-else>
        <template v-if="requests.length">
          <requests-table
            :requests="requests"
            @select="showRequestDetails"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="poll"
            :title="'poll-requests.no-request-history-title' | globalize"
            :message="'poll-requests.no-request-history-desc' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-table :cells="4" />
    </template>

    <collection-loader
      class="poll-requests__loader"
      v-show="requests.length && isLoaded"
      :first-page-loader="firstPageLoader"
      @first-page-load="setRequests"
      @next-page-load="concatRequests"
    />

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'poll-requests.details-title' | globalize }}
      </template>
      <request-viewer
        :request="selectedRequest"
        @cancel="closeDrawerAndUpdateList()"
      />
    </drawer>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'
import RequestsTable from './components/requests-table'
import RequestViewer from './components/request-viewer'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'

import UpdateList from '@/vue/mixins/update-list.mixin'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

export default {
  name: 'poll-requests',
  components: {
    CollectionLoader,
    RequestsTable,
    Drawer,
    NoDataMessage,
    RequestViewer,
    SkeletonLoaderTable,
  },
  mixins: [UpdateList],
  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isDrawerShown: false,
    selectedRequest: {},
    firstPageLoader: () => {},
  }),
  computed: {
    ...mapGetters('poll-requests', {
      requests: types.requests,
    }),
  },
  async created () {
    this.initFirstPageLoader()
    this.listenUpdateList('polls:updateList', this.initFirstPageLoader)
  },

  methods: {
    ...mapMutations('poll-requests', {
      setRequests: types.SET_REQUESTS,
      concatRequests: types.CONCAT_REQUESTS,
    }),
    ...mapActions('poll-requests', {
      loadCreateAssetRequests: types.LOAD_REQUESTS,
    }),
    async loadRequests () {
      this.isLoaded = false
      try {
        const response = await this.loadCreateAssetRequests()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadRequests()
    },

    showRequestDetails (request) {
      this.selectedRequest = request
      this.isDrawerShown = true
    },

    closeDrawerAndUpdateList () {
      this.isDrawerShown = false
      this.emitUpdateList('pollrequests:updateList')
    },
  },
}
</script>

<style scoped lang="scss">
.poll-requests__loader {
  margin-top: 1rem;
}
</style>
