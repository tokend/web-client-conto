<template>
  <div class="promo-code-viewer">
    <promo-code-attributes
      :promo-code="promoCode"
    />

    <form-confirmation
      v-if="isConfirmationShown"
      class="promo-code-viewer__form-confirmation"
      message-id="promo-code-viewer.delete-promo-code-message"
      ok-button-text-id="promo-code-viewer.delete-btn"
      :is-pending="isPromoCodeDeleting"
      is-danger-color
      @ok="deletePromoCode"
      @cancel="isConfirmationShown = false"
    />

    <template v-else>
      <div class="promo-code-viewer__actions">
        <button
          v-ripple
          class="app__button-raised promo-code-viewer__action-btn"
          @click="isUpdatePromoCodeFormShown = true"
        >
          {{ 'promo-code-viewer.update-btn' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised promo-code-viewer__action-btn"
          @click="isConfirmationShown = true"
        >
          {{ 'promo-code-viewer.delete-btn' | globalize }}
        </button>
      </div>
    </template>

    <drawer :is-shown.sync="isUpdatePromoCodeFormShown">
      <template slot="heading">
        {{ 'promo-code-viewer.update-promo-code-drawer-title' | globalize }}
      </template>

      <update-promo-code-form
        @promo-code-updated="(isUpdatePromoCodeFormShown = false) ||
          $emit(EVENTS.closeDrawerAndUpdateList)"
        :promo-code="promoCode"
      />
    </drawer>
  </div>
</template>

<script>
import PromoCodeAttributes from './PromoCodeAttributes'
import FormConfirmation from '@/vue/common/FormConfirmation'
import UpdatePromoCodeForm from '@/vue/forms/UpdatePromoCodeForm'
import Drawer from '@/vue/common/Drawer'

import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'

const EVENTS = {
  closeDrawerAndUpdateList: 'close-drawer-and-update-list',
}

export default {
  name: 'promo-code-viewer',

  components: {
    PromoCodeAttributes,
    FormConfirmation,
    UpdatePromoCodeForm,
    Drawer,
  },

  props: {
    promoCode: {
      type: PromoCodeRecord,
      required: true,
    },
  },

  data: _ => ({
    isPromoCodeDeleting: false,
    isConfirmationShown: false,
    isUpdatePromoCodeFormShown: false,
    EVENTS,
  }),

  methods: {
    async deletePromoCode () {
      this.isPromoCodeDeleting = true
      try {
        const endpoint = `/integrations/marketplace/promocodes/${this.promoCode.id}`
        await api.deleteWithSignature(endpoint)

        this.$emit(EVENTS.closeDrawerAndUpdateList)
        Bus.success('promo-code-viewer.promo-code-deleted-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isPromoCodeDeleting = false
    },
  },

}
</script>

<style lang="scss" scoped>
.promo-code-viewer__form-confirmation {
  margin-top: 5rem;
}

.promo-code-viewer__actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 4rem;
}

.promo-code-viewer__action-btn {
  max-width: 12rem;
  width: 100%;
  margin-top: 1rem;
}
</style>
