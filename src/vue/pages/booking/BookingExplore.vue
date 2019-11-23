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
                @delete="reloadList"
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
        class="atomic-swaps-explore__loader"
        :first-page-loader="getList"
        @first-page-load="setList"
        @next-page-load="concatList"
        ref="listCollectionLoader"
      />
    </div>
  </div>
</template>

<script>
import BookingMixin from '@/vue/mixins/booking.mixin'
import BookingCard from './BookingCard'
import CollectionLoader from '@/vue/common/CollectionLoader'
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { BookingRecord } from '@/js/records/entities/booking.record'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'booking-explore',
  components: {
    CollectionLoader,
    NoDataMessage,
    SkeletonCardsLoader,
    ErrorMessage,
    BookingCard,
  },
  mixins: [BookingMixin],
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      list: [],
      businessId: '1',
    }
  },
  created () {
    this.listen()
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
          .get(`/integrations/booking/businesses/${this.businessId}/bookings`)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
      return response
    },

    setList (newList) {
      this.list = newList.map(i => new BookingRecord(i))
    },

    concatList (newChunk) {
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },
  },
}
</script>

<style scoped>
  .booking-explorer__collection-loader {
    margin-top: 1rem;
  }

</style>
