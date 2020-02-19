<template>
  <div class="booking-businesses">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'booking-business.loading-error-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="business.rooms.length">
          <div class="app__card-list">
            <div
              class="app__card-list-item"
              v-for="item in business.rooms"
              :key="item.id"
            >
              <room-card
                :room="item"
                @edit="openRoomForm(item)"
              />
            </div>
          </div>
        </template>

        <template v-else>
          <no-data-message
            icon-name="hexagon-multiple"
            :title="'booking-business.no-rooms-title' | globalize"
            :message="'booking-business.no-list-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-cards-loader />
    </template>
    <drawer :is-shown.sync="isRoomFormShown">
      <template slot="heading">
        {{ 'booking-business.room-form-header' | globalize }}
      </template>
      <room-form
        :room="selectedRoom"
        :business="business"
        @update-business="updateList"
      />
    </drawer>
  </div>
</template>

<script>
import SkeletonCardsLoader from '@/vue/common/skeleton-loader/SkeletonCardsLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ErrorMessage from '@/vue/common/ErrorMessage'
import Drawer from '@/vue/common/Drawer'
import RoomCard from './RoomCard'
import RoomForm from '@/vue/forms/RoomForm'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { BookingBusinessRecord } from '@/js/records/entities/booking-business.record'

export default {
  name: 'booking-businesses',
  components: {
    SkeletonCardsLoader,
    NoDataMessage,
    ErrorMessage,
    Drawer,
    RoomCard,
    RoomForm,
  },
  mixins: [],
  props: {
  },
  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      isRoomFormShown: false,
      businessId: '1',
      list: [],
      selectedRoom: {},
      business: {},
    }
  },
  computed: {},
  watch: {},
  async created () {
    this.getList()
  },
  destroyed () {
  },
  methods: {
    async getList () {
      this.isLoaded = false
      this.isLoadFailed = false
      try {
        const { data } = await await api
          .get(`/integrations/booking/businesses/${this.businessId}`)
        this.business = new BookingBusinessRecord(data)
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
      this.isLoaded = true
    },
    openRoomForm (room) {
      this.selectedRoom = room
      this.isRoomFormShown = true
    },
    updateList () {
      this.isRoomFormShown = false
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
  .booking-businesses__collection-loader {
    margin-top: 1rem;
  }
</style>
