<template>
  <div class="booking-card">
    <card>
      <card-logo
        slot="media"
        is-full-cover
        :img-url="room.logoUrl"
        :logo-text="room.name"
      />
      <template slot="header">
        {{ room.name }}
      </template>
      <template slot="content">
        {{ 'room-card.capacity' | globalize({capacity: room.capacity }) }}<br>
        {{
          'room-card.price' | globalize({
            amount: room.price.amount,
            asset: room.price.asset
          })
        }}
      </template>
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.edit)"
        >
          {{ 'room-card.edit' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import BookingMixin from '@/vue/mixins/booking.mixin'
import CardLogo from '@/vue/common/CardLogo'

import { BookingRoomRecord } from '@/js/records/entities/booking-room.record'

const EVENTS = {
  edit: 'edit'
}

export default {
  name: 'room-card',
  components: {
    Card,
    CardLogo,
  },
  mixins: [BookingMixin],

  props: {
    room: {
      type: BookingRoomRecord,
      required: true,
    },
  },

  data () {
    return {
      EVENTS,
    }
  },

  methods: {
  },
}
</script>
