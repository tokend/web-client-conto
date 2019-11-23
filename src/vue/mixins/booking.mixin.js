import moment from 'moment'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DateUtil } from '@/js/utils/date.util'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const ROOMS = [
  'room1',
  'room2',
  'room3',
]
const PRICES = {
  room1: {
    asset: 'UAH',
    amount: '200',
  },
  room2: {
    asset: 'UAH',
    amount: '100',
  },
  room3: {
    asset: 'UAH',
    amount: '130',
  },
}
const CAPACITY = {
  room1: 30,
  room2: 40,
  room3: 50,
}
const MIN_DURATION = '1h'
const MAX_DURATION = '40h'

export default {
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kycLatestRequestData,
    ]),
  },
  methods: {
    async createCalendar () {
      try {
        const response = await api.post('/integrations/scheduler/calendars', {
          data: {
            owner: this.accountId,
            details: {},
          },
        })
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async getCalendarById (calendarId) {
      try {
        const { data } = await await api
          .get(`/integrations/scheduler/calendars/${calendarId}`)
        return data
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async updateBusinesses (calendarId, bisinessId) {
      try {
        const response = await api.post(
          `/integrations/booking/businesses${bisinessId}`,
          {
            data: {
              owner: this.accountId,
              calendar_id: +calendarId,
              name: this.kycLatestRequestData.company,
              booking: {
                specific_details: {
                  prices: PRICES,
                  capacity: CAPACITY,
                  payloads: ROOMS,
                },
                confirmation_types: [0],
                min_duration: MIN_DURATION,
                max_duration: MAX_DURATION,
              },
            },
          })
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
    async createBusinesses (calendarId) {
      try {
        const response = await api.post('/integrations/booking/businesses', {
          data: {
            owner: this.accountId,
            calendar_id: +calendarId,
            name: this.kycLatestRequestData.company,
            booking: {
              specific_details: {
                prices: PRICES,
                capacity: CAPACITY,
                payloads: ROOMS,
              },
              confirmation_types: [0],
              min_duration: MIN_DURATION,
              max_duration: MAX_DURATION,
            },
          },
        })
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async getBusinessById (businessId) {
      const { data } = await await api
        .get(`/integrations/booking/businesses/${businessId}`)
      return data
    },

    async bookEvent (
      businessId,
      eventId,
      participants,
      room,
      startTime,
      endTime
    ) {
      const response = await api
        .post(`/integrations/booking/businesses/${businessId}/bookings`, {
          data: {
            'confirmation_type': 0,
            'payload': room,
            'source': this.accountId,
            'start_time': moment(startTime).toISOString(),
            'end_time': moment(endTime).toISOString(),
            'participants': +participants,
            'details': {},
          },
        })
      return response
    },

    async cancelBooking (bookingId, businessId) {
      try {
        const response = await api.delete(`/integrations/booking/businesses/${businessId}/bookings/${bookingId}`)
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async freebusy (calendarId, startTime, endTime) {
      try {
        const response = await api
          .get(`/integrations/scheduler/calendar/${calendarId}/freebusy`, {
            filter: {
              payload: 'room1',
              limit: 100,
              'start-time': startTime,
              'end-time': endTime,
            },
          })
        return response
      } catch (e) {

      }
    },

    async getFree (calendarId, startTime, endTime, participants, payloads) {
      const response = await api
        .get(`/integrations/scheduler/calendars/${calendarId}/free`, {
          'start-time': DateUtil.toTimestamp(moment(startTime).toISOString()),
          'end-time': DateUtil.toTimestamp(moment(endTime).toISOString()),
          participants: participants,
          payloads: payloads,
        })
      return response.data
    },
  },
}
