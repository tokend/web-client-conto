<template>
  <div class="atomic-swaps">
    <top-bar>
      <template v-if="isAccountCorporate" slot="main">
        <router-link :to="vueRoutes.bookingExplore">
          <span>{{ 'booking.explore-tab' | globalize }}</span>
        </router-link>
        <router-link :to="vueRoutes.bookingSchedule">
          <span>{{ 'booking.schedule-tab' | globalize }}</span>
        </router-link>
        <router-link :to="vueRoutes.bookingBusinesses">
          <span>{{ 'booking.rooms-tab' | globalize }}</span>
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isBookingFormDrawerShown = true"
        >
          {{ 'booking.booking-btn' | globalize }}
        </button>
        <button
          v-ripple
          v-if="isBookingBusinessesPage && isAccountCorporate"
          class="app__button-raised"
          @click="isBookingFormDrawerShown = true"
        >
          {{ 'booking.add-room-btn' | globalize }}
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
        @created-booking="closeDrawerAndUpdateList" />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import BookingForm from '@/vue/forms/BookingForm'
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'booking',
  components: {
    TopBar,
    Drawer,
    BookingForm,
  },

  data: () => ({
    isBookingFormDrawerShown: false,
    vueRoutes,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
    ]),
    isBookingBusinessesPage () {
      return this.$route.name === vueRoutes.bookingBusinesses.name
    },
  },

  methods: {
    closeDrawerAndUpdateList () {
      this.isBookingFormDrawerShown = false
      Bus.emit('booking:updateList')
    },
  },
}
</script>
