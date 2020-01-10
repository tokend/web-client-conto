<template>
  <div class="atomic-swap-actions">
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="app__button-raised atomic-swap-actions__btn"
      :disabled="isAtomicSwapCanceling"
      @click="isUpdateAtomicSwapDrawerShown = true"
    >
      {{ 'atomic-swap-actions.update-btn' | globalize }}
    </button>
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="app__button-raised atomic-swap-actions__btn"
      :disabled="isAtomicSwapCanceling"
      @click="cancelRequest"
    >
      {{ 'atomic-swap-actions.cancel-btn' | globalize }}
    </button>

    <drawer :is-shown.sync="isUpdateAtomicSwapDrawerShown">
      <template slot="heading">
        {{ 'atomic-swap-actions.update-atomic-swap-drawer-title' | globalize }}
      </template>

      <update-atomic-swap-form
        :atomic-swap-ask="atomicSwapAsk"
        @updated-atomic-swap="(isUpdateAtomicSwapDrawerShown = false) ||
          $emit(EVENTS.closeDrawerAndUpdateList)"
      />
    </drawer>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import UpdateAtomicSwapForm from '@/vue/forms/UpdateAtomicSwapForm'
import Drawer from '@/vue/common/Drawer'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

export default {
  name: 'atomic-swap-actions',
  components: {
    UpdateAtomicSwapForm,
    Drawer,
  },
  mixins: [FormMixin],
  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
  },
  data: _ => ({
    isAtomicSwapCanceling: false,
    isUpdateAtomicSwapDrawerShown: false,
    EVENTS,
  }),

  methods: {
    async cancelRequest () {
      this.hideConfirmation()
      this.isAtomicSwapCanceling = true

      try {
        await api.deleteWithSignature(`/integrations/marketplace/offers/${this.atomicSwapAsk.id}`)
        Bus.success('atomic-swap-actions.atomic-swap-canceled-msg')
        this.$emit(EVENTS.closeDrawerAndUpdateList)
      } catch (e) {
        this.isAtomicSwapCanceling = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.atomic-swap-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.atomic-swap-actions__btn {
  min-width: 12rem;
  margin-top: 1rem;
}
</style>
