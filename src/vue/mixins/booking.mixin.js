import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const PRICES = {
  room: {
    asset: 'UAH',
    amount: '200',
  },
}
const CAPACITY = {
  room: 30,
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
          owner: this.accountId,
          details: {},
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

    async createBusinesses (calendarId) {
      try {
        const response = await api.post('/integrations/booking/businesses', {
          owner: this.accountId,
          calendar_id: +calendarId,
          name: this.kycLatestRequestData.company,
          booking: {
            specific_details: {
              prices: PRICES,
              capacity: CAPACITY,
            },
            confirmation_types: [0],
            min_duration: MIN_DURATION,
            max_duration: MAX_DURATION,
          },
        })
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async getBusinessById (businessId) {
      try {
        const { data } = await await api
          .get(`/integrations/booking/businesses/${businessId}`)
        return data
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async bookEvent (businessId, eventId, participants) {
      try {
        const response = await api
          .post(`/integrations/booking/businesses/${businessId}/bookings`, {
            'type': 0,
            'event_id': eventId,
            'payload': 'string',
            'source': 'string',
            'start_time': 'string',
            'end_time': 'string',
            'participants': participants,
            'details': { },
          })
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
