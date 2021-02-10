import { Former } from './Former'
import { Document } from '@tokend/js-sdk'

/**
 * Collects the attributes for create asset operation
 * @class
 * @implements {Former}
 */
export class CreateAssetFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      assetCode: '',
      assetName: '',
      description: '',
      price: '',
      expirationDate: '',
      logo: new Document(),
      isSellable: false,
      policies: 33,
      amountToSell: '',
      quoteAssets: {},
    }
  }

  async buildOp () {
    await Document.uploadDocuments([this.attrs.logo])
  }
}
