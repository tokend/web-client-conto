<template>
  <div class="business-viewer">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'business-viewer.load-failed-msg' | globalize"
        />
      </template>

      <template v-else>
        <template v-if="isNotFoundBusiness">
          <no-data-message
            icon-name="castle"
            :title="'business-viewer.no-business-title' | globalize"
            :message="'business-viewer.no-business-msg' | globalize"
          />
        </template>

        <template v-else>
          <div class="business-viewer__top-bar">
            <div class="business-viewer__name-wrp">
              <h1 class="business-viewer__name">
                {{ business.name }}
              </h1>
              <h3
                class="business-viewer__industry"
                v-if="business.industry"
              >
                {{ business.industry }}
              </h3>
            </div>
            <div
              class="business-viewer__actions"
            >
              <div
                class="business-viewer__btn"
                v-if="business.bannerKey || business.description"
              >
                <button
                  v-ripple
                  class="app__button-raised"
                  @click="scrollToShop"
                >
                  {{ 'business-viewer.shop-btn' | globalize }}
                </button>
              </div>
              <div
                class="business-viewer__btn"
                v-if="!isMyBusiness(business.accountId)"
              >
                <button
                  v-ripple
                  class="app__button-raised"
                  @click="addBusiness"
                  :disabled="isSubmitting"
                >
                  {{ 'business-viewer.add-btn' | globalize }}
                </button>
              </div>
            </div>
          </div>

          <business-description
            v-if="business.bannerKey || business.description"
            :business="business"
          />

          <div class="business-viewer__shop">
            <h1 ref="shop" class="business-viewer__shop-title">
              {{ 'business-viewer.shop' | globalize }}
            </h1>
          </div>
          <atomic-swaps-explore
            :business-id="business.accountId"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <loader
        :message-id="'business-viewer.loading-msg'"
      />
    </template>
  </div>
</template>

<script>
import BusinessDescription from '@/vue/pages/business-viewer/BusinessDescription'
import AtomicSwapsExplore from '@/vue/pages/atomic-swaps/AtomicSwapsExplore'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { vuexTypes } from '@/vuex'

const ADDRESS_ERROR_FIELD = 'address'

export default {
  name: 'business-viewer',

  components: {
    BusinessDescription,
    AtomicSwapsExplore,
    Loader,
    NoDataMessage,
    ErrorMessage,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      isLoaded: false,
      isLoadFailed: false,
      isSubmitting: false,
      isNotFoundBusiness: false,
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.isBusinessToBrowse,
      vuexTypes.businessToBrowse,
      vuexTypes.isMyBusiness,
    ]),

    business () {
      return this.businessToBrowse
    },
  },

  async created () {
    try {
      if (!this.isBusinessToBrowse) {
        await this.loadBusiness(this.id)
      }
      await this.loadMyBusinesses()
    } catch (error) {
      if (error.meta.field === ADDRESS_ERROR_FIELD) {
        this.isNotFoundBusiness = true
      } else {
        this.isLoadFailed = true
      }
      ErrorHandler.processWithoutFeedback(error)
    }
    this.isLoaded = true
  },
  // 'beforeDestroy' do not suitable, because when you change local,
  // the component does not have time to clean up business before creating
  // a new component
  beforeRouteLeave (to, from, next) {
    this.clearBusinessToBrowse()
    next()
  },

  methods: {
    ...mapActions({
      loadMyBusinesses: vuexTypes.LOAD_MY_BUSINESSES,
      loadBusiness: vuexTypes.LOAD_BUSINESS,
    }),

    ...mapMutations({
      clearBusinessToBrowse: vuexTypes.CLEAR_BUSINESS_TO_BROWSE,
    }),

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

        await this.loadMyBusinesses()
        Bus.success('business-viewer.business-added-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSubmitting = false
    },

    scrollToShop () {
      const element = this.$refs['shop']
      window.scrollTo(0, element.offsetTop)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .business-viewer {
    width: 100%;
    max-width: 150rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .business-viewer__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.4rem;

    @include respond-to-custom($sidebar-hide-bp) {
      flex-direction: column;
    }
  }

  .business-viewer__name-wrp {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @include respond-to-custom($sidebar-hide-bp) {
      margin-bottom: 1rem;
    }
  }

  .business-viewer__shop-title,
  .business-viewer__name {
    color: $col-text-page-heading;
    font-size: 3rem;
    line-height: 1.5;
    font-weight: 400;
    min-width: 15rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3.2rem;
    }
  }

  .business-viewer__actions {
    display: flex;
  }

  .business-viewer__btn:first-child {
    margin-right: 1rem;

    a {
      text-decoration: none;
    }
  }

  .business-viewer__industry {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: $col-secondary;
    font-size: 1.3rem;
  }

  .business-viewer__shop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.4rem;
  }
</style>
