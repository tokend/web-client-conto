<template>
  <div class="booking-card">
    <card>
      <card-logo
        slot="media"
        is-full-cover
        :img-url="bookingRecord.room.logoUrl"
        :logo-text="bookingRecord.room.name"
      />
      <template slot="header">
        {{ bookingRecord.startTime | formatDateDMYT }}
      </template>
      <!-- eslint-disable max-len -->
      <template slot="accent-title">
        {{ 'booking-card.room-lbl' | globalize }}: {{ bookingRecord.room.name }}<br>
      </template>
      <template slot="unlimited-content">
        {{ 'booking-card.to-lbl' | globalize }}: {{ bookingRecord.endTime | formatDateDMYT }}<br>
        {{ 'booking-card.participants-lbl' | globalize }}: {{ bookingRecord.participants }}<br>
        {{ 'booking-card.price-lbl' | globalize({
          amount: bookingRecord.amount,
          asset: bookingRecord.assetCode
        }) }}<br>
        <template v-if="bookingRecord.customer">
          {{ 'booking-card.email-or-phone-customer-lbl' | globalize }}:<br> {{ bookingRecord.customer }}
        </template>
        <!-- eslint-enable max-len -->
      </template>
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="generateQrCode"
        >
          {{ 'booking-card.qr-code-btn' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import BookingMixin from '@/vue/mixins/booking.mixin'
import CardLogo from '@/vue/common/CardLogo'

import { BookingRecord } from '@/js/records/entities/booking.record'

const EVENTS = {
  showQrCode: 'show-qr-code',
}

export default {
  name: 'booking-card',
  components: {
    Card,
    CardLogo,
  },
  mixins: [BookingMixin],

  props: {
    bookingRecord: {
      type: BookingRecord,
      required: true,
    },
  },

  data () {
    return {
      EVENTS,
    }
  },

  methods: {
    generateQrCode () {
      const qrCodeValue = btoa(`tokend://booking.conto?reference=${this.bookingRecord.reference}`)
      this.$emit(EVENTS.showQrCode, qrCodeValue)
    },
  },
}
</script>
