import { Former } from './Former'
import { base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { OfferRecord } from '@/js/records/entities/offer.record'

/**
 * Collects the attributes for buyback operation
 * @class
 * @implements {Former}
 */
export class BuybackFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
      return {
        requestId: '0',
        amount: '',
        price: '',
        baseBalance: '',
        quoteBalance: '',
        isBuy: true,
      }
    }

    buildOp () {
      let operations = []

      if (+this.attrs.requestId) {
        operations.push(this.buildOpCancelOffer())
      }

      operations.push(this._buildOpCreateOffer())

      return operations
    }

    buildOpCancelOffer () {
      const opts = {
        offerID: this.attrs.requestId,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        baseBalance: this.attrs.baseBalance,
        quoteBalance: this.attrs.quoteBalance,
      }

      return base.ManageOfferBuilder.cancelOffer(opts)
    }

    _buildOpCreateOffer () {
      const opts = {
        amount: this.attrs.amount,
        price: this.attrs.price,
        orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
        isBuy: this.attrs.isBuy,
        baseBalance: this.attrs.baseBalance,
        quoteBalance: this.attrs.quoteBalance,
        fee: '0',
      }

      return base.ManageOfferBuilder.manageOffer(opts)
    }

    /** @param {OfferRecord|OrderRecord} source */
    populate (source) {
      this.attrs = this.attrs || this._defaultAttrs

      this.attrs.requestId = source.id
      this.attrs.price = source.price

      if (source.constructor === OfferRecord) {
        this.attrs.amount = String(source.quoteAmount / source.price)
      } else {
        this.attrs.amount = ''
      }
    }
}
