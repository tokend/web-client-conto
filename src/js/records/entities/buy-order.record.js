import _get from 'lodash/get'

export class BuyOrderRecord {
  constructor (record) {
    this._record = record
    this.id = _get(record, 'id')
    this.baseAmount = _get(record, 'baseAmount')
    this.baseAssetCode = _get(record, 'baseAsset.id')
    this.isBuy = _get(record, 'isBuy')
    this.price = _get(record, 'price')
    this.quoteAmount = _get(record, 'quoteAmount')
    this.quoteAssetCode = _get(record, 'quoteAsset.id')
  }
}
