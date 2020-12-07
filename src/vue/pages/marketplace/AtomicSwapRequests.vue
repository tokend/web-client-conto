<template>
  <div class="atomic-swap-requests">
    <h4 class="atomic-swap-requests__header">
      {{ 'atomic-swaps-requests.purchases' | globalize }}
    </h4>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'atomic-swaps-requests.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="atomicSwapRequests.length">
          <atomic-swap-requests-table
            :atomic-swap-requests="atomicSwapRequests"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="swap-horizontal"
            :title="'atomic-swaps-requests.no-data-title' | globalize"
            :message="'atomic-swaps-requests.no-data-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-table :cells="3" />
    </template>

    <collection-loader
      v-show="isLoaded"
      :first-page-loader="loadAtomicSwapRequestsFirstPage"
      @first-page-load="setAtomicSwapRequests"
      @next-page-load="concatAtomicSwapRequests"
    />
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import SkeletonLoaderTable from '@/vue/common/skeleton-loader/SkeletonLoaderTable'
import NoDataMessage from '@/vue/common/NoDataMessage'
import AtomicSwapRequestsTable from './AtomicSwapRequestsTable'

import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'

export default {
  name: 'atomic-swap-requests',
  components: {
    CollectionLoader,
    ErrorMessage,
    SkeletonLoaderTable,
    NoDataMessage,
    AtomicSwapRequestsTable,
  },
  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
  },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      atomicSwapRequests: [],
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  methods: {
    async loadAtomicSwapRequestsFirstPage () {
      let response = {}

      try {
        response = await api.getWithSignature(
          '/integrations/marketplace/buy_requests',
          {
            filter: {
              'seller': this.accountId,
              'offer': this.atomicSwapAsk.id,
              'status': BUY_REQUEST_STATUSES.paid.value,
            },
            include: ['request_details', 'request_details.quote_asset'],
          })
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isLoadFailed = true
      }
      this.isLoaded = true
      return response
    },
    setAtomicSwapRequests (atomicSwapRequests) {
      this.atomicSwapRequests = atomicSwapRequests
        .map(item => new BuyRequestRecord(item))
    },
    concatAtomicSwapRequests (atomicSwapRequests) {
      this.atomicSwapRequests.concat(
        atomicSwapRequests.data
          .map(item => new BuyRequestRecord(item))
      )
    },
  },
}
</script>

<style lang="scss" scoped>
  .atomic-swap-requests__header {
    margin: 2rem 0;
  }
</style>
