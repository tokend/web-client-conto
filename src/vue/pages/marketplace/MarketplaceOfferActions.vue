<template>
  <div class="marketplace-offer-actions">
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="app__button-raised marketplace-offer-actions__btn"
      :disabled="isMarketplaceOfferCanceling"
      @click="isUpdateMarketplaceOfferDrawerShown = true"
    >
      {{ 'marketplace-offer-actions.update-btn' | globalize }}
    </button>
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="app__button-raised marketplace-offer-actions__btn"
      :disabled="isMarketplaceOfferCanceling"
      @click="cancelRequest"
    >
      {{ 'marketplace-offer-actions.cancel-btn' | globalize }}
    </button>

    <drawer :is-shown.sync="isUpdateMarketplaceOfferDrawerShown">
      <template slot="heading">
        {{ 'marketplace-offer-actions.update-marketplace-offer-drawer-title' |
          globalize }}
      </template>

      <update-marketplace-offer-form
        :atomic-swap-ask="atomicSwapAsk"
        @updated-marketplace-offer="
          (isUpdateMarketplaceOfferDrawerShown = false) ||
            $emit(EVENTS.closeDrawerAndUpdateList)
        "
      />
    </drawer>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import UpdateMarketplaceOfferForm from '@/vue/forms/UpdateMarketplaceOfferForm'
import Drawer from '@/vue/common/Drawer'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

export default {
  name: 'marketplace-offer-actions',
  components: {
    UpdateMarketplaceOfferForm,
    Drawer,
  },
  mixins: [FormMixin],
  props: {
    atomicSwapAsk: { type: AtomicSwapAskRecord, required: true },
  },
  data: _ => ({
    isMarketplaceOfferCanceling: false,
    isUpdateMarketplaceOfferDrawerShown: false,
    EVENTS,
  }),

  methods: {
    async cancelRequest () {
      this.hideConfirmation()
      this.isMarketplaceOfferCanceling = true

      try {
        await api.deleteWithSignature(`/integrations/marketplace/offers/${this.atomicSwapAsk.id}`)
        Bus.success('marketplace-offer-actions.marketplace-offer-canceled-msg')
        this.$emit(EVENTS.closeDrawerAndUpdateList)
      } catch (e) {
        this.isMarketplaceOfferCanceling = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.marketplace-offer-actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.marketplace-offer-actions__btn {
  min-width: 12rem;
  margin-top: 1rem;
}
</style>
