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
            <td
              :title="getTableRowTitle(
                offer.baseAmount,
                offer.baseAsset.name
              )"
            >
              {{ offer.baseAmount | formatMoney }}
              {{ offer.baseAsset.name }}
            </td>
            <td
              :title="getTableRowTitle(
                offer.price,
                offer.quoteAsset.name
              )"
            >
              {{ offer.price | formatMoney }}
              {{ offer.quoteAsset.name }}
            </td>
            <td
              :title="getTableRowTitle(
                offer.quoteAmount,
                offer.quoteAsset.name
              )"
            >
              {{ offer.quoteAmount | formatMoney }}
              {{ offer.quoteAsset.name }}
            </td>
            <td>
              <button
                v-ripple
                class="
                  request-actions__btn
                  request-actions__btn--cancel
                  app__button-flat
                "
                :disabled="isButtonDisabled"
                @click="setAndCancelOffer(offer)"
              >
                {{ ( isCancelingOffer(offer)
                  ? 'offers-table.processing-btn'
                  :'offers-table.cancel-btn'
                ) | globalize
                }}
              </button>
            </td>
          </tr>
        </tbody>

        <empty-tbody-placeholder
          v-else-if="!offers.length && isLoaded"
          :colspan="4"
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
import { formatMoney } from '@/vue/filters/formatMoney'
import { base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  canceled: 'canceled',
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

  data: _ => ({
    isButtonDisabled: false,
    selectedOffer: {},
  }),

  methods: {
    getTableRowTitle (amount, assetName) {
      return `${formatMoney(amount)} ${assetName}`
    },

    isCancelingOffer (offer) {
      return this.selectedOffer.id === offer.id && this.isButtonDisabled
    },

    async setAndCancelOffer (offer) {
      this.selectedOffer = offer
      await this.cancelOffer(offer)
    },

    async cancelOffer (offer) {
      this.isButtonDisabled = true
      try {
        const cancelOfferOperation = this.buildCancelOfferOperation(offer)
        await api.postOperations(cancelOfferOperation)
        Bus.success('offers-table.offer-canceled-msg')
        this.$emit(EVENTS.canceled)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isButtonDisabled = false
    },

    buildCancelOfferOperation (offer) {
      return base.ManageOfferBuilder.cancelOffer({
        baseBalance: offer.baseBalanceId,
        quoteBalance: offer.quoteBalanceId,
        price: offer.price,
        offerID: offer.id,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
