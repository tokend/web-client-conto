<template>
  <div class="movements">
    <movements-top-bar
      @asset-code-updated="updateAssetCode"
      @movements-update-required="updateMovementsHistoryList"
    />

    <movements-history
      v-if="assetCode"
      :asset-code="assetCode"
      :key="`movements-history-state-${historyState}`"
    />

    <no-data-message
      v-else
      icon-name="trending-up"
      :title="'op-pages.no-data-title' | globalize"
      :message="'op-pages.no-data-msg' | globalize"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

import MovementsHistory from '@/vue/modules/movements-history'
import MovementsTopBar from '@/vue/common/MovementsTopBar'

export default {
  name: 'movements-page',
  components: {
    NoDataMessage,
    MovementsTopBar,
    MovementsHistory,
  },

  data: _ => ({
    assetCode: '',
    historyState: 0,
  }),

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
