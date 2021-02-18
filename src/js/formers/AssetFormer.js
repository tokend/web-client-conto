import { Former } from './Former'
import { Document, base } from '@tokend/js-sdk'
import config from '@/config'
import { keyValues } from '@/key-values'
import { DateUtil } from '@/js/utils'
import { buildPairCreationRequestOperation } from '@/js/helpers/pair-creation-helper'

/**
 * Collects the attributes for asset operation
 * @class
 * @implements {Former}
 */
export class AssetFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      requestId: '0',
      assetCode: '',
      assetName: '',
      description: '',
      price: '',
      expirationDate: '',
      logo: new Document(),
      policies: 33,
    }
  }

  _isUpdateOp = false
  async buildOps () {
    await Document.uploadDocuments([this.attrs.logo])

    if (this._isUpdateOp) {
      const operation = this._buildOpUpdate()
      return operation
    }

    let operations = []

    operations.push(
      this._buildOpCreate(),
      buildPairCreationRequestOperation(
        this.attrs.assetCode,
        this.attrs.price
      )
    )

    return operations
  }

  _buildOpCreate () {
    const opts = {
      requestID: this.attrs.requestId,
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

  _buildOpUpdate () {
    const opts = {
      requestID: this.attrs.requestId,
      code: this.attrs.assetCode,
      policies: this.attrs.policies,
      creatorDetails: {
        name: this.attrs.assetName,
        logo: new Document(this.attrs.logo),
        description: this.attrs.description,
        stellar: {},
        ...(this.attrs.expirationDate
          ? { 'expires_at': DateUtil.toTimestamp(this.attrs.expirationDate) }
          : {}
        ),
      },
    }

    return base.ManageAssetBuilder.assetUpdateRequest(opts)
  }

  /** @param {AssetRecord} source */
  populate (source) {
    if (source.isActive) this._isUpdateOp = true
    this.attrs = this.attrs || this._defaultAttrs

    this.attrs.assetCode = source.code
    this.attrs.policies = source.policy
    this.attrs.assetName = source.name
    this.attrs.logo = new Document(source.logo)
    this.attrs.description = source.description
    this.attrs.expirationDate = source.expirationDate
  }
}
