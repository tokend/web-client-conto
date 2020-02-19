<template>
  <div>
    <form
      id="transfer-form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            name="room-name"
            v-model.trim="form.name"
            :label="'room-form.name-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.name',
              { length: NAME_MAX_LENGTH }
            )"
            @blur="touchField('form.name')"
            :maxlength="NAME_MAX_LENGTH"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            name="room-capacity"
            type="number"
            v-model.trim="form.capacity"
            :label="'room-form.capacity-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.capacity', {
              from: {
                value: MIN_CAPACITY,
              },
              to: {
                value: MAX_CAPACITY,
              },
            })"
            @blur="touchField('form.capacity')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :value="form.price.asset"
            @input="setAssetCode"
            :label="'movements-top-bar.asset-filter-label' | globalize"
            class="app__select"
          >
            <option
              v-for="asset in baseAssets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.name }}
            </option>
          </select-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            name="room-price-amount"
            type="number"
            v-model.trim="form.price.amount"
            :label="'room-form.price-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.price.amount', {
              from: {
                value: MIN_AMOUNT,
              },
              to: {
                value: MAX_AMOUNT,
              },
            })"
            @blur="touchField('form.price.amount')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            name="room-name"
            v-model.trim="form.logoUrl"
            :label="'room-form.logo-url-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.logoUrl',
              { length: NAME_MAX_LENGTH }
            )"
            @blur="touchField('form.logoUrl')"
            :maxlength="NAME_MAX_LENGTH"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          :is-pending="isPending"
          @ok="submit"
          @cancel="hideConfirmation"
        />
        <template v-else>
          <button
            v-ripple
            class="app__button-raised asset-actions__btn"
            type="submit"
          >
            <template v-if="room.id">
              {{ 'room-form.update-btn' | globalize }}
            </template>
            <template v-else>
              {{ 'room-form.create-btn' | globalize }}
            </template>
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import config from '@/config'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { BookingRoomRecord } from '@/js/records/entities/booking-room.record'
import { BookingBusinessRecord } from '@/js/records/entities/booking-business.record'

import {
  required,
  maxLength,
  amountRange,
} from '@validators'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const NAME_MAX_LENGTH = 255
const MIN_CAPACITY = 1
const MAX_CAPACITY = 1000

const EVENTS = {
  updateBusiness: 'update-business',
}

export default {
  name: 'room-form',
  components: {},
  mixins: [FormMixin],
  props: {
    room: { type: BookingRoomRecord, default: {} },
    business: { type: BookingBusinessRecord, required: true },
  },
  data () {
    return {
      isPending: false,
      form: {
        id: '',
        name: '',
        capacity: '',
        price: {
          amount: '',
          asset: '',
        },
        logoUrl: '',
      },
      MIN_AMOUNT: config.MIN_AMOUNT,
      MAX_AMOUNT: config.MAX_AMOUNT,
      NAME_MAX_LENGTH,
      MIN_CAPACITY,
      MAX_CAPACITY,
    }
  },
  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        logoUrl: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        capacity: {
          required,
          amountRange: amountRange(this.MIN_CAPACITY, this.MAX_CAPACITY),
        },
        price: {
          amount: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.baseAssets,
    ]),
  },
  watch: {},
  created () {
    if (this.baseAssets.length) {
      this.form.price.asset = this.baseAssets[0].code
    }
    if (this.room.id) {
      this.populateForm(this.room)
    }
  },
  destroyed () {
  },
  methods: {
    setAssetCode (asset) {
      this.form.price.asset = asset
    },

    populateForm (room) {
      this.form.name = room.name
      this.form.capacity = room.capacity
      this.form.price.amount = room.price.amount
      this.form.price.asset = room.price.asset
      this.form.logoUrl = room.logoUrl
      this.form.id = room.id
    },
    async submit () {
      this.isPending = true
      if (this.form.id) {
        this.business.removeRoom(this.form.id)
        this.business.addRoom(this.form)
      } else {
        this.business.addRoom(this.form)
      }
      try {
        await api.patchWithSignature(
          `/integrations/booking/businesses/${this.business.id}`,
          this.business.getBusinessForUpdate()
        )
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
      this.$emit(EVENTS.updateBusiness)
      this.isPending = false
      this.hideConfirmation()
    },
  },
}
</script>
