import _get from 'lodash/get'

export class PromoCodeRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.code = _get(record, 'code')
    this.description = _get(record, 'description')
    this.maxUses = _get(record, 'maxUses')
    this.used = _get(record, 'used')
    this.discount = _get(record, 'discount')
    this.owner = _get(record, 'owner')
    this.status = _get(record, 'status')
    this.offersId = _get(record, 'offers')
      .map(offer => _get(offer, 'id'))
  }
}
