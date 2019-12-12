<template>
  <div class="booking-explorer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'booking-explorer.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="list.length">
          <div class="app__card-list">
            <div
              class="app__card-list-item"
              v-for="item in list"
              :key="item.id"
            >
              <booking-card
                :booking-record="item"
                @show-qr-code="(bookingQrCodeValue = $event) &&
                  (isQrCodeDrawerShown = true)"
              />
            </div>
          </div>
        </template>

        <template v-else>
          <no-data-message
            class="atomic-swaps-explore__no-data-message"
            icon-name="calendar-multiselect"
            :title="'booking-explorer.no-booking-title' | globalize"
            :message="'booking-explorer.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-cards-loader />
    </template>
    <div class="booking-explorer__collection-loader">
      <collection-loader
        v-if="isBusinessLoaded"
        class="atomic-swaps-explore__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>

    <drawer :is-shown.sync="isQrCodeDrawerShown">
      <template slot="heading">
        {{ 'booking-explorer.qr-code-drawer-heading' | globalize }}
      </template>

      <qr-code-wrapper
        class="booking-explorer__qr-code"
        :value="bookingQrCodeValue"
        :size="250"
      />

      <p class="booking-explorer__qr-code-msg">
        {{ 'booking-explorer.qr-code-msg' | globalize }}
      </p>
    </drawer>
  </div>
</template>

<script>
import BookingMixin from '@/vue/mixins/booking.mixin'
import BookingCard from './BookingCard'
import CollectionLoader from '@/vue/common/CollectionLoader'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Drawer from '@/vue/common/Drawer'
import QrCodeWrapper from '@/vue/common/QrCodeWrapper'

import { BookingRecord } from '@/js/records/entities/booking.record'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { BookingBusinessRecord } from '@/js/records/entities/booking-business.record'
import { BOOKING_STATES } from '@/js/const/booking-states.const'

export default {
  name: 'booking-explore',
  components: {
    CollectionLoader,
    NoDataMessage,
    SkeletonCardsLoader,
    ErrorMessage,
    BookingCard,
    Drawer,
    QrCodeWrapper,
  },
  mixins: [BookingMixin],
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      list: [],
      businessId: '1',
      business: {},
      isBusinessLoaded: false,
      isQrCodeDrawerShown: false,
      bookingQrCodeValue: '',
    }
  },

  async created () {
    this.listen()
    try {
      const business = await this.getBusinessById(1)
      this.business = new BookingBusinessRecord(business)
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
    this.isBusinessLoaded = true
  },

  methods: {
    listen () {
      Bus.on('customers:updateList', () => {
        this.reloadList()
      })
    },
    async getList () {
      this.isLoaded = false
      this.isLoadFailed = false
      let response
      try {
        response = await api
          .getWithSignature(`/integrations/booking/businesses/${this.businessId}/bookings`, {
            filter: {
              owner: this.accountId,
              state: BOOKING_STATES.accepted,
            },
          })
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
      return response
    },

    setList (newList) {
      this.list = newList.map(i => new BookingRecord(
        i,
        this.business
      ))
    },

    concatList (newChunk) {
      this.list = this.list.concat(
        newChunk.map(i => new BookingRecord(i))
      )
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
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
