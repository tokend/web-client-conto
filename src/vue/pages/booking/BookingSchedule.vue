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

const START_WORK_HOURS = 9
const END_WORK_HOURS = 20

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

    schedule () {
      let arr = []
      for (let i = START_WORK_HOURS; i < END_WORK_HOURS; i++) {
        arr.push({
          time: `${i}-${i + 1}`,
        })
      }
      return arr
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
@import '~@scss/variables.scss';
@import '~@scss/mixins';

$media-desktop-custom: 1005px;
$media-small-desktop-custom: 851px;

.booking-schedule__filters {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.booking-schedule__filter-field {
  margin: 0.7rem;
  min-width: 14rem;
  width: calc(25% - 1.4rem);

  @include respond-to-custom($media-desktop-custom) {
    width: calc(33% - 1.4rem);
  }
  @include respond-to-custom($media-small-desktop-custom) {
    width: calc(50% - 1.4rem);
  }
  @include respond-to-custom($sidebar-hide-bp) {
    width: calc(33% - 1.4rem);
  }
  @include respond-to(small) {
    flex: 1 0;
  }
}
</style>
