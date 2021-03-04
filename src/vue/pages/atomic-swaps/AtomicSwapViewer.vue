<template>
  <div class="atomic-swap-viewer">
    <atomic-swap-attributes :atomic-swap-ask="currentAtomicSwapAsk" />
    <template v-if="isAtomicSwapOwner">
      <atomic-swap-actions
        :former="new AtomicSwapFormer(currentAtomicSwapAsk)"
        @close-drawer-and-update-list="$emit(EVENTS.closeDrawerAndUpdateList)"
      />
      <atomic-swap-requests :atomic-swap-ask="currentAtomicSwapAsk" />
    </template>
  </div>
</template>

<script>
import AtomicSwapAttributes from './AtomicSwapAttributes'
import AtomicSwapRequests from './AtomicSwapRequests'
import AtomicSwapActions from './AtomicSwapActions'
import { AtomicSwapFormer } from '@/js/formers/AtomicSwapFormer'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

export default {
  name: 'atomic-swap-viewer',

  components: {
    AtomicSwapAttributes,
    AtomicSwapActions,
    AtomicSwapRequests,
  },

  props: {
    currentAtomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
  },

  data () {
    return {
      EVENTS,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
    isAtomicSwapOwner () {
      return this.currentAtomicSwapAsk.ownerId === this.accountId
    },
  },

  methods: {
    AtomicSwapFormer,
  },
}
</script>
