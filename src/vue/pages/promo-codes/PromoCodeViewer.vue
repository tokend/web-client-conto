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
      :is-pending="isPromocCodeDeleting"
      is-danger-color
      @ok="deletePromoCode"
      @cancel="isConfirmationShown = false"
    />

    <template v-else>
      <button
        v-ripple
        class="app__button-raised promo-code-viewer__delete-btn"
        @click="isConfirmationShown = true"
      >
        {{ 'promo-code-viewer.delete-btn' | globalize }}
      </button>
    </template>
  </div>
</template>

<script>
import PromoCodeAttributes from './PromoCodeAttributes'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'

const EVENTS = {
  promoCodeDeleted: 'promo-code-deleted',
}

export default {
  name: 'promo-code-viewer',

  components: {
    PromoCodeAttributes,
    FormConfirmation,
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
  }),

  methods: {
    async deletePromoCode () {
      this.isPromoCodeDeleting = true
      try {
        const endpoint = `/integrations/marketplace/promocodes/${this.promoCode.id}`
        await api.deleteWithSignature(endpoint)

        this.$emit(EVENTS.promoCodeDeleted)
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
.promo-code-viewer__delete-btn,
.promo-code-viewer__form-confirmation {
  margin-top: 5rem;
}
</style>
