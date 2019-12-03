<template>
  <div class="business">
    <div class="business__wrp">
      <div class="business__top-bar">
        <div class="business__name-wrp">
          <h1 class="business__title">
            {{ business.name }}
          </h1>
          <h3
            v-if="business.industry"
            class="business__industry"
          >
            {{ business.industry }}
          </h3>
        </div>
        <router-link
          class="business__login-link"
          :to="vueRoutes.login"
        >
          <img class="business__logo" src="/static/branding/logo.png">
          <img class="business__small-logo" src="/static/branding/favicon.png">
        </router-link>
      </div>

      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message
            :message="'business.load-failed-msg' | globalize"
          />
        </template>

        <template v-else>
          <template v-if="isNotFoundBusiness">
            <no-data-message
              icon-name="castle"
              :title="'business.no-business-title' | globalize"
              :message="'business.no-business-msg' | globalize"
            />
          </template>
          <template v-else>
            <div class="business__description app__card">
              <business-description
                :business="business"
              />
            </div>
            <div class="business__shop">
              <h1 class="business__title">
                {{ 'business.shop' | globalize }}
              </h1>
            </div>
            <atomic-swaps-explore
              :business-id="id"
            />
          </template>
        </template>
      </template>

      <template v-else>
        <loader
          class="business__loader"
          :message-id="'business.loading-msg'"
        />
      </template>

      <div class="business__footer-section">
        <app-footer />
      </div>
    </div>
  </div>
</template>

<script>
import AppFooter from '@/vue/navigation/Footer'
import BusinessDescription from '@/vue/pages/business-viewer/BusinessDescription'
import AtomicSwapsExplore from '@/vue/pages/atomic-swaps/AtomicSwapsExplore'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { vueRoutes } from '@/vue-router/routes'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { BusinessRecord } from '@/js/records/entities/business.record'

const ADDRESS_ERROR_FIELD = 'address'

export default {
  name: 'business',
  components: {
    AppFooter,
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
      vueRoutes,
      business: {},
      isLoaded: false,
      isLoadFailed: false,
      isNotFoundBusiness: false,
    }
  },
  async created () {
    await this.getBusiness()
    this.isLoaded = true
  },
  methods: {
    async getBusiness () {
      try {
        const endpoint = `/integrations/dns/businesses/${this.id}`
        const { data } = await api.get(endpoint)
        this.business = new BusinessRecord(data)
      } catch (error) {
        if (error.meta.field === ADDRESS_ERROR_FIELD) {
          this.isNotFoundBusiness = true
        } else {
          this.isLoadFailed = true
        }
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/vue/forms/app-form';
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  $full-screen-padding: 5%;
  $mobile-screen-padding: 2%;
  $full-logo-width: 13.65rem;
  $small-logo-width: 4.5rem;

  .business {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }

  .business__wrp {
    width: 100%;
    max-width: 150rem;
    padding: 3.5rem $full-screen-padding;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @include respond-to(xsmall) {
      padding: 2rem $mobile-screen-padding;
    }
  }

  .business__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-bottom: 2.4rem;

    @include respond-to(xsmall) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .business__logo {
    margin-top: 1rem;
    max-width: $full-logo-width;
    height: inherit;
    width: inherit;

    @include respond-to-custom($sidebar-hide-bp) {
      display: none;
    }
  }

  .business__small-logo {
    display: none;
    max-height: 4.5rem;
    height: inherit;
    width: inherit;

    @include respond-to-custom($sidebar-hide-bp) {
      display: block;
    }
  }

  .business__name-wrp {
    max-width: calc(100% - #{$full-logo-width});
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    @include respond-to-custom($sidebar-hide-bp) {
      max-width: calc(100% - #{$small-logo-width});
    }
  }

  .business__title {
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

  .business__industry {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: $col-text;
  }

  .business__description {
    padding: 2.4rem;
    margin-bottom: 2.4rem;
  }

  .business__shop {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-bottom: 0.4rem;

    @include respond-to(xsmall) {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .business__footer-section {
    margin-top: 2.4rem;
    padding: 0 1.6rem;
    width: 100%;
  }

  .business__loader {
    justify-content: center;
  }
</style>
