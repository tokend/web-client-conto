import { Former } from './Former'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'
import { PAYMENT_METHODS } from '@/js/const/payment-methods.const'
import { getPaymentTx } from '@/js/helpers/paymentTx-helper'
/**
 * Collects the attributes for atomic swap operations
 * @class
 * @implements {Former}
 */
export class AtomicSwapFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      requestId: '',
      assetCode: '',
      price: '',
      amountToSell: '',
      priceAsset: '',
      quoteAssets: [],
    }
  }

  async buildOp () {
    let operation = {}

    if (this.attrs.requestId) {
      operation = this._buildOpUpdate()
    } else {
      operation = await this._buildOpCreate()
    }

    return operation
  }

  async _buildOpCreate () {
    const paymentTx = await getPaymentTx(
      this.attrs.assetCode,
      this.attrs.amountToSell,
    )

    const quoteAssetsKey = this.attrs.quoteAssets.map(quoteAsset => {
      return {
        id: this._getCreatePaymentMethodId(quoteAsset),
        type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
      }
    })

    const operation = {
      data: {
        type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
        attributes: {
          payment_tx_envelope: paymentTx,
          price: this.attrs.price,
          price_asset: this.attrs.priceAsset,
          base_asset: this.attrs.assetCode,
        },
        relationships: {
          payment_methods: {
            data: quoteAssetsKey,
          },
        },
      },
      included: this._getPaymentQuoteAssets(),
    }

    return operation
  }

  async _buildOpUpdate () {
    let attributes = {}

    if (+this.attrs.amountToSell) {
      const paymentTx = await getPaymentTx(
        this.attrs.assetCode,
        this.attrs.amountToSell,
      )
      attributes.tx = paymentTx
    }

    attributes.price = this.attrs.price

    return attributes
  }

  _getPaymentQuoteAssets () {
    const quoteAssets = this.attrs.quoteAssets.map(quoteAsset => {
      return {
        id: this._getCreatePaymentMethodId(quoteAsset),
        type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
        attributes: {
          asset: quoteAsset.asset.code,
          destination: quoteAsset.destination,
          type: Number(quoteAsset.type),
        },
      }
    })

    return quoteAssets
  }

  _getCreatePaymentMethodId (quoteAsset) {
    // fix duplicate two some asset code with different type
    return quoteAsset.type === PAYMENT_METHODS.internal.value
      ? `I${this.attrs.priceAsset}`
      : quoteAsset.asset.code
  }

  /** @param {AtomicSwapAskRecord} source */
  populate (source) {
    this.attrs = this.attrs || this._defaultAttrs

    this.attrs.requestId = source.id
    this.attrs.assetCode = source.baseAssetCode
    this.attrs.price = source.price
    this.attrs.amountToSell = source.amount
    this.attrs.priceAsset = source.priceAsset
    this.attrs.quoteAssets = source.quoteAssets
  }
}
