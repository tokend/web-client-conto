import { Former } from './Former'
import { base } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { OfferRecord } from '@/js/records/entities/offer.record'
import { OrderRecord } from '@/js/records/entities/order.record'

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
        fees: '0',
      }
    }

    buildOps () {
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
        fee: this.attrs.fees,
      }

      return base.ManageOfferBuilder.manageOffer(opts)
    }

    /** @param {OfferRecord|OrderRecord} source */
    populate (source) {
      this.attrs = this.attrs || this._defaultAttrs

      switch (source.constructor) {
        case OfferRecord: this._populateFromOfferRecord(source); break
        case OrderRecord: this._populateFromOrderRecord(source); break
        default: throw TypeError('Unknown source type')
      }
    }

    /** @param {OfferRecord} source */
    _populateFromOfferRecord (source) {
      this.attrs.requestId = source.id
      this.attrs.price = source.price
      this.attrs.amount = String(source.quoteAmount / source.price)
    }

    /** @param {OrderRecord} source */
    _populateFromOrderRecord (source) {
      this.attrs.requestId = source.id
      this.attrs.price = source.price
      this.attrs.amount = ''
    }
}
