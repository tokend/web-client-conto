<template>
  <div class="promo-code-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'promo-code-attributes.code-key' | globalize }}
            </td>
            <td>
              {{ promoCode.code }}
            </td>
          </tr>

          <tr v-if="promoCode.description">
            <td>
              {{ 'promo-code-attributes.description-key' | globalize }}
            </td>
            <td :title="promoCode.description">
              {{ promoCode.description }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'promo-code-attributes.discount-key' | globalize }}
            </td>
            <td>
              {{ promoCode.discount | formatPercent }}
            </td>
          </tr>

          <tr v-if="promoCode.maxUses">
            <td>
              {{ 'promo-code-attributes.max-uses-key' | globalize }}
            </td>
            <td>
              {{ promoCode.maxUses }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'promo-code-attributes.used-key' | globalize }}
            </td>
            <td>
              {{ promoCode.used }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <promo-code-offers-table
      :offers="promoCode.offers"
    />
  </div>
</template>

<script>
import PromoCodeOffersTable from '@/vue/pages/promo-codes/PromoCodeOffersTable'
import { PromoCodeRecord } from '@/js/records/entities/promo-code.record'

export default {
  name: 'promo-code-attributes',

  components: {
    PromoCodeOffersTable,
  },

  props: {
    promoCode: {
      type: PromoCodeRecord,
      required: true,
    },
  },
}
</script>
