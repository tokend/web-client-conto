
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'

export default {
  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
    }),
  },

  methods: {
    createOffer (amount, price, isBuy, assetCode) {
      return base.ManageOfferBuilder.manageOffer({
        amount: amount,
        price: price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: isBuy,
        baseBalance: this.accountBalanceByCode(assetCode).id,
        quoteBalance: this.accountBalanceByCode(this.statsQuoteAsset.code).id,
        fee: '0',
      })
    },

    cancelOffer (offerId, assetCode) {
      return base.ManageOfferBuilder.cancelOffer({
        offerID: offerId,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        baseBalance: this.accountBalanceByCode(this.assetCode).id,
        quoteBalance: this.accountBalanceByCode(this.statsQuoteAsset.code).id,
      })
    },
  },
}
