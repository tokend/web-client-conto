<template>
  <div class="successful-payment">
    <div class="successful-payment__top-bar">
      <div class="successful-payment__headers">
        <h1 class="successful-payment__top-bar-title">
          {{ 'successful-payment.title' | globalize }}
        </h1>
      </div>
      <router-link
        class="successful-payment__login-link"
        :to="vueRoutes.login"
      >
        <img
          class="successful-payment__logo"
          src="/static/branding/logo-black.svg"
        >
      </router-link>
    </div>

    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <error-message
          :message="'successful-payment.loading-error-msg' | globalize" />
      </template>
      <template v-else>
        <template v-if="isPurchasedAssetInfoExists">
          <div class="successful-payment__description">
            <div class="successful-payment__description-title">
              <h3>{{ 'successful-payment.description-header' | globalize }}</h3>
              <p>
                {{ 'successful-payment.successful-purchased-msg' | globalize({
                  amount: purchasedAssetInfo.buy_amount,
                  assetName: asset.name,
                  appName: config.APP_NAME
                }) }}
              </p>
            </div>

            <div class="successful-payment__description-body">
              <p class="successful-payment__text--bold">
                {{ 'successful-payment.how-to-start-msg' | globalize }}
              </p>
              <ol class="successful-payment__">
                <li>
                  <!-- eslint-disable max-len -->

                  <router-link
                    :to="{ name: vueRoutes.signup.name, params: { email: purchasedAssetInfo.email }}"
                  >
                    {{ 'successful-payment.sign-up-or-login-link-part-1' | globalize }}
                  </router-link>
                  {{ 'successful-payment.sign-up-or-login-link-part-2' | globalize({
                    appName: config.APP_NAME
                  }) }}
                  <router-link :to="vueRoutes.login">
                    {{ 'successful-payment.sign-up-or-login-link-part-3' | globalize }}
                  </router-link>
                  {{ 'successful-payment.sign-up-or-login-link-part-4' | globalize }}
                  {{ purchasedAssetInfo.email }}
                </li>
                <li>{{ 'successful-payment.go-to-wallet-msg' | globalize }}</li>
              </ol>
              <p class="successful-payment__text--bold">
                {{ 'successful-payment.use-wallet-msg' | globalize }}
              </p>
              <ul>
                <li>{{ 'successful-payment.transfer-msg' | globalize }}</li>
                <li>{{ 'successful-payment.redeem-msg' | globalize }}</li>
              </ul>
              <p>
                {{ 'successful-payment.use-apps-msg' | globalize({
                  appName: config.APP_NAME
                }) }}
              </p>
              <br>
              <a :href="config.PLAY_MARKET_LINK">
                <img
                  class="successful-payment__store-img"
                  :src="googlePlayCroppedImgUrl"
                >
              </a>
            </div>
            <div class="successful-payment__description-footer">
              <p>{{ 'successful-payment.contact-us-msg' | globalize }}</p>
              <a
                v-if="config.SUPPORT_PHONE"
                :href="`tel:${config.SUPPORT_PHONE}`"
              >
                {{ config.SUPPORT_PHONE }}
              </a>
              <a
                v-if="config.SUPPORT_EMAIL"
                :href="`mailto:${config.SUPPORT_EMAIL}`"
              >
                {{ config.SUPPORT_EMAIL }}
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <no-data-message
            icon-name="trophy-broken"
            :title="'successful-payment.no-link-title' | globalize"
            :message="'successful-payment.no-link-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <loader
        message-id="successful-payment.asset-loading"
      />
    </template>

    <div class="successful-payment__footer-section">
      <app-footer />
    </div>
  </div>
</template>

<script>
import AppFooter from '@/vue/navigation/Footer'
import Loader from '@/vue/common/Loader'
import ErrorMessage from '@/vue/common/ErrorMessage'
import NoDataMessage from '@/vue/common/NoDataMessage'

import _isEmpty from 'lodash/isEmpty'
import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { api } from '@/api'

export default {
  name: 'successful-payment-page',
  components: {
    AppFooter,
    Loader,
    ErrorMessage,
    NoDataMessage,
  },

  data () {
    return {
      googlePlayCroppedImgUrl: `${config.IMG_BUCKET_URL}/downloads-page/google_play_cropped.png`,
      isLoaded: false,
      isLoadFailed: false,
      asset: {},
      purchasedAssetInfo: {},
      vueRoutes,
      config,
    }
  },

  computed: {
    isPurchasedAssetInfoExists () {
      return !_isEmpty(this.purchasedAssetInfo)
    },
  },

  async created () {
    this.purchasedAssetInfo = this.$route.params.purchasedAssetInfo || {}

    if (this.isPurchasedAssetInfoExists) {
      try {
        const { data } = await api.get(`/v3/assets/${this.purchasedAssetInfo.buy_asset}`)
        this.asset = new AssetRecord(data)
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.process(error)
      }
    }

    this.isLoaded = true
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .successful-payment {
    padding: 3.5rem 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;

    @include respond-to(xsmall) {
      padding: 3.5rem 2%;
    }

    /* stylelint-disable */
    ul {
    padding: 1.8rem 0 1.8rem 4rem;

      & > li {
        list-style-type: disc !important;
      }
    }

    ol {
      padding: 1.8rem 0 1.8rem 4rem;

      & > li {
        list-style-type: decimal !important;
      }
    }
    /* stylelint-enable */
  }

  .successful-payment__top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    align-items: center;

    @include respond-to(xsmall) {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  .successful-payment__top-bar-title {
    color: $col-text-page-heading;
    font-size: 4rem;
    line-height: 1.5;
    font-weight: 400;
    min-width: 15rem;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3.2rem;
    }
  }

  .successful-payment__description {
    background-color: $col-block-bg;
    padding: 2.4rem;
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    @include box-shadow();
    @include respond-to-custom($media-small-desktop) {
      margin: 4rem 0;
    }
  }

  .successful-payment__logo {
    margin-top: 1rem;
    max-height: 4.5rem;
    height: 2rem;

    @include respond-to(xsmall) {
      width: 9rem;
    }
  }

  .successful-payment__footer-section {
    padding: 0 1.6rem;
    width: 100%;
  }

  .successful-payment__description-title {
    text-align: center;
    margin-bottom: 1.8rem;
  }

  .successful-payment__text--bold {
    font-weight: 700;
  }

  .successful-payment__description-footer {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1.8rem;
  }

  .successful-payment__store-img {
    width: 15rem;
    max-width: 15rem;
  }
</style>
