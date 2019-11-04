<template>
  <div class="statistics-sales-history-attributes-viewer">
    <table class="statistics-sales-history-attributes-viewer__table">
      <tbody>
        <tr class="statistics-sales-history-attributes-viewer__table-row">
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ 'statistics-sales-history-attributes-viewer.date-key' | globalize }}
          </td>
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            {{ buyRequest.createdAt| formatCalendar }}
          </td>
        </tr>
        <tr class="statistics-sales-history-attributes-viewer__table-row">
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ 'statistics-sales-history-attributes-viewer.amount-key' | globalize }}
          </td>
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ buyRequest.amount | formatMoney }} {{ buyRequest.boughtAssetName }}
          </td>
        </tr>
        <tr
          class="statistics-sales-history-attributes-viewer__table-row"
          v-if="buyRequest.promoCode"
        >
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ 'statistics-sales-history-attributes-viewer.promo-code-key' | globalize }}
          </td>
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            {{ buyRequest.promoCode }}
          </td>
        </tr>
        <tr class="statistics-sales-history-attributes-viewer__table-row">
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ 'statistics-sales-history-attributes-viewer.discount-key' | globalize }}
          </td>
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            {{ buyRequest.discount | formatPercent }}
          </td>
        </tr>
        <tr class="statistics-sales-history-attributes-viewer__table-row">
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ 'statistics-sales-history-attributes-viewer.total-price-key' | globalize }}
          </td>
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ buyRequest.totalPrice | formatMoney }} {{ buyRequest.priceAsset }}
          </td>
        </tr>
        <tr class="statistics-sales-history-attributes-viewer__table-row">
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <!-- eslint-disable-next-line max-len -->
            {{ 'statistics-sales-history-attributes-viewer.buyer-key' | globalize }}
          </td>
          <td class="statistics-sales-history-attributes-viewer__table-cell">
            <template v-if="buyRequest.senderAccountId">
              <email-getter
                :is-copy-button="false"
                :account-id="buyRequest.senderAccountId"
              />
            </template>
            <template v-else>
              {{ buyRequest.senderEmail }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'

export default {
  name: 'statistics-sales-history-attributes-viewer',

  components: {
    EmailGetter,
  },

  props: {
    buyRequest: {
      type: BuyRequestRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/scss/variables';

.statistics-sales-history-attributes-viewer {
  width: 100%;
  overflow: auto;
  padding: 1.5rem 0 0;
  border-top: 0.1rem solid $col-button-flat-disabled-txt;
}

.statistics-sales-history-attributes-viewer__table {
  max-width: 55rem;
  width: 100%;
}

.statistics-sales-history-attributes-viewer__table-cell {
  max-width: 2rem;
  padding: 0.7rem 1.5rem 0.7rem 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $col-text;

  &:first-of-type {
    color: $col-table-head-text;
  }
}
</style>
