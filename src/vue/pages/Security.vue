<template>
  <div class="security-page">
    <drawer :is-shown.sync="isDrawerShown">
      <template v-if="viewMode === VIEW_MODES.enableTfa">
        <template slot="heading">
          <template v-if="isTotpEnabled">
            {{ 'security-page.disable-tfa-title' | globalize }}
          </template>
          <template v-else>
            {{ 'security-page.enable-tfa-title' | globalize }}
          </template>
        </template>
        <tfa-form @update="updateFactors" />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.changePassword">
        <template slot="heading">
          {{ 'security-page.change-password-btn' | globalize }}
        </template>
        <change-password-form />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.viewAccountId">
        <template slot="heading">
          {{ 'security-page.account-id-title' | globalize }}
        </template>
        <key-viewer
          :value="accountId"
          :label="'security-page.account-id-label' | globalize"
        />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.viewCompanyLink">
        <template slot="heading">
          {{ 'security-page.company-link-title' | globalize }}
        </template>
        <key-viewer
          :value="companyLink"
          :label="'security-page.company-link-label' | globalize"
        />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.changePhoneNumber">
        <template slot="heading">
          <template v-if="isPhoneEnabled">
            {{ 'security-page.change-phone-number-title' | globalize }}
          </template>
          <template v-else>
            {{ 'security-page.add-phone-number-title' | globalize }}
          </template>
        </template>
        <phone-number-form
          @submitted="updateFactors"
        />
      </template>

      <template v-else-if="viewMode === VIEW_MODES.changeTelegramUsername">
        <template slot="heading">
          <template v-if="isTelegramEnabled">
            {{ 'security-page.change-telegram-title' | globalize }}
          </template>
          <template v-else>
            {{ 'security-page.add-telegram-title' | globalize }}
          </template>
        </template>
        <telegram-form
          @submitted="updateFactors"
        />
      </template>
    </drawer>

    <template v-if="isAccountCorporate">
      <div class="security-page__row">
        <p class="security-page__row-title">
          {{ 'security-page.company-link-title' | globalize }}
        </p>
        <a
          class="security-page__row-action"
          @click="showDrawer(VIEW_MODES.viewCompanyLink)"
        >
          {{ 'security-page.view-company-link-btn' | globalize }}
        </a>
      </div>
    </template>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.enable-tfa-title' | globalize }}
      </p>
      <button @click="showDrawer(VIEW_MODES.enableTfa)">
        <switch-field :value="isTotpEnabled" />
      </button>
    </div>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.password-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.changePassword)"
      >
        {{ 'security-page.change-password-btn' | globalize }}
      </a>
    </div>

    <template v-if="isAccountCorporate">
      <div class="security-page__row">
        <p class="security-page__row-title">
          {{ 'security-page.account-id-title' | globalize }}
        </p>
        <a
          class="security-page__row-action"
          @click="showDrawer(VIEW_MODES.viewAccountId)"
        >
          {{ 'security-page.view-account-id-btn' | globalize }}
        </a>
      </div>
    </template>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.phone-number-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.changePhoneNumber)"
      >
        <template v-if="isPhoneEnabled">
          {{ 'security-page.change-phone-number-btn' | globalize }}
        </template>
        <template v-else>
          {{ 'security-page.add-phone-number-btn' | globalize }}
        </template>
      </a>
    </div>

    <div class="security-page__row">
      <p class="security-page__row-title">
        {{ 'security-page.telegram-title' | globalize }}
      </p>
      <a
        class="security-page__row-action"
        @click="showDrawer(VIEW_MODES.changeTelegramUsername)"
      >
        <template v-if="isTelegramEnabled">
          {{ 'security-page.change-telegram-btn' | globalize }}
        </template>
        <template v-else>
          {{ 'security-page.add-telegram-btn' | globalize }}
        </template>
      </a>
    </div>

    <!-- eslint-disable-next-line max-len -->
    <template v-if="isAccountCorporate">
      <div class="security-page__row">
        <p class="security-page__row-title">
          {{ 'security-page.default-quote-asset-title' | globalize }}
        </p>
        <default-quote-asset />
      </div>
    </template>
  </div>
</template>

<script>
import SwitchField from '@/vue/fields/SwitchField'
import Drawer from '@/vue/common/Drawer'
import KeyViewer from '@/vue/common/KeyViewer'
import ChangePasswordForm from '@/vue/forms/ChangePasswordForm'
import PhoneNumberForm from '@/vue/forms/PhoneNumberForm'
import TfaForm from '@/vue/forms/TfaForm'
import TelegramForm from '@/vue/forms/TelegramForm'
import DefaultQuoteAsset from '@/vue/fields/DefaultQuoteAssetSelectField'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'

const VIEW_MODES = {
  enableTfa: 'enableTfa',
  changePassword: 'changePassword',
  viewAccountId: 'viewAccountId',
  changePhoneNumber: 'changePhoneNumber',
  changeTelegramUsername: 'changeTelegramUsername',
  viewCompanyLink: 'viewCompanyLink',
  default: '',
}

export default {
  name: 'security',
  components: {
    SwitchField,
    Drawer,
    KeyViewer,
    ChangePasswordForm,
    TfaForm,
    PhoneNumberForm,
    TelegramForm,
    DefaultQuoteAsset,
  },
  data: _ => ({
    isDrawerShown: false,
    viewMode: VIEW_MODES.default,
    VIEW_MODES,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isTotpEnabled: vuexTypes.isTotpEnabled,
      isPhoneEnabled: vuexTypes.isPhoneEnabled,
      isTelegramEnabled: vuexTypes.isTelegramEnabled,
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),

    companyLink () {
      const businessHref = this.$router.resolve({
        ...vueRoutes.business,
        params: {
          id: this.accountId,
        },
      }).href

      return window.location.origin + businessHref
    },
  },

  async created () {
    try {
      await this.loadFactors()
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadFactors: vuexTypes.LOAD_FACTORS,
    }),
    showDrawer (viewMode) {
      this.viewMode = viewMode
      this.isDrawerShown = true
    },
    async updateFactors () {
      this.isDrawerShown = false
      try {
        await this.loadFactors()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.security-page {
  background: $col-block-bg;
  padding: 0 2.4rem;

  @include box-shadow();
}

.security-page__row {
  padding: 2.4rem 0;
  height: 7.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & + & {
    border-top: $col-block-line solid 0.05rem;
  }
}

.security-page__row-title {
  font-size: 1.8rem;
  color: $col-text;
  margin-right: 1rem;
}

.security-page__row-action {
  font-size: 1.3rem;
  cursor: pointer;
  color: $col-link;
  margin-left: 1rem;
  text-align: right;
}

.secret-seed__description,
.network-passphrase__description {
  font-size: 1.2rem;
  line-height: 1.25;
  color: $col-text-secondary;
  margin-bottom: 3rem;
}
</style>
