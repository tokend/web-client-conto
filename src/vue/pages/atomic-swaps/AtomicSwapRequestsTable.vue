<template>
  <div class="atomic-swap-requests-table app__table">
    <table>
      <thead>
        <tr>
          <th>
            {{ 'atomic-swaps-requests-table.buyer-th' | globalize }}
          </th>
          <th>
            {{ 'atomic-swaps-requests-table.amount-th' | globalize }}
          </th>
          <th>
            {{ 'atomic-swaps-requests-table.discount-th' | globalize }}
          </th>
          <th>
            {{ 'atomic-swaps-requests-table.total-price-th' | globalize }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in atomicSwapRequests" :key="item.id">
          <td
            class="atomic-swap-requests-table__buyer-cell"
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
  name: 'atomic-swap-requests-table',
  components: {
    EmailGetter,
  },
  props: {
    atomicSwapRequests: {
      type: Array, /** {@link BuyRequestRecord} **/
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  .atomic-swap-requests-table__buyer-cell {
    max-width: 15rem;
  }
</style>
