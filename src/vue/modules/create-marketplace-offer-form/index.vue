<template>
  <div class="create-marketplace-offer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'create-marketplace-offer-form.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template
          v-if="baseAtomicSwapBalancesAssets.length &&
            quoteAtomicSwapAssets.length">
          <create-marketplace-offer-form
            @created-marketplace-offer="$emit(EVENTS.createdMarketplaceOffer)"
          />
        </template>

        <template v-else-if="!baseAtomicSwapBalancesAssets.length">
          <!-- eslint-disable max-len -->
          <no-data-message
            icon-name="alert-circle"
            :title="'create-marketplace-offer-form.no-base-marketplace-offer-assets-title' | globalize"
            :message="'create-marketplace-offer-form.no-base-marketplace-offer-assets-msg' | globalize"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="alert-circle"
            :title="'create-marketplace-offer-form.no-quote-marketplace-offer-assets-title' | globalize"
            :message="'create-marketplace-offer-form.no-quote-marketplace-offer-assets-msg' | globalize"
          />
          <!-- eslint-enable max-len -->
        </template>
      </template>
    </template>

    <template v-else>
      <create-marketplace-offer-form-skeleton-loader />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import CreateMarketplaceOfferFormSkeletonLoader from './components/create-marketplace-offer-form-skeleton-loader'
import CreateMarketplaceOfferForm from './components/create-marketplace-offer-form'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  createdMarketplaceOffer: 'created-marketplace-offer',
}

export default {
  name: 'create-marketplace-offer-form-module',
  components: {
    NoDataMessage,
    CreateMarketplaceOfferFormSkeletonLoader,
    CreateMarketplaceOfferForm,
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
      await this.loadAssets()
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isLoaded = true
  },
  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
  },
}
</script>
