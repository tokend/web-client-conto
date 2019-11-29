<template>
  <div>
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'booking-form.can-not-load-data' | globalize"
        />
      </template>

      <template v-else>
        <form
          id="booking-form"
          class="app__form"
          @submit.prevent="showConfirmation()"
        >
          <div class="app__form-row">
            <div class="app__form-field">
              <booking-date-field
                v-model="form.startTime"
                name="booking-start-time"
                :default-hour="moment().hour()"
                @input="touchField('form.startTime')"
                @blur="touchField('form.startTime')"
                :label="'booking-form.booking-from-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.startTime', { minDate: getCurrentDate() }
                )"
                :work-days="business.workDays"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <booking-date-field
                :key="maxDate + minDate"
                v-model="form.endTime"
                :default-hour="moment().hour()"
                @input="touchField('form.endTime')"
                @blur="touchField('form.endTime')"
                :disable-after="maxDate"
                :disable-before="minDate"
                name="booking-end-time"
                :label="'booking-form.booking-to-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.endTime', {
                    minDate: form.startTime || getCurrentDate()
                  }
                )"
                :work-days="business.workDays"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <input-field
                v-model="form.numberSeats"
                @blur="touchField('form.numberSeats')"
                name="number-seats"
                type="number"
                :step="1"
                :error-message="getFieldErrorMessage('form.numberSeats', {
                  from: {
                    value: MIN_PLACE,
                  },
                  to: {
                    value: MAX_PLACE,
                  },
                })"
                :label="'booking-form.number-of-seats' | globalize"
                :disabled="formMixin.isDisabled"
              />
            </div>
          </div>

          <template v-if="freeRooms.length">
            <div class="app__form-row">
              <div class="app__form-field">
                <select-field
                  :value="form.room.id"
                  @input="setRoom"
                  :key="selectKey"
                  name="create-sale-type"
                  :label="'booking-form.room-lbl' | globalize"
                >
                  <option
                    v-for="room in freeRooms"
                    :key="room.id"
                    :value="room.id"
                  >
                    {{ room.name }}
                  </option>
                </select-field>
              </div>
            </div>

            <div class="app__form-row">
              <div class="app__form-field">
                <!-- eslint-disable max-len -->
                <readonly-field
                  :label="'booking-form.price-per-hour' | globalize"
                  :value="pricePerHour"
                />
                <readonly-field
                  :label="'booking-form.price' | globalize"
                  :value="price"
                />
              </div>
            </div>

            <div class="app__form-actions">
              <form-confirmation
                v-if="formMixin.isConfirmationShown"
                @ok="hideConfirmation() || submit()"
                @cancel="hideConfirmation"
              />
              <button
                v-else
                v-ripple
                type="submit"
                class="change-password-form__submit-btn app__button-raised"
                :disabled="formMixin.isDisabled"
              >
                {{ 'booking-form.booking-btn' | globalize }}
              </button>
            </div>
          </template>
          <template v-else>
            <no-data-message
              v-if="isLoadedSeats"
              icon-name="calendar-multiselect"
              :title="'booking-form.no-free-places' | globalize"
              :message="'booking-form.wait-space' | globalize"
            />
            <template v-else>
              <div class="booking-form__help-msg">
                {{ 'booking-form.choose-time' | globalize }}
              </div>
            </template>
          </template>
        </form>
      </template>
    </template>

    <template v-else>
      <loader
        :message-id="'business-viewer.loading-msg'"
      />
    </template>
    <template v-if="false">
      <button
        @click="createCalendar"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        create Calendar
      </button>
      <button
        @click="getCalendarById(1)"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        get Calendar By Id
      </button>
      <button
        @click="createBusinesses(1)"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        create Businesses
      </button>
      <button
        @click="getBusinessById(1)"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        get Business By Id
      </button>
      <button
        @click="createPaymentMethod()"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        create payment method id
      </button>
      <button
        @click="getFreePlace"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        get Free Place
      </button>
    </template>
  </div>
</template>

<script>
import ReadonlyField from '@/vue/fields/ReadonlyField'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import FormMixin from '@/vue/mixins/form.mixin'
import BookingMixin from '@/vue/mixins/booking.mixin'

import moment from 'moment'

import {
  required,
  amountRange,
  minDate,
} from '@validators'
import debounce from 'lodash/debounce'
import { formatMoney } from '@/vue/filters/formatMoney'
import { MathUtil } from '@/js/utils'
import { BookingBusinessRecord } from '@/js/records/entities/booking-business.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

const MIN_PLACE = 1
const MAX_PLACE = 30

export default {
  name: 'booking-form',
  components: {
    ReadonlyField,
    NoDataMessage,
    Loader,
    ErrorMessage,
  },
  mixins: [FormMixin, BookingMixin],
  props: {},
  data () {
    return {
      moment,
      MIN_PLACE,
      MAX_PLACE,
      business: {},
      freeRooms: [],
      isLoaded: false,
      isLoadedSeats: false,
      isLoadFailed: false,
      form: {
        startTime: '',
        endTime: '',
        numberSeats: '1',
        room: '',
      },
    }
  },
  validations () {
    return {
      form: {
        startTime: {
          required,
          minDate: minDate(this.getCurrentDate()),
        },
        endTime: {
          required,
          minDate: minDate(this.form.startTime || this.getCurrentDate()),
        },
        numberSeats: {
          required,
          amountRange: amountRange(MIN_PLACE, MAX_PLACE),
        },
      },
    }
  },
  computed: {
    selectKey () {
      return this.freeRooms.join('') || 'select-room'
    },
    maxDate () {
      return this.form.startTime
        ? moment(this.form.startTime).set('hour', 20).toISOString()
        : moment().add(7, 'days').toISOString()
    },
    minDate () {
      return this.form.startTime
        ? moment(this.form.startTime).subtract(1, 'days').toISOString()
        : ''
    },
    price () {
      if (this.canGetFreeSeats) {
        const startTime = moment(this.form.startTime)
        const endTime = moment(this.form.endTime)
        // used default divide because we don't need round mode
        const hours = moment.duration(endTime.diff(startTime)).asMinutes() / 60
        const pricePerHour = this.form.room.price
        const totalAmount = MathUtil.multiply(
          // eslint-disable-next-line max-len
          MathUtil.multiply(pricePerHour.amount, hours, MathUtil.roundingModes.ROUND_HALF_UP),
          this.form.numberSeats,
        )
        return `${formatMoney(totalAmount)} ${pricePerHour.asset}`
      } else {
        return '0'
      }
    },
    pricePerHour () {
      const pricePerHour = this.form.room.price
      return `${formatMoney(pricePerHour.amount)} ${pricePerHour.asset}`
    },
    canGetFreeSeats () {
      return Boolean(
        this.form.startTime &&
        this.form.endTime &&
        this.form.numberSeats &&
        this.form.numberSeats < MAX_PLACE &&
        moment(this.form.startTime).utc() < moment(this.form.endTime).utc()
      )
    },
  },
  watch: {
    'form.numberSeats' (value) {
      this.form.numberSeats = Math.floor(value)
      debounce(this.getFreePlace(), 300)
    },
    'form.startTime' (value) {
      if (moment(value).utc() < moment(this.form.endTime).utc()) {
        this.form.endTime = moment(this.form.startTime)
          .add(1, 'hours')
          .toISOString()
      }
      debounce(this.getFreePlace(), 300)
    },
    'form.endTime' () {
      debounce(this.getFreePlace(), 300)
    },
  },
  async created () {
    await this.getBusiness()
  },
  destroyed () {
  },
  methods: {
    async submit () {
      try {
        const { data: bookEvent } = await this.bookEvent(
          1,
          1,
          this.form.numberSeats,
          this.form.room.id,
          this.form.startTime,
          this.form.endTime,
        )

        const paymentAddress = await this.getPaymentAddress()

        const subject = JSON.stringify({
          'booking_id': Number(bookEvent.id),
          'reference': bookEvent.reference,
        })
        const { data: escow } = await this.createEscow(
          bookEvent.amount,
          this.business.paymentMethod,
          paymentAddress,
          this.form.room.price.asset,
          subject
        )
        window.location.href = escow.invoice.payUrl
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
    getCurrentDate () {
      return moment().startOf('hour').subtract(1, 'seconds').toISOString()
    },
    setRoom (id) {
      this.form.room = this.business.getRoomById(id)
    },
    async getBusiness () {
      this.isLoaded = false
      this.isLoadFailed = false
      try {
        const business = await this.getBusinessById(1)
        this.business = new BookingBusinessRecord(business)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
    },
    async getFreePlace () {
      if (this.canGetFreeSeats) {
        this.isLoadedSeats = true
        try {
          const rooms = await this.getFree(
            1,
            this.form.startTime,
            this.form.endTime,
            this.form.numberSeats,
            this.business.payloads
          )
          this.freeRooms = rooms.map(item => this.business.getRoomById(item.id))
          if (this.freeRooms.length) this.form.room = this.freeRooms[0]
        } catch (e) {
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/vue/forms/_app-form';
  @import '~@scss/variables';

  .booking-form__help-msg {
    font-size: 1.6rem;
    margin-top: 2rem;
  }
</style>
