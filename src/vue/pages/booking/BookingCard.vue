<template>
  <div class="booking-card">
    <card>
      <template slot="header">
        {{ bookingRecord.startTime | formatDateDMYT }}
      </template>
      <!-- eslint-disable max-len -->
      <template slot="accent-title">
        {{ 'booking-card.room-lbl' | globalize }}: {{ bookingRecord.payload }}<br>
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
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="cancel"
        >
          {{ 'booking-card.cancel-btn' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import BookingMixin from '@/vue/mixins/booking.mixin'

import { BookingRecord } from '@/js/records/entities/booking.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  delete: 'delete',
}

export default {
  name: 'booking-card',
  components: {
    Card,
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
  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
      vuexTypes.accountId,
    ]),
  },
  methods: {
    async cancel () {
      await this.cancelBooking(this.bookingRecord.id, 1)
      this.$emit(EVENTS.delete)
    },
  },
}
</script>
