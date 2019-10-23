<template>
  <div class="current-business">
    <div class="current-business__wrp">
      <template v-if="isLoaded">
        <div class="current-business__top-bar">
          <div class="current-business__name-wrp">
            <h1 class="current-business__title">
              {{ business.name }}
            </h1>
            <h3 v-if="business.industry">
              {{ business.industry }}
            </h3>
          </div>
          <div
            v-if="!isMyBusiness"
            class="current-business__actions"
          >
            <button
              v-ripple
              class="app__button-raised business-viewer__btn"
              @click="addBusiness"
              :disabled="isSubmitting"
            >
              {{ 'current-business.add-btn' | globalize }}
            </button>
          </div>
        </div>

        <div
          v-if="business.bannerKey || business.description"
          class="current-business__description app__card"
        >
          <business-description
            :business="business"
          />
        </div>

        <div class="current-business__shop">
          <h1 class="current-business__title">
            {{ 'current-business.shop' | globalize }}
          </h1>
        </div>
        <atomic-swaps-explore
          :business-id="id"
        />
      </template>
      <template v-else-if="!isLoaded && !isFailed">
        <loader
          :message-id="'current-business.loading-msg'"
        />
      </template>
      <template v-if="isFailed">
        <no-data-message
          icon-name="castle"
          :title="'current-business.error-title' | globalize"
          :message="'current-business.error-msg' | globalize"
        />
      </template>
    </div>
  </div>
</template>

<script>
import BusinessDescription from '@/vue/pages/business/BusinessDescription'
import AtomicSwapsExplore from '@/vue/pages/atomic-swaps/AtomicSwapsExplore'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { BusinessRecord } from '@/js/records/entities/business.record'
import { Bus } from '@/js/helpers/event-bus'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'current-business',

  components: {
    BusinessDescription,
    AtomicSwapsExplore,
    Loader,
    NoDataMessage,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      vueRoutes,
      business: {},
      myBusinesses: [],
      isLoaded: false,
      isFailed: false,
      isSubmitting: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    isMyBusiness () {
      return Boolean(this.myBusinesses.find(business => {
        return business.accountId === this.business.id
      })
      )
    },
  },

  async created () {
    await this.getBusiness()
    await this.getMyBusinesses()
    this.isLoaded = true
  },

  methods: {
    async getBusiness () {
      try {
        const endpoint = `/integrations/dns/businesses/${this.id}`
        const { data } = await api.get(endpoint)
        this.business = new BusinessRecord(data)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
        this.isFailed = true
      }
    },

    async getMyBusinesses () {
      try {
        const endpoint = `/integrations/dns/clients/${this.accountId}/businesses`
        const { data } = await api.getWithSignature(endpoint)
        this.myBusinesses = data.map(i => new BusinessRecord(i))
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },

    async addBusiness () {
      this.isSubmitting = true
      try {
        const endpoint = `/integrations/dns/clients/${this.accountId}/businesses`
        await api.postWithSignature(endpoint, {
          data: {
            id: this.business.accountId,
            type: 'businesses',
          },
        })

        await this.getMyBusinesses()
        Bus.success('current-business.business-added-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSubmitting = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .current-business {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .current-business__wrp {
    width: 100%;
    max-width: 150rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .current-business__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.4rem;
  }

  .current-business__name-wrp {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .current-business__title {
    color: $col-text-page-heading;
    font-size: 3rem;
    line-height: 1.5;
    font-weight: 400;
    min-width: 15rem;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3.2rem;
    }
  }

  .current-business__description {
    padding: 2.4rem;
    margin-bottom: 2.4rem;
  }

  .current-business__shop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.4rem;
  }
</style>
