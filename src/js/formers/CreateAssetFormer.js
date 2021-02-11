import { Former } from './Former'
import { Document, base } from '@tokend/js-sdk'
import config from '@/config'
import { keyValues } from '@/key-values'
import { DateUtil } from '@/js/utils'
import { api } from '@/api'
import { NEW_CREATE_ASSET_REQUEST_ID } from '@/js/const/asset.const'
import { buildPairCreationRequestOperation } from '@/js/helpers/pair-creation'

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
    await api.postOperations(
      this._buildAssetCreationRequestOperation(),
      buildPairCreationRequestOperation(this.attrs.assetCode, this.attrs.price)
    )
  }

  _buildAssetCreationRequestOperation () {
    const opts = {
      requestID: NEW_CREATE_ASSET_REQUEST_ID,
      trailingDigitsCount: config.DECIMAL_POINTS,
      code: this.attrs.assetCode,
      policies: this.attrs.policies,
      assetType: String(keyValues.assetTypeDefault),
      maxIssuanceAmount: config.MAX_AMOUNT,
      preissuedAssetSigner: config.NULL_ASSET_SIGNER,
      initialPreissuedAmount: config.MAX_AMOUNT,
      creatorDetails: {
        name: this.attrs.assetName,
        logo: this.attrs.logo,
        stellar: {},
        description: this.attrs.description,
        ...(this.attrs.expirationDate
          ? { 'expires_at': DateUtil.toTimestamp(this.attrs.expirationDate) }
          : {}
        ),
      },
    }

    return base.ManageAssetBuilder.assetCreationRequest(opts)
  }
}
