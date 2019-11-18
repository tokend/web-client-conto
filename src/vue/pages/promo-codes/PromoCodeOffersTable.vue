<template>
  <div class="promo-code-offers-table">
    <div class="app__table">
      <table>
        <thead>
          <tr>
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
          <tr
            v-for="offer in promoCodeOffers"
            :key="offer.id"
          >
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
export default {
  name: 'promo-code-offers-table',

  props: {
    promoCodeOffers: {
      type: Array,
      required: true,
    },
  },
}
</script>
