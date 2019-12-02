import _get from 'lodash/get'

export class BuybackOfferRecord {
  constructor (record) {
    this._record = record
    this.id = _get(record, 'id')
    this.baseAmount = _get(record, 'baseAmount')
    this.baseAssetCode = _get(record, 'baseAsset.id')
    this.isBuy = _get(record, 'isBuy')
    this.orderBookId = _get(record, 'orderBookId')
    this.owner = _get(record, 'owner.id')
    this.price = _get(record, 'price')
    this.quoteAmount = _get(record, 'quoteAmount')
    this.quoteAssetCode = _get(record, 'quoteAsset.id')
  }
}
