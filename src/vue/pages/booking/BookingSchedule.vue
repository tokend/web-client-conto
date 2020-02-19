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
        <div class="booking-schedule__room-info">
          <p>
            {{ 'booking-schedule.room-schedule' | globalize({
              startTime: START_WORK_HOURS,
              endTime: END_WORK_HOURS
            }) }}
          </p>
          <p>
            {{ 'booking-schedule.room-price' | globalize({
              amount: currentRoom.price.amount,
              assetCode: currentRoom.price.asset
            }) }}
          </p>
          <p>
            {{ 'booking-schedule.room-capacity' | globalize({
              capacity: currentRoom.capacity,
            }) }}
          </p>
        </div>
        <div
          class="app__table app__table--with-shadow booking-schedule__table"
        >
          <table>
            <thead>
              <tr>
                <th :title="'booking-schedule.time-th' | globalize">
                  {{ 'booking-schedule.time-th' | globalize }}
                </th>
                <th :title="'booking-schedule.places-th' | globalize">
                  {{ 'booking-schedule.places-th' | globalize }}
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- eslint-disable max-len -->
              <tr
                v-for="period in schedule"
                :key="period.time"
              >
                <!-- eslint-enable max-len -->
                <td :title="`${period.startTime}-${period.endTime}`">
                  {{ period.startTime }}-{{ period.endTime }}
                </td>

                <td
                  :title="`${period.countBusyPlaces}/${currentRoom.capacity}`"
                >
                  {{ period.countBusyPlaces }}/{{ currentRoom.capacity }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
import _uniqBy from 'lodash/uniqBy'

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
      END_WORK_HOURS,
      START_WORK_HOURS,
    }
  },

  computed: {
    startTime () {
      const startTime = moment(this.filters.date).hour(START_WORK_HOURS).minutes('00')
      return startTime.toISOString()
    },
    endTime () {
      const endTime = moment(this.filters.date).hour(END_WORK_HOURS).minutes('00')
      return endTime.toISOString()
    },

    schedule () {
      let arr = []
      for (let i = START_WORK_HOURS; i < END_WORK_HOURS; i++) {
        arr.push({
          startTime: i,
          endTime: i + 1,
          countBusyPlaces: this.getCountBusyPlaces(i),
        })
      }
      return arr
    },

    currentRoom () {
      return this.business.getRoomById(this.filters.room)
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
      this.listen()
      const business = await this.getBusinessById(1)
      this.business = new BookingBusinessRecord(business)
      this.filters.room = this.business.rooms[0].id
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  destroyed () {
    Bus.resetEvent('booking:updateList')
  },

  methods: {
    listen () {
      Bus.on('booking:updateList', () => {
        this.loadFreeAndBusyPlaces()
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
    getCountBusyPlaces (hour) {
      const timelines = this.freeAndBusyPlaces.filter(book => {
        const { start: startPeriod, end: endPeriod } = this.getPeriodTime(hour)
        const bookStart = moment(book.startTime)
        const bookEnd = moment(book.endTime)
        if (startPeriod.isBetween(bookStart, bookEnd, null, '[)') ||
          endPeriod.isBetween(bookStart, bookEnd, null, '(]')) {
          return true
        }
      })

      const events = timelines.flatMap(timeline => timeline.events || [])

      const eventsWithoutDuplicate = _uniqBy(events, 'id')
      const countBusyPlaces = eventsWithoutDuplicate
        .reduce((count, event) => {
          return count + event.participants
        }, 0)
      return countBusyPlaces
    },

    isHaveEmptyPlaces (countBusyPlaces) {
      return countBusyPlaces < this.currentRoom.capacity
    },

    getPeriodTime (hour) {
      const startPeriod = moment(this.filters.date)
        .set({ hour: hour, minute: 0, second: 0, millisecond: 0 })
      const endPeriod = moment(this.filters.date)
        .set({ hour: hour + 1, minute: 0, second: 0, millisecond: 0 })

      return {
        start: startPeriod,
        end: endPeriod,
      }
    },

    bookRoom (period) {
      const time = this.getPeriodTime(period.startTime)
      Bus.emit('booking:bookRoom', time)
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

.booking-schedule__table {
  margin-top: 3rem;

  table tbody tr td {
    width: 50%;
  }
}

.booking-schedule__room-info {
  margin-top: 3rem;

  p {
    font-size: 1.6rem;
  }
}

.booking-schedule__table-tr {
  cursor: pointer;

  &--disabled {
    cursor: not-allowed;
  }
}
</style>
