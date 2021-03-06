<template>
  <div class="passport">
    <button @click="toggleDropdown">
      <img
        v-if="kyc.avatar && kyc.avatar.publicUrl"
        class="passport__avatar passport__avatar-image"
        :src="kyc.avatar.publicUrl"
      >
      <p
        v-else
        class="passport__avatar passport__email-abbr-btn"
      >
        {{ email | abbreviate }}
      </p>
    </button>

    <div class="passport__account-details-wrp">
      <button
        class="passport__email-btn"
        @click="toggleDropdown"
        :title="email"
      >
        {{ email | cropAddress(10) }}
        <i
          class="passport__dropdown-status-icon mdi mdi-chevron-down"
          :class="{
            'mdi-rotate-180': isDropdownOpen
          }"
        />
      </button>

      <div
        class="passport__account-type"
        :class="{ 'passport__account-type--blocked': isAccountBlocked }"
      >
        {{ accountRoleTranslationId | globalize }}
      </div>
    </div>

    <transition name="passport__dropdown">
      <div
        class="passport__dropdown"
        v-if="isDropdownOpen"
      >
        <div class="passport__dropdown-signed-in-wrp">
          <span class="passport__dropdown-signed-in-email-prefix">
            {{ 'passport.signed-in-as' | globalize }}
          </span>
          <br>
          <span
            class="passport__dropdown-signed-in-email"
            :title="email"
          >
            {{ email | cropAddress(15) }}
          </span>
        </div>

        <div class="passport__dropdown-actions-wrp">
          <button
            class="app__button-flat passport__dropdown-btn"
            @click="goSupport"
          >
            {{ 'footer.support-apps' | globalize }}
          </button>

          <button
            v-if="isAccountCorporate"
            class="passport__dropdown-btn app__button-flat"
            @click="openCompanyPage"
          >
            {{ 'passport.company-btn' | globalize }}
          </button>

          <button
            class="app__button-flat passport__dropdown-btn"
            @click="goSettings"
          >
            {{ 'passport.settings-btn' | globalize }}
          </button>

          <button
            class="app__button-flat passport__dropdown-btn"
            @click="logOut"
          >
            {{ 'passport.sign-out-btn' | globalize }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '@/config'

import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'
import { handleClickOutside } from '@/js/helpers/handle-click-outside'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'passport',

  data: () => ({
    vueRoutes,
    isDropdownOpen: false,
    loadAccountDetailsTickerTimeout: 45000,
    destructClickOutsideHandler: () => { },
  }),

  computed: {
    ...mapGetters({
      email: vuexTypes.walletEmail,
      kyc: vuexTypes.kyc,
      isAccountCorporate: vuexTypes.isAccountCorporate,
      isAccountGeneral: vuexTypes.isAccountGeneral,
      isAccountBlocked: vuexTypes.isAccountBlocked,
      accountId: vuexTypes.accountId,
    }),

    accountRoleTranslationId () {
      if (this.isAccountGeneral) {
        return 'passport.account-general'
      } else if (this.isAccountCorporate) {
        return 'passport.account-corporate'
      } else if (this.isAccountBlocked) {
        return 'passport.account-blocked'
      } else {
        return 'passport.account-unverified'
      }
    },

    avatarLogoUrl () {
      return this.kycAvatarKey
        ? `${config.FILE_STORAGE}/${this.kycAvatarKey}`
        : ''
    },
  },

  async created () {
    this.createLoadAccountDetailsTicker()
    this.loadAccountDetails()
  },

  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      logOutAccount: vuexTypes.LOG_OUT,
    }),

    async createLoadAccountDetailsTicker () {
      setInterval(() => {
        this.loadAccountDetails()
      }, this.loadAccountDetailsTickerTimeout)
    },

    async loadAccountDetails () {
      try {
        await Promise.all([
          this.loadAccount(this.accountId),
          this.loadKyc(),
        ])
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    toggleDropdown () {
      if (this.isDropdownOpen) {
        this.closeDropdown()
      } else {
        this.openDropdown()
      }
    },

    openDropdown () {
      this.isDropdownOpen = true
      this.destructClickOutsideHandler = handleClickOutside(
        '.passport',
        this.closeDropdown
      )
    },

    closeDropdown () {
      this.destructClickOutsideHandler()
      this.isDropdownOpen = false
    },

    logOut () {
      this.closeDropdown()
      this.logOutAccount()
    },

    async goSettings () {
      this.closeDropdown()
      await this.$router.push(vueRoutes.settings)
    },

    goSupport () {
      window.open(config.SUPPORT_URL, '_blank')
    },

    async openCompanyPage () {
      this.closeDropdown()
      await this.$router.push({
        ...vueRoutes.business,
        params: {
          id: this.accountId,
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

$media-hide-account-details-bp: 800px;
$dropdown-item-side-padding: 2.4rem;

.passport__dropdown-btn {
  width: 100%;
}

.passport__dropdown-signed-in-email-prefix {
  font-weight: 700;
  font-size: 1.2rem;
}

.passport {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.passport__avatar {
  cursor: pointer;
  width: 5.5rem;
  height: 5.5rem;
  box-shadow: 0 0.4rem 1rem 0 $col-passport-email-abbr-bg;
}

.passport__avatar-image {
  border-radius: 50%;
}

.passport__email-abbr-btn {
  width: 5.5rem;
  height: 5.5rem;
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-passport-email-abbr-bg;
  color: $col-passport-email-abbr-text;
}

.passport__account-details-wrp {
  margin-left: 1.6rem;

  @include respond-to-custom($media-hide-account-details-bp) {
    display: none;
  }
}

.passport__email-btn,
.passport__email-btn-icon {
  font-size: 1.8rem;
  color: $col-text;
  vertical-align: middle;
}

.passport__email-btn-icon {
  &:before {
    transition: 0.3s ease-out;
    will-change: transform;
  }

  &--dropdown-opened:before {
    transform: rotate(-180deg);
  }
}

.passport__account-type {
  color: $col-text;
  font-size: 1.2rem;
  line-height: 1.5;
}

.passport__account-type--blocked {
  color: $col-error;
  font-weight: 700;
}

.passport__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 1.8rem);
  background: $col-block-bg;
  display: flex;
  flex-direction: column;

  @include box-shadow();

  &:before {
    // dropdown arrow
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0.8rem 0.8rem;
    border-color: transparent transparent $col-block-bg transparent;
    top: -0.8rem;
    right: 3.9rem;
  }
}

.passport__dropdown-enter-active {
  animation: passport-dropdown-keyframes 0.2s ease-in-out;
  animation-duration: 0.2s;
}

.passport__dropdown-leave-active {
  animation: passport-dropdown-keyframes 0.2s ease-in-out reverse;
  animation-duration: 0.2s;
}

@keyframes passport-dropdown-keyframes {
  from {
    opacity: 0;
    margin-top: -1.2rem;
  }

  to {
    opacity: 1;
    margin-top: 0;
  }
}

.passport__dropdown-signed-in-wrp {
  padding: 1.6rem $dropdown-item-side-padding 0;
  line-height: 1.5;
  text-align: left;
  color: $col-text-secondary;
  font-size: 1.4rem;
}

.passport__dropdown-actions-wrp {
  padding: 1.6rem 0 0.6rem;
}

.passport__dropdown-status-icon {
  &:before {
    transition: 0.2s ease-out;
  }
}
</style>
