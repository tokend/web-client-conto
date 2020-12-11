import { Former } from './Former'
import { base, BLOB_TYPES } from '@tokend/js-sdk'
import { str, reqId } from './op-build-helpers'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'
import { BlobRecord } from '@/js/records/entities/blob.record'
import { createPrivateBlob, getCurrentAccId } from '@/js/helpers/api-helpers'
import { keyValues } from '@/key-values'
import { buildKycRecoveryOp } from '@/js/helpers/kyc-helpers'
import { KycRecoveryRequestRecord } from '@/js/records/requests/kyc-recovery-request.record'

/**
 * Collects the attributes for kyc-general operations
 * @class
 * @implements {Former}
 */
export class KycGeneralFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      requestId: '0',
      firstName: '',
      lastName: '',
    }
  }

  /* eslint-disable max-len */
  _opBuilder = this._opBuilder || this._buildOpUpdate
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  get isRecoveryOpBuilder () { return this._opBuilder === this._buildOpRecovery }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }
  useRecoveryOpBuilder () { this._opBuilder = this._buildOpRecovery; return this }
  /* eslint-enable max-len */

  get willUpdateRequest () {
    const id = this.attrs.requestId
    return Boolean(id && typeof id === 'string' && id !== '0')
  }

  async buildOps () {
    const op = await this._opBuilder()
    return [op]
  }

  // eslint-disable-next-line max-len
  /** @param {KycGeneralRecord|KycRequestRecord|KycRecoveryRequestRecord} source */
  populate (source) {
    switch (source.constructor) {
      case KycGeneralRecord:
        this._populateFromRecord(source)
        break

      case KycRequestRecord:
        this._populateFromRequest(source)
        break

      case KycRecoveryRequestRecord:
        this._populateFromRecoveryRequest(source)
        break

      default:
        throw new TypeError('Unknown source type')
    }
    return this
  }

  /** @param {KycGeneralRecord} source */
  _populateFromRecord (source) {
    this.useUpdateOpBuilder()
    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.requestId = '0'
    this.attrs.firstName = source.firstName
    this.attrs.lastName = source.lastName
  }

  /** @param {KycRequestRecord} source */
  _populateFromRequest (source) {
    if (source.isGeneralKycRecord) {
      this._populateFromRecord(source.kyc)
    }

    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.requestId = source.updatableId
  }

  /** @param {KycRecoveryRequestRecord} source */
  _populateFromRecoveryRequest (source) {
    this._populateFromRequest(source)
    this.useRecoveryOpBuilder()
  }

  async _buildOpUpdate () {
    const blob = await this._createBlob()

    const opts = {
      requestID: reqId(this.attrs.requestId),
      destinationAccount: getCurrentAccId(),
      accountRoleToSet: str(keyValues.generalRoleId),
      creatorDetails: { blob_id: blob.id },
    }

    return base.CreateChangeRoleRequestBuilder.createChangeRoleRequest(opts)
  }

  async _buildOpRecovery () {
    const blob = await this._createBlob()
    const requestId = this.attrs.requestId
    return buildKycRecoveryOp({ requestId, blobId: blob.id })
  }

  async _createBlob () {
    const attrs = this.attrs

    const blobValue = JSON.stringify({
      first_name: str(attrs.firstName),
      last_name: str(attrs.lastName),
    })
    const blob = await createPrivateBlob(BLOB_TYPES.kycGeneral, blobValue)
    return new BlobRecord(blob)
  }
}
