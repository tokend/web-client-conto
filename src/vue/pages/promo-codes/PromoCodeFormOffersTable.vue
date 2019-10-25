<template>
  <div class="promo-code-form-offers-table">
    <h3 class="promo-code-form-offers-table__offers-title">
      {{ 'promo-code-form-offers-table.offers-title' | globalize }}
    </h3>

    <div class="app__table">
      <table>
        <thead>
          <tr>
            <th>
              <tick-field
                class="promo-code-form-offers-table__cb"
                v-model="checkedOffers"
                :cb-value="offers"
              />
            </th>
            <th :title="'promo-code-form-offers-table.name-th' | globalize">
              {{ 'promo-code-form-offers-table.name-th' | globalize }}
            </th>
            <th :title="'promo-code-form-offers-table.amount-th' | globalize">
              {{ 'promo-code-form-offers-table.amount-th' | globalize }}
            </th>
            <th :title="'promo-code-form-offers-table.price-th' | globalize">
              {{ 'promo-code-form-offers-table.price-th' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="offer in offers"
            :key="offer.id"
          >
            <td>
              <tick-field
                class="promo-code-form-offers-table__cb"
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TickField from '@/vue/fields/TickField'

const EVENTS = {
  updateOffers: 'update-offers',
}
export default {
  name: 'promo-code-form-offers-table',

  components: {
    TickField,
  },

  props: {
    offers: {
      type: Array, /** {@link AtomicSwapAskRecord} **/
      required: true,
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
.promo-code-form-offers-table__offers-title {
  margin-top: 2rem;
}

.promo-code-form-offers-table__cb {
  margin-top: 0.2rem;
}
</style>
