<template>
  <div class="atomic-swaps">
    <top-bar>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isBookingFormDrawerShown = true"
        >
          {{ 'booking.booking-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer
      :is-shown.sync="isBookingFormDrawerShown"
      :close-by-click-outside="false"
    >
      <template slot="heading">
        {{ 'booking.booking-title' | globalize }}
      </template>

      <booking-form
        @created-booking="isBookingFormDrawerShown = false" />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import BookingForm from '@/vue/forms/BookingForm'

export default {
  name: 'atomic-swaps',
  components: {
    TopBar,
    Drawer,
    BookingForm,
  },

  data: () => ({
    isBookingFormDrawerShown: false,
  }),

  computed: {
  },

  methods: {
  },
}
</script>

<style lang="scss" scoped>
</style>
