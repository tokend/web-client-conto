<template>
  <div class="business-card">
    <card>
      <card-logo
        slot="media"
        is-full-cover
        :img-url="business.logoUrl"
        :logo-text="business.name"
      />
      <template slot="header">
        {{ business.name }}
      </template>
      <template slot="subhead">
        {{ business.industry }}
      </template>
      <template slot="actions">
        <button
          v-if="!isMyBusiness"
          v-ripple
          class="app__button-flat"
          @click="addBusiness"
        >
          {{ 'business-card.add-lbl' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.vueDetails)"
        >
          {{ 'business-card.details-lbl' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>

import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'

import { BusinessRecord } from '@/js/records/entities/business.record'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { api } from '@/api'

const EVENTS = {
  businessAdded: 'business-added',
  vueDetails: 'vue-details',
}

export default {
  name: 'business-card',

  components: {
    Card,
    CardLogo,
  },

  props: {
    business: {
      type: BusinessRecord,
      required: true,
    },
  },
  data () {
    return {
      EVENTS,
      isSubmitting: false,
    }
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      myBusinesses: vuexTypes.myBusinesses,
    }),
    isMyBusiness () {
      return Boolean(this.myBusinesses.find(business => {
        return business.accountId === this.business.accountId
      })
      )
    },
  },
  methods: {
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

        this.$emit(EVENTS.businessAdded)
        Bus.success('business-viewer.business-added-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isSubmitting = false
    },
  },
}
</script>
