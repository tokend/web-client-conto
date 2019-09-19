<template>
  <div class="offers-table">
    <div
      class="
        app__table
        app__table--with-shadow
      "
    >
      <table>
        <thead>
          <tr>
            <th :title="'offers-table.base-amount-header' | globalize">
              {{ 'offers-table.base-amount-header' | globalize }}
            </th>
            <th :title="'offers-table.price-header' | globalize">
              {{ 'offers-table.price-header' | globalize }}
            </th>
            <th :title="'offers-table.total-amount-header' | globalize">
              {{ 'offers-table.total-amount-header' | globalize }}
            </th>
            <th />
          </tr>
        </thead>
        <tbody
          v-if="offers.length"
        >
          <tr
            v-for="(offer, i) in offers"
            :key="`offers-table-row-${i}`"
          >
            <td :title="offer.baseAmount | formatMoney">
              {{ offer.baseAmount | formatMoney }}
            </td>
            <td :title="offer.price | formatMoney">
              {{ offer.price | formatMoney }}
            </td>
            <td :title="offer.quoteAmount | formatMoney">
              {{ offer.quoteAmount | formatMoney }}
            </td>
            <td>
              <a
                class="offers-table__details-btn"
                @click="$emit(EVENTS.select, offer)"
              >
                {{ 'offers-table.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>

        <empty-tbody-placeholder
          v-else-if="!offers.length && isLoaded"
          :colspan="5"
          :message="'offers-table.no-data-message' | globalize"
        />
        <skeleton-loader-table-body
          v-else
          :cells="5"
        />
      </table>
    </div>
  </div>
</template>

<script>
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'offers-table',
  components: {
    SkeletonLoaderTableBody,
    EmptyTbodyPlaceholder,
  },
  props: {
    offers: { type: Array, required: true, default: () => [] },
    isLoaded: { type: Boolean, required: true },
  },
  data: () => ({
    EVENTS,
  }),
}
</script>

<style lang="scss">
@import '~@scss/variables';

.offers-table tr td:last-child {
  width: 3rem;
  text-align: right;
}

.offers-table__details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
