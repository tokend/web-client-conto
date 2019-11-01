import _get from 'lodash/get'

export class BuyRequestRecord {
  constructor (record) {
    this.id = record.id
    this.createdAt = _get(record, 'createdAt')
    this.amount = _get(record, 'amount')
    this.discount = _get(record, 'discount')
    this.priceAsset = _get(record, 'priceAsset')
    this.senderAccountId = _get(record, 'senderAccountId') || ''
    this.status = _get(record, 'status')
    this.totalPrice = _get(record, 'totalPrice')
    this.senderEmail = _get(record, 'senderEmail') || ''
  }
}
