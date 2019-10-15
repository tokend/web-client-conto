<template>
  <div class="promocode-viewer">
    <promocode-attributes
      :promocode="promocode"
    />

    <form-confirmation
      v-if="isConfirmationShown"
      class="promocode-viewer__form-confirmation"
      message-id="promocode-viewer.delete-promocode-message"
      ok-button-text-id="promocode-viewer.delete-btn"
      :is-pending="isPromocodeDeleting"
      is-danger-color
      @ok="deletePromocode"
      @cancel="isConfirmationShown = false"
    />

    <template v-else>
      <button
        v-ripple
        class="app__button-raised promocode-viewer__delete-btn"
        @click="isConfirmationShown = true"
      >
        {{ 'promocode-viewer.delete-btn' | globalize }}
      </button>
    </template>
  </div>
</template>

<script>
import PromocodeAttributes from './PromocodeAttributes'
import FormConfirmation from '@/vue/common/FormConfirmation'

import { PromocodeRecord } from '@/js/records/entities/promocode.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'

const EVENTS = {
  promocodeDeleted: 'promocode-deleted',
}

export default {
  name: 'promocode-viewer',

  components: {
    PromocodeAttributes,
    FormConfirmation,
  },

  props: {
    promocode: {
      type: PromocodeRecord,
      required: true,
    },
  },

  data: _ => ({
    isPromocodeDeleting: false,
    isConfirmationShown: false,
  }),

  methods: {
    async deletePromocode () {
      this.isPromocodeDeleting = true
      try {
        const endpoint = `/integrations/marketplace/promocodes/${this.promocode.id}`
        await api.deleteWithSignature(endpoint)

        this.$emit(EVENTS.promocodeDeleted)
        Bus.success('promocode-viewer.promocode-deleted-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isPromocodeDeleting = false
    },
  },

}
</script>

<style lang="scss" scoped>
.promocode-viewer__delete-btn,
.promocode-viewer__form-confirmation {
  margin-top: 5rem;
}
</style>
