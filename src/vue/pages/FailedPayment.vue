<template>
  <div class="failed-payment">
    <div class="failed-payment__top-bar">
      <div class="failed-payment__headers">
        <h1 class="failed-payment__top-bar-title">
          {{ 'failed-payment.title' | globalize }}
        </h1>
      </div>
      <router-link
        class="failed-payment__login-link"
        :to="vueRoutes.login"
      >
        <img class="failed-payment__logo" src="/static/branding/logo-black.svg">
      </router-link>
    </div>

    <error-message
      :message="'failed-payment.failed-msg' | globalize"
    />

    <div class="failed-payment__footer-section">
      <app-footer />
    </div>
  </div>
</template>

<script>
import AppFooter from '@/vue/navigation/Footer'
import ErrorMessage from '@/vue/common/ErrorMessage'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'failed-payment-page',
  components: {
    AppFooter,
    ErrorMessage,
  },

  data () {
    return {
      vueRoutes,
    }
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables.scss';
  @import '~@scss/mixins.scss';

  .failed-payment {
    padding: 3.5rem 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;

    @include respond-to(xsmall) {
      padding: 3.5rem 2%;
    }
  }

  .failed-payment__top-bar {
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

  .failed-payment__top-bar-title {
    color: $col-text-page-heading;
    font-size: 4rem;
    line-height: 1.5;
    font-weight: 400;
    min-width: 15rem;

    @include respond-to-custom($sidebar-hide-bp) {
      font-size: 3.2rem;
    }
  }

  .failed-payment__logo {
    margin-top: 1rem;
    max-height: 4.5rem;
    height: 2rem;

    @include respond-to(xsmall) {
      width: 9rem;
    }
  }
</style>
