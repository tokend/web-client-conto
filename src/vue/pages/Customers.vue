<template>
  <div class="customers-page">
    <top-bar>
      <template slot="main">
        <multi-select-field
          class="app__multiselect-field--no-border"
          v-if="selectionOptions.length"
          @selected="emitSelectedBalances"
          :options="selectionOptions"
          select-all
        />
      </template>
      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isInviteDrawerShown = true"
        >
          {{ 'customers-page.invite-btn' | globalize }}
        </button>

        <!-- Temp. hidden -->
        <button
          v-if="false"
          v-ripple
          class="app__button-raised"
          @click="isPaymentDrawerShown = true"
        >
          {{ 'customers-page.issue-btn' | globalize }}
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
import MultiSelectField from '@/vue/fields/MultiSelectField'
import MassPaymentForm from '@/vue/forms/MassPaymentForm'
import MassInvitationForm from '@/vue/forms/MassInvitationForm'

import { Bus } from '@/js/helpers/event-bus'
import { mapGetters, mapActions } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'

export default {
  name: 'customers-page',

  components: {
    TopBar,
    Drawer,
    MassPaymentForm,
    MassInvitationForm,
    MultiSelectField,
  },

  data: _ => ({
    isInviteDrawerShown: false,
    isPaymentDrawerShown: false,
    receivers: [],
    vueRoutes,
    selectionOptions: [],
  }),

  computed: {
    ...mapGetters([
      vuexTypes.activeOwnedAssets,
    ]),
  },

  watch: {
    isPaymentDrawerShown (value) {
      if (value === false) {
        this.receivers = []
      }
    },
  },

  async created () {
    await this.loadAssets()
    this.listen()
    this.selectionOptions = this.getSelectionOptions()
  },

  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),

    emitUpdateList () {
      Bus.emit('customers:updateList')
    },

    listen () {
      Bus.on('customers:massIssue', payload => {
        this.receivers = ((payload || {}).receivers || [])
        this.isPaymentDrawerShown = true
      })
    },

    emitSelectedBalances (values) {
      Bus.emit('customers:showBalances', values)
    },

    getSelectionOptions () {
      return this.activeOwnedAssets.map(asset => {
        return {
          name: asset.name,
          value: asset.code,
        }
      })
    },
  },
}
</script>
