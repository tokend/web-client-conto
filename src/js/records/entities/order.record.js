import _get from 'lodash/get'

export class OrderRecord {
  constructor (record) {
    this._record = record
    this.id = _get(record, 'id')
    this.baseAmount = _get(record, 'baseAmount')
    this.baseAssetCode = _get(record, 'baseAsset.id')
    this.price = _get(record, 'price')
    this.quoteAmount = _get(record, 'quoteAmount')
    this.quoteAssetCode = _get(record, 'quoteAsset.id')
    this.isBuy = _get(record, 'isBuy')
  }
}
