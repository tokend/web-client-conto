<template>
  <tbody class="statistics-sales-history-table-row">
    <tr
      class="statistics-sales-history-table-row__brief
             statistics-sales-history-table-row__brief--with-shadow"
    >
      <template v-if="buyRequest.senderAccountId">
        <td
          class="statistics-sales-history-table-row__cell"
          :title="buyRequest.senderAccountId"
        >
          <email-getter
            :is-copy-button="false"
            :account-id="buyRequest.senderAccountId"
          />
        </td>
      </template>
      <template v-else>
        <td
          class="statistics-sales-history-table-row__cell"
          :title="buyRequest.senderEmail"
        >
          {{ buyRequest.senderEmail }}
        </td>
      </template>

      <td
        class="statistics-sales-history-table-row__cell"
        :title="buyRequest.createdAt | formatCalendar"
      >
        {{ buyRequest.createdAt | formatCalendar }}
      </td>
      <!-- eslint-disable max-len -->
      <td
        class="statistics-sales-history-table-row__cell"
        :title="`${formatMoney(buyRequest.amount)} ${assetByCode(buyRequest.boughtAssetCode).name}`"
      >
        <!-- eslint-enable max-len -->
        {{ buyRequest.amount | formatMoney }}
        {{ assetByCode(buyRequest.boughtAssetCode).name }}
      </td>

      <td
        class="statistics-sales-history-table-row__cell"
        :title="getBuyRequestStatusTranslated"
      >
        {{ getBuyRequestStatusTranslated }}
      </td>

      <td
        class="statistics-sales-history-table-row__cell
               statistics-sales-history-table-row__cell--expand-btn-wrp"
      >
        <button
          class="statistics-sales-history-table-row__btn"
          @click="isAttributesViewerShown = !isAttributesViewerShown"
        >
          <i
            class="mdi mdi-chevron-down
                   statistics-sales-history-table-row__toggle-icon"
            :class="{ 'mdi-rotate-180': isAttributesViewerShown }"
          />
        </button>
      </td>
    </tr>

    <tr
      v-if="isAttributesViewerShown"
      class="statistics-sales-history-table-row__attributes"
    >
      <td :colspan="5">
        <div class="statistics-sales-history-table-row__attributes-viewer-wrp">
          <statistics-sales-history-attributes-viewer
            :buy-request="buyRequest"
          />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import StatisticsSalesHistoryAttributesViewer from './StatisticsSalesHistoryAttributesViewer'
import { BuyRequestRecord } from '@/js/records/entities/buy-request.record'
import { formatMoney } from '@/vue/filters/formatMoney'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'statistics-sales-history-table-row',
  components: {
    EmailGetter,
    StatisticsSalesHistoryAttributesViewer,
  },
  props: {
    buyRequest: {
      type: BuyRequestRecord,
      required: true,
    },
  },

  data: () => ({
    isAttributesViewerShown: false,
    formatMoney,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

    getBuyRequestStatusTranslated () {
      let translationId

      if (this.buyRequest.isRejected) {
        translationId = 'statistics-sales-history-table-row.rejected-status-td'
      } else if (this.buyRequest.isPaid) {
        translationId = 'statistics-sales-history-table-row.paid-status-td'
      } else if (this.buyRequest.isTimeout) {
        translationId = 'statistics-sales-history-table-row.timeout-status-td'
      } else if (this.buyRequest.isPending) {
        translationId = 'statistics-sales-history-table-row.pending-status-td'
      } else {
        translationId = '[UNKNOWN]'
      }

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';

.statistics-sales-history-table-row__brief {
  background-color: $col-block-bg;

  &--with-shadow {
    @include box-shadow;
  }
}

.statistics-sales-history-table-row__cell {
  padding: 0.7rem 1.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: none;
  color: $col-text;

  &--expand-btn-wrp {
    text-align: right;
    width: 6.7rem;
  }
}

.statistics-sales-history-table-row__btn {
  width: 3.7rem;
  height: 3.7rem;
  border-radius: 0.4rem;
  background-color: $col-app-content-background;
  outline: none;
  border: 0;
  box-shadow: none;

  &:hover {
    background-color: $statistics-table-row-btn-hover-bg;
  }

  &:active {
    background-color: $statistics-table-row-btn-active-bg;
  }
}

.statistics-sales-history-table-row__toggle-icon {
  font-size: 1.6rem;

  &:before {
    transition: transform 0.2s ease-out;
  }
}

.statistics-sales-history-table-row__attributes-viewer-wrp {
  background: $col-block-bg;
  padding: 0.75rem 1.5rem 0.7rem;
  margin-top: -0.6rem;
  position: relative;

  @include box-shadow();

  &:before {
    // HACK: to cover sticking out shadow at the top
    content: '';
    display: block;
    position: absolute;
    background: $col-block-bg;
    height: 1rem;
    top: 0;
    left: 0;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
