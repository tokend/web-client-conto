<template>
  <div class="promocode-offers-table">
    <h3 class="promocode-offers-table__offers-title">
      {{ 'promocode-offers-table.offers-title' | globalize }}
    </h3>

    <div class="app__table">
      <table>
        <thead>
          <tr>
            <th v-if="!isPromocodeAttributesDrawer" />
            <th :title="'promocode-offers-table.name-th' | globalize">
              {{ 'promocode-offers-table.name-th' | globalize }}
            </th>
            <th :title="'promocode-offers-table.amount-th' | globalize">
              {{ 'promocode-offers-table.amount-th' | globalize }}
            </th>
            <th :title="'promocode-offers-table.price-th' | globalize">
              {{ 'promocode-offers-table.price-th' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="isPromocodeAttributesDrawer">
            <promocode-offers-table-row
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
import PromocodeOffersTableRow from '@/vue/pages/promocodes/PromocodeOffersTableRow'
import TickField from '@/vue/fields/TickField'

const EVENTS = {
  updateOffers: 'update-offers',
}
export default {
  name: 'promocode-offers-table',

  components: {
    PromocodeOffersTableRow,
    TickField,
  },

  props: {
    offers: {
      type: Array,
      required: true,
    },
    isPromocodeAttributesDrawer: {
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
.promocode-offers-table__offers-title {
  margin-top: 2rem;
}
</style>
