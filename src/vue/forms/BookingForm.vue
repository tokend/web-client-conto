<template>
  <form
    id="booking-form"
    class="app__form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <booking-date-field
          v-model="form.startTime"
          name="create-sale-start-time"
          :default-hour="moment().hour()"
          @input="touchField('form.startTime')"
          @blur="touchField('form.startTime')"
          :label="'booking-form.start-time-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.startTime')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <booking-date-field
          v-model="form.endTime"
          :default-hour="moment().hour()"
          @input="touchField('form.endTime')"
          @blur="touchField('form.endTime')"
          name="create-sale-end-time"
          :label="'booking-form.end-time-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.endTime', { minDate: form.startTime || getCurrentDate() }
          )"
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

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :value="form.room"
          @input="setRoom"
          name="create-sale-type"
          :label="'booking-form.room-lbl' | globalize"
        >
          <option
            v-for="room in rooms"
            :key="room.key"
            :value="room.value"
          >
            {{ room.key | globalize }}
          </option>
        </select-field>
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
        {{ 'booking.booking-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import BookingMixin from '@/vue/mixins/booking.mixin'

import moment from 'moment'

import {
  required,
  amountRange,
  minDate,
} from '@validators'

const MIN_PLACE = 1
const MAX_PLACE = 30

export default {
  name: 'booking-form',
  components: {},
  mixins: [FormMixin, BookingMixin],
  props: {
  },
  data () {
    return {
      moment,
      MIN_PLACE,
      MAX_PLACE,
      rooms: [
        {
          key: 'room 1',
          value: 'room1',
        },
        {
          key: 'room 2',
          value: 'room2',
        },
        {
          key: 'room 3',
          value: 'room3',
        },
        {
          key: 'room 4',
          value: 'room5',
        },
        {
          key: 'room 5',
          value: 'room5',
        },
        {
          key: 'room 6',
          value: 'room6',
        },
      ],
      form: {
        startTime: moment().startOf('hour').toISOString(),
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
        },
        endTime: {
          required,
          minDate: minDate(this.form.startTime || moment().toISOString()),
        },
        numberSeats: {
          required,
          amountRange: amountRange(MIN_PLACE, MAX_PLACE),
        },
        room: {
          required,
        },
      },
    }
  },
  computed: {
  },
  watch: {},
  created () {
    this.form.room = this.rooms[0].value
  },
  destroyed () {
  },
  methods: {
    submit () {
    },
    getCurrentDate () {
      return moment().toISOString()
    },
    setRoom (room) {
      this.form.room = room
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/vue/forms/_app-form';
  @import '~@scss/variables';
</style>
