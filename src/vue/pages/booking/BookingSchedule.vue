<template>
  <div class="booking-schedule">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'booking-schedule.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <div class="booking-schedule__filters">
          <div class="booking-schedule__filter-field">
            <select-field
              v-model="filters.room"
              :label="'booking-schedule.room-lbl' | globalize"
            >
              <option
                v-for="room in business.rooms"
                :key="room.id"
                :value="room.id"
              >
                {{ room.name }}
              </option>
            </select-field>
          </div>

          <div class="booking-schedule__filter-field">
            <date-field
              v-model="filters.date"
              :enable-time="false"
              :disable-before="moment().subtract(1, 'days').toISOString()"
              :label="'booking-schedule.date-lbl' | globalize"
            />
          </div>
        </div>
        <div>dsc</div>
      </template>
    </template>

    <template v-else>
      <loader
        message-id="booking-schedule.loading-msg"
      />
    </template>
  </div>
</template>

<script>
import ErrorMessage from '@/vue/common/ErrorMessage'
import Loader from '@/vue/common/Loader'
import SelectField from '@/vue/fields/SelectField'
import DateField from '@/vue/fields/DateField'
import BookingMixin from '@/vue/mixins/booking.mixin'
import moment from 'moment'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { BookingBusinessRecord } from '@/js/records/entities/booking-business.record'

export default {
  name: 'booking-schedule',
  components: {
    Loader,
    ErrorMessage,
    SelectField,
    DateField,
  },
  mixins: [BookingMixin],
  data () {
    return {
      filters: {
        room: '',
        date: moment().toISOString(),
      },
      business: {},
      freeAndBusyPlaces: [],
      isLoaded: false,
      isLoadFailed: false,
      moment,
    }
  },

  computed: {
    startTime () {
      const startTime = moment(this.filters.date).hour('09').minutes('00')
      return startTime.toISOString()
    },
    endTime () {
      const endTime = moment(this.filters.date).hour('20').minutes('00')
      return endTime.toISOString()
    },
  },

  watch: {
    filters: {
      deep: true,
      handler: function () {
        this.loadFreeAndBusyPlaces()
      },
    },
  },

  async created () {
    try {
      const business = await this.getBusinessById(1)
      this.business = new BookingBusinessRecord(business)
      this.filters.room = this.business.rooms[0].id
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    listen () {
      Bus.on('cusromers:updateList', () => {
        this.reloadList()
      })
    },
    async loadFreeAndBusyPlaces () {
      this.isLoaded = false
      this.isLoadFailed = false
      try {
        const { data } = await this.freebusy(
          this.business.calendarId,
          this.startTime,
          this.endTime,
          this.filters.room
        )
        this.freeAndBusyPlaces = data
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
    },
  },
}
</script>

<style lang="scss" scoped>
  .booking-explorer__collection-loader {
    margin-top: 1rem;
  }

  .booking-explorer__qr-code {
    margin-top: 5rem;
    text-align: center;
  }

  .booking-explorer__qr-code-msg {
    margin-top: 5rem;
    text-align: center;
  }
</style>
