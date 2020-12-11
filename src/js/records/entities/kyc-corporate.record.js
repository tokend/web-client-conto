import { Document } from '@tokend/js-sdk'
import { KycRecord } from './kyc.record'

export class KycCorporateRecord extends KycRecord {
  constructor (blob) {
    super(blob)
    const kyc = this._blob.valueAsObject
    const docs = kyc.documents || {}

    this.company = kyc.company
    this.industry = kyc.industry
    this.description = kyc.description
    this.avatar = new Document(docs.kyc_avatar)
    this.banner = new Document(docs.bravo)
  }
}
