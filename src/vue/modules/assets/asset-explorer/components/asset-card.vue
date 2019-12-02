<template>
  <div class="asset-card">
    <card>
      <card-logo
        slot="media"
        :img-url="balance.asset.logoUrl"
        :logo-text="balance.asset.name"
      />
      <template slot="header">
        {{ balance.asset.name }}
      </template>
      <template slot="accent-title">
        <span :title="assetBalance | formatMoney">
          {{
            'assets-list.list-item-balance-line' |
              globalize({ value: assetBalance })
          }}
        </span>
      </template>
      <template slot="content">
        {{ balance.asset.description }}
      </template>
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.redeem, balance.asset.code)"
        >
          {{ 'asset-card.redeem-lbl' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.vueDetails)"
        >
          {{ 'asset-card.details-lbl' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'

import { BalanceRecord } from '@/js/records/entities/balance.record'

const EVENTS = {
  vueDetails: 'vue-details',
  redeem: 'redeem',
}

export default {
  name: 'asset-card',
  components: {
    Card,
    CardLogo,
  },

  props: {
    balance: {
      type: BalanceRecord,
      required: true,
    },
  },
  data () {
    return {
      EVENTS,
    }
  },
  computed: {
    assetBalance () {
      return {
        value: this.balance.balance,
        currency: this.balance.asset.code,
      }
    },
  },
}
</script>
