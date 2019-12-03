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
        }) }}
        <!-- eslint-enable max-len -->
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import BookingMixin from '@/vue/mixins/booking.mixin'
import CardLogo from '@/vue/common/CardLogo'

import { BookingRecord } from '@/js/records/entities/booking.record'

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
}
</script>
