import { Former } from './Former'
import { base, Document } from '@tokend/js-sdk'
import { DateUtil } from '@/js/utils'
import { NEW_UPDATE_ASSET_REQUEST_ID } from '@/js/const/asset.const'

/**
 * Collects the attributes for update asset operations
 * @class
 * @implements {Former}
 */
export class UpdateAssetFormer extends Former {
  attrs = this.attrs || this._defaultAttrs
  get _defaultAttrs () {
    return {
      requestId: '',
      assetCode: '',
      assetName: '',
      policies: '',
      logo: '',
      description: '',
      expirationDate: '',
    }
  }

  async buildOp () {
    await Document.uploadDocumentsDeep(this.attrs)
    let opts = this._createOpts()

    return base.ManageAssetBuilder.assetUpdateRequest(opts)
  }

  _createOpts () {
    const opts = {
      requestID: this.attrs.requestId
        ? String(this.attrs.requestId)
        : NEW_UPDATE_ASSET_REQUEST_ID,
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

    return opts
  }
  /** @param {AssetRecord|UpdateAssetRequest} source */
  populate (source) {
    this.attrs.requestId = source.requestId
    this.attrs.assetCode = source.code
    this.attrs.policies = source.policy
    this.attrs.assetName = source.name
    this.attrs.logo = new Document(source.logo)
    this.attrs.description = source.description
    this.attrs.expirationDate = source.expirationDate
  }
}
