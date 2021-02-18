<template>
  <div class="create-atomic-swap">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'create-atomic-swap-form.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template
          v-if="baseAtomicSwapBalancesAssets.length &&
            quoteAtomicSwapAssets.length">
          <create-atomic-swap-info
            @created-atomic-swap="$emit(EVENTS.createdAtomicSwap)"
          />
        </template>

        <template v-else-if="!baseAtomicSwapBalancesAssets.length">
          <!-- eslint-disable max-len -->
          <no-data-message
            icon-name="alert-circle"
            :title="'create-atomic-swap-form.no-base-atomic-swap-assets-title' | globalize"
            :message="'create-atomic-swap-form.no-base-atomic-swap-assets-msg' | globalize"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="alert-circle"
            :title="'create-atomic-swap-form.no-quote-atomic-swap-assets-title' | globalize"
            :message="'create-atomic-swap-form.no-quote-atomic-swap-assets-msg' | globalize"
          />
          <!-- eslint-enable max-len -->
        </template>
      </template>
    </template>

    <template v-else>
      <create-atomic-swap-form-skeleton-loader />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import CreateAtomicSwapFormSkeletonLoader from './components/CreateAtomicSwapFormSkeletonLoader'
import CreateAtomicSwapInfo from './components/CreateAtomicSwapInfo'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  createdAtomicSwap: 'created-atomic-swap',
}

export default {
  name: 'create-atomic-swap-form',
  components: {
    NoDataMessage,
    CreateAtomicSwapFormSkeletonLoader,
    CreateAtomicSwapInfo,
    ErrorMessage,
  },
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      baseAtomicSwapBalancesAssets: vuexTypes.baseAtomicSwapBalancesAssets,
      quoteAtomicSwapAssets: vuexTypes.quoteAtomicSwapAssets,
    }),
  },

  async created () {
    try {
      await this.loadBalances()
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isLoaded = true
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
  },
}
</script>
