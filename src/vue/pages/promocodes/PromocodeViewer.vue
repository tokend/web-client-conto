<template>
  <div class="promocode-viewer">
    <promocode-attributes
      :promocode="promocode"
    />

    <button
      v-ripple
      class="app__button-raised promocode-delete__btn"
      @click="deletePromocode"
      :disabled="isSubmitting"
    >
      {{ 'promocode-viewer.delete-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import PromocodeAttributes from './PromocodeAttributes'
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
  },

  props: {
    promocode: {
      type: PromocodeRecord,
      required: true,
    },
  },

  data: _ => ({
    isSubmitting: false,
  }),

  methods: {
    async deletePromocode () {
      this.isSubmitting = true
      try {
        const endpoint = `/integrations/marketplace/promocodes/${this.promocode.id}`
        await api.deleteWithSignature(endpoint)

        this.$emit(EVENTS.promocodeDeleted)
        Bus.success('promocode-viewer.promocode-deleted-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSubmitting = false
    },
  },

}
</script>

<style lang="scss" scoped>
.promocode-delete__btn {
  margin-top: 5rem;
}
</style>
