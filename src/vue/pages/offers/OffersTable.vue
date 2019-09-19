<template>
  <div class="offers-table">
    <div
      class="
        app__table
        app__table--with-shadow
        app__table--clickable-rows
      "
    >
      <table>
        <thead>
          <tr>
            <th :title="'offers-table.table-id-header' | globalize">
              {{ 'offers-table.table-id-header' | globalize }}
            </th>
            <th :title="'offers-table.table-date-header' | globalize">
              {{ 'offers-table.table-date-header' | globalize }}
            </th>
            <th :title="'offers-table.table-offer-header' | globalize">
              {{ 'offers-table.table-offer-header' | globalize }}
            </th>
            <th :title="'offers-table.table-base-amount-header' | globalize">
              {{ 'offers-table.table-base-amount-header' | globalize }}
            </th>
            <th :title="'offers-table.table-price-header' | globalize">
              {{ 'offers-table.table-price-header' | globalize }}
            </th>
          </tr>
        </thead>
        <tbody
          v-if="offers.length"
        >
          <tr
            v-for="(offer, i) in offers"
            :key="`offers-table-row-${i}`"
            @click="$emit(EVENTS.select, offer)">
            <td>{{ offer.id }}</td>
            <td :title="offer.createdAt | formatCalendar">
              {{ offer.createdAt | formatCalendar }}
            </td>
            <td>
              <template v-if="offer.isBuy">
                {{ 'trade-open-offers.buy-lbl' | globalize }}
              </template>
              <template v-else>
                {{ 'trade-open-offers.sell-lbl' | globalize }}
              </template>
            </td>
            <td :title="offer.baseAmount | formatMoney">
              {{ offer.baseAmount | formatMoney }}
            </td>
            <td :title="offer.price | formatMoney">
              {{ offer.price | formatMoney }}
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
</style>
