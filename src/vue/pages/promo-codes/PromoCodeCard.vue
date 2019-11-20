<template>
  <div class="promo-code-card">
    <card>
      <card-logo
        slot="media"
        :logo-text="promoCode.code"
      />
      <template slot="header">
        {{ promoCode.code }}
      </template>
      <template slot="accent-title">
        <span :title="promoCode.discount | formatPercent">
          {{ 'promo-code-card.discount' | globalize({
            amount: promoCode.discount
          }) }}
        </span>
      </template>
      <template slot="content">
        {{ promoCode.description }}
      </template>
      <template slot="actions">
        <button
          v-ripple
          class="app__button-flat"
          @click="$emit(EVENTS.vueDetails)"
        >
          {{ 'promo-code-card.details-lbl' | globalize }}
        </button>
      </template>
    </card>
  </div>
</template>

<script>
import Card from '@/vue/common/Card'
import CardLogo from '@/vue/common/CardLogo'
import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  vueDetails: 'vue-details',
}

export default {
  name: 'promo-code-card',
  components: {
    Card,
    CardLogo,
  },

  props: {
    promoCode: {
      type: PromoCodeRecord,
      required: true,
    },
  },
  data () {
    return {
      EVENTS,
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
  },
}
</script>
