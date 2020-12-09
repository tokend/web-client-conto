<template>
  <div class="marketplace-offer-requests-table app__table">
    <table>
      <thead>
        <tr>
          <th>
            {{ 'marketplace-offer-requests-table.buyer-th' | globalize }}
          </th>
          <th>
            {{ 'marketplace-offer-requests-table.amount-th' | globalize }}
          </th>
          <th>
            {{ 'marketplace-offer-requests-table.discount-th' | globalize }}
          </th>
          <th>
            {{ 'marketplace-offer-requests-table.total-price-th' | globalize }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in marketplaceOfferRequests" :key="item.id">
          <td
            class="marketplace-offer-requests-table__buyer-cell"
            :title="item.senderAccountId"
          >
            <email-getter
              :is-copy-button="false"
              :account-id="item.senderAccountId"
            />
          </td>
          <td>
            {{ item.amount | formatMoney }}
          </td>
          <td>
            {{ item.discount | formatPercent }}
          </td>
          <td>
            {{ item.totalPrice | formatMoney }} {{ item.priceAsset }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'

export default {
  name: 'marketplace-offer-requests-table',
  components: {
    EmailGetter,
  },
  props: {
    marketplaceOfferRequests: {
      type: Array, /** {@link BuyRequestRecord} **/
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  .marketplace-offer-requests-table__buyer-cell {
    max-width: 15rem;
  }
</style>
