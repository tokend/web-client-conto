<template>
  <div class="customers-page">
    <top-bar class="customers-page__top-bar">
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isInviteDrawerShown = true"
        >
          {{ 'customers-page.invite-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised"
          @click="clientsExport"
        >
          {{ 'customers-page.export-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isInviteDrawerShown">
      <template slot="heading">
        {{ 'customers-page.mass-invitation-drawer-heading' | globalize }}
      </template>

      <!-- eslint-disable-next-line max-len -->
      <mass-invitation-form @submitted="(isInviteDrawerShown = false) || emitUpdateList()" />
    </drawer>

    <drawer :is-shown.sync="isPaymentDrawerShown">
      <template slot="heading">
        {{ 'customers-page.mass-payment-drawer-heading' | globalize }}
      </template>

      <mass-payment-form
        :receivers="receivers"
        @submitted="(isPaymentDrawerShown = false) || emitUpdateList()"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import MassPaymentForm from '@/vue/forms/MassPaymentForm'
import MassInvitationForm from '@/vue/forms/MassInvitationForm'

import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'customers-page',

  components: {
    TopBar,
    Drawer,
    MassPaymentForm,
    MassInvitationForm,
  },

  data: _ => ({
    isInviteDrawerShown: false,
    isPaymentDrawerShown: false,
    receivers: [],
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  watch: {
    isPaymentDrawerShown (value) {
      if (value === false) {
        this.receivers = []
      }
    },
  },
  async created () {
    this.listen()
  },

  methods: {
    emitUpdateList () {
      Bus.emit('customers:updateList')
    },

    listen () {
      Bus.on('customers:massIssue', payload => {
        this.receivers = ((payload || {}).receivers || [])
        this.isPaymentDrawerShown = true
      })
    },
    async clientsExport () {
      try {
        await api.getWithSignature(
          `/integrations/csv/dns/businesses/${this.accountId}/clients`
        )
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.customers-page__top-bar {
  margin-bottom: 1rem;
}
</style>
