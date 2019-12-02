import moment from 'moment'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DateUtil } from '@/js/utils/date.util'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const PAYMENT_METHOD_ID = '1'
const DEFAULT_ASSET = 'UAH'
const DETAILS = {
  'rooms_meta': {
    room1: {
      name: 'Room #1',
    },
    room2: {
      name: 'Big room',
    },
    room3: {
      name: 'Room #3',
    },
  },
  'payment_method': PAYMENT_METHOD_ID,
}

const SPECIFIC_DETAILS = {
  room1: {
    price: {
      asset: 'UAH',
      amount: '200',
    },
    capacity: 30,
  },
  room2: {
    price: {
      asset: 'UAH',
      amount: '100',
    },
    capacity: 40,
  },
  room3: {
    price: {
      asset: 'UAH',
      amount: '130',
    },
    capacity: 50,
  },
}

const MIN_DURATION = '1h'
const MAX_DURATION = '40h'
const REFUND = '0'
const WORK_DAYS = {
  Monday: {
    start: {
      hours: 9,
      minutes: 0,
    },
    end: {
      hours: 20,
      minutes: 0,
    },
  },
  Tuesday: {
    start: {
      hours: 9,
      minutes: 0,
    },
    end: {
      hours: 20,
      minutes: 0,
    },
  },
  Wednesday: {
    start: {
      hours: 9,
      minutes: 0,
    },
    end: {
      hours: 20,
      minutes: 0,
    },
  },
  Thursday: {
    start: {
      hours: 9,
      minutes: 0,
    },
    end: {
      hours: 20,
      minutes: 0,
    },
  },
  Friday: {
    start: {
      hours: 9,
      minutes: 0,
    },
    end: {
      hours: 20,
      minutes: 0,
    },
  },
}

const DEFAULT_CARD_NUMBER = '4111111111111111'

export default {
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kycLatestRequestData,
      vuexTypes.walletEmail,
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
        const response = await api.patch(
          `/integrations/booking/businesses/${bisinessId}`,
          {
            data: {
              work_days: WORK_DAYS,
              owner: this.accountId,
              calendar_id: +calendarId,
              name: this.kycLatestRequestData.company,
              details: DETAILS,
              booking: {
                specific_details: SPECIFIC_DETAILS,
                confirmation_types: [0],
                refund: REFUND,
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
            work_days: WORK_DAYS,
            owner: this.accountId,
            calendar_id: +calendarId,
            name: this.kycLatestRequestData.company,
            details: DETAILS,
            booking: {
              specific_details: SPECIFIC_DETAILS,
              confirmation_types: [0],
              refund: REFUND,
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

    async createPaymentMethod () {
      try {
        const response = await api.post('/integrations/escrow/methods', {
          data: {
            type: 'payment-methods',
            attributes: {
              email: this.walletEmail,
              asset: DEFAULT_ASSET,
              destination: DEFAULT_CARD_NUMBER,
              details: {},
            },
            relationships: {
              owner: {
                data: {
                  id: this.accountId,
                  type: 'accounts',
                },
              },
            },
          },
        })
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async createEscow (
      amount,
      paymentMethodId,
      paymentAddress,
      assetCode,
      subject
    ) {
      const response = await api
        .post('/integrations/escrow', {
          data: {
            type: 'escrows',
            attributes: {
              amount: amount,
              source: this.accountId,
              source_email: this.walletEmail,
              destination: paymentAddress,
              asset: assetCode,
              subject: subject,
            },
            relationships: {
              payment_method: {
                data: {
                  id: paymentMethodId,
                  type: 'payment-methods',
                },
              },
            },
          },
        })
      return response
    },

    async getPaymentAddress () {
      const response = await api.get('/integrations/booking/address')
      return response.data.id
    },
  },
}
