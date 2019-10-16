<template>
  <div class="promo-code-offers-table">
    <h3 class="promo-code-offers-table__offers-title">
      {{ 'promo-code-offers-table.offers-title' | globalize }}
    </h3>

    <div class="app__table">
      <table>
        <thead>
          <tr>
            <th v-if="!isPromoCodeAttributesDrawer" />
            <th :title="'promo-code-offers-table.name-th' | globalize">
              {{ 'promo-code-offers-table.name-th' | globalize }}
            </th>
            <th :title="'promo-code-offers-table.amount-th' | globalize">
              {{ 'promo-code-offers-table.amount-th' | globalize }}
            </th>
            <th :title="'promo-code-offers-table.price-th' | globalize">
              {{ 'promo-code-offers-table.price-th' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="isPromoCodeAttributesDrawer">
            <promo-code-offers-table-row
              v-for="offer in offers"
              :key="offer.id"
              :offer-id="offer.id"
            />
          </template>
          <template v-else>
            <tr
              v-for="offer in offers"
              :key="offer.id"
            >
              <td>
                <tick-field
                  v-model="checkedOffers"
                  :cb-value="offer"
                />
              </td>

              <td :title="offer.baseAssetName">
                {{ offer.baseAssetName }}
              </td>

              <td :title="offer.amount | formatMoney">
                {{ offer.amount | formatBalance }}
              </td>

              <td :title="offer.price | formatMoney">
                {{ offer.price | formatMoney }} {{ offer.priceAsset }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import PromoCodeOffersTableRow from '@/vue/pages/promo-codes/PromoCodeOffersTableRow'
import TickField from '@/vue/fields/TickField'

const EVENTS = {
  updateOffers: 'update-offers',
}
export default {
  name: 'promo-code-offers-table',

  components: {
    PromoCodeOffersTableRow,
    TickField,
  },

  props: {
    offers: {
      type: Array,
      required: true,
    },
    isPromoCodeAttributesDrawer: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    EVENTS,
    checkedOffers: [],
  }),

  watch: {
    checkedOffers (value) {
      this.$emit(EVENTS.updateOffers, value)
    },
  },
}
</script>

<style lang="scss" scoped>
.promo-code-offers-table__offers-title {
  margin-top: 2rem;
}
</style>
