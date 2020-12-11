import { KycRecord } from './kyc.record'

export class KycGeneralRecord extends KycRecord {
  constructor (blob) {
    super(blob)
    const kyc = this._blob.valueAsObject

    this.firstName = kyc.first_name
    this.lastName = kyc.last_name
  }
}
