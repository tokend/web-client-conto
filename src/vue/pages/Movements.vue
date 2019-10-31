<template>
  <div class="movements">
    <movements-top-bar
      @asset-code-updated="updateAssetCode"
      @movements-update-required="emitUpdateList('movements:updateList')"
      @show-no-data-message="showNoDataMessage = true"
      @show-loading-error-message="showLoadingErrorMessage = true"
    />

    <movements-history
      v-if="assetCode"
      :asset-code="assetCode"
      :key="`movements-history-state-${historyState}`"
    />

    <template v-else-if="showLoadingErrorMessage">
      <p>{{ 'op-pages.can-not-load-assets' | globalize }}</p>
    </template>

    <no-data-message
      v-else-if="!assetCode && showNoDataMessage"
      icon-name="trending-up"
      :title="'op-pages.no-data-title' | globalize"
      :message="'op-pages.no-data-msg' | globalize"
    />

    <loader
      v-else
      message-id="op-pages.assets-loading-msg"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

import MovementsHistory from '@/vue/modules/movements-history'
import MovementsTopBar from '@modules/movements-top-bar'
import UpdateList from '@/vue/mixins/update-list.mixin'
import Loader from '@/vue/common/Loader'

export default {
  name: 'movements-page',
  components: {
    NoDataMessage,
    MovementsTopBar,
    MovementsHistory,
    Loader,
  },

  mixins: [UpdateList],

  data: _ => ({
    assetCode: '',
    historyState: 0,
    showNoDataMessage: false,
    showLoadingErrorMessage: false,
  }),

  created () {
    this.listenUpdateList('movements:updateList', this.updateMovementsHistoryList)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('movements:updateList')
  },

  methods: {
    updateAssetCode (assetCode) {
      this.assetCode = assetCode
    },

    updateMovementsHistoryList () {
      this.historyState++
    },
  },
}
</script>

<style lang="scss">
</style>
