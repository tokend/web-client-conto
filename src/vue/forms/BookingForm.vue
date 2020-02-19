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
          @submit.prevent="isFormValid() && showConfirmation()"
        >
          <template v-if="isAccountCorporate">
            <div class="app__form-row">
              <div class="app__form-field">
                <input-field
                  v-model="form.customer"
                  @blur="touchField('form.customer')"
                  name="customer"
                  :error-message="getFieldErrorMessage('form.customer')"
                  :label="'booking-form.customer' | globalize"
                  :disabled="formMixin.isDisabled"
                />
                <p class="booking__customer-note">
                  {{ 'booking-form.customer-note' | globalize }}
                </p>
              </div>
            </div>
          </template>

          <div class="app__form-row">
            <div class="app__form-field">
              <booking-date-field
                v-model="form.startTime"
                name="booking-start-time"
                :default-hour="moment().hour()"
                :default-minute="moment().minutes()"
                @input="touchField('form.startTime')"
                @blur="touchField('form.startTime')"
                :disabled="formMixin.isDisabled"
                :label="'booking-form.booking-from-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.startTime', { minDate: getCurrentDate() }
                )"
              />
            </div>
          </div>

          <div class="app__form-row">
            <div class="app__form-field">
              <booking-date-field
                :key="minDate"
                v-model="form.endTime"
                :default-hour="moment().hour()"
                :default-minute="moment().minutes()"
                @input="touchField('form.endTime')"
                @blur="touchField('form.endTime')"
                :disable-before="minDate"
                :disabled="formMixin.isDisabled"
                name="booking-end-time"
                :label="'booking-form.booking-to-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.endTime', {
                    minDate: form.startTime || getCurrentDate()
                  }
                )"
              />

              <p class="booking-form__error-msg">
                {{ getFieldErrorMessage('totalSelectedTimeInMinutes', {
                  minTime: humanizeDurationTime(business.minDurationInMinutes),
                  maxTime: humanizeDurationTime(business.maxDurationInMinutes)
                }) }}
              </p>
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
                  :disabled="formMixin.isDisabled"
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
                @ok="submit"
                @cancel="hideConfirmation"
                :is-pending="isFormSubmitting"
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
    <template>
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
        @click="updateBusinesses(1,1)"
        v-ripple
        type="submit"
        class="change-password-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        update Business
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
import debounce from 'lodash/debounce'
import _isEmpty from 'lodash/isEmpty'

import {
  required,
  amountRange,
  minDate,
  requiredIf,
  emailOrPhoneNumber,
} from '@validators'
import { formatMoney } from '@/vue/filters/formatMoney'
import { MathUtil } from '@/js/utils'
import { BookingBusinessRecord } from '@/js/records/entities/booking-business.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const MIN_PLACE = 1
const MAX_PLACE = 58
const SIXTY_MINUTES = 60

const EVENTS = {
  createdBooking: 'created-booking',
}

export default {
  name: 'booking-form',
  components: {
    ReadonlyField,
    NoDataMessage,
    Loader,
    ErrorMessage,
  },
  mixins: [FormMixin, BookingMixin],
  props: {
    period: { type: Object, default: () => {} },
  },
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
        customer: '',
      },
      isFormSubmitting: false,
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
        customer: {
          required: requiredIf(function () { return this.isAccountCorporate }),
          emailOrPhoneNumber: this.isAccountCorporate ? emailOrPhoneNumber : {},
        },
      },
      totalSelectedTimeInMinutes: {
        minBookingTime: () => this.isSelectedTimeMoreThanMinDuration,
        maxBookingTime: () => this.isMaxDurationMoreThanSelectedTime,
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
    ]),

    selectKey () {
      return this.freeRooms.join('') || 'select-room'
    },
    minDate () {
      return this.form.startTime
        ? moment(this.form.startTime).subtract(1, 'days').toISOString()
        : ''
    },
    price () {
      if (this.canGetFreeSeats) {
        const hours = this.totalSelectedTimeInMinutes / SIXTY_MINUTES
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
        this.form.numberSeats <= MAX_PLACE &&
        moment(this.form.startTime).utc() < moment(this.form.endTime).utc()
      )
    },
    totalSelectedTimeInMinutes () {
      const startTime = moment(this.form.startTime)
      const endTime = moment(this.form.endTime)
      // used default divide because we don't need round mode
      return moment.duration(endTime.diff(startTime)).asMinutes()
    },

    isSelectedTimeMoreThanMinDuration () {
      // eslint-disable-next-line max-len
      return this.totalSelectedTimeInMinutes >= this.business.minDurationInMinutes
    },
    isMaxDurationMoreThanSelectedTime () {
      // eslint-disable-next-line max-len
      return this.business.maxDurationInMinutes >= this.totalSelectedTimeInMinutes
    },
    isPeriodExists () {
      return !_isEmpty(this.period)
    },
  },
  watch: {
    'form.numberSeats' (value) {
      this.form.numberSeats = Math.floor(value)
      debounce(this.getFreePlace(), 300)
    },
    'form.startTime' () {
      debounce(this.getFreePlace(), 300)
    },
    'form.endTime' () {
      debounce(this.getFreePlace(), 300)
    },
  },
  async created () {
    await this.getBusiness()
    if (this.isPeriodExists) {
      this.form.startTime = this.period.start.toISOString()
      this.form.endTime = this.period.end.toISOString()
    }
  },
  methods: {
    async submit () {
      this.isFormSubmitting = true
      try {
        const { data: bookEvent } = await this.bookEvent(
          1,
          1,
          this.form.numberSeats,
          this.form.room.id,
          this.form.startTime,
          this.form.endTime,
          this.form.customer
        )

        if (this.isAccountCorporate) {
          this.$emit(EVENTS.createdBooking)
        } else {
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
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isFormSubmitting = false
      this.hideConfirmation()
    },
    getCurrentDate () {
      return moment().toISOString()
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

    humanizeDurationTime (time) {
      return moment.duration(time, 'minutes').humanize()
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

  .booking-form__error-msg {
    color: $col-accent;
    margin-top: 0.4rem;
    font-size: 1.2rem;
  }

  .booking__customer-note {
    opacity: 0.5;
  }
</style>
