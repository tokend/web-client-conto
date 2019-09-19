import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex/index'

export class OfferRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.baseAmount = _get(record, 'baseAmount')
    this.baseAsset = store.getters[vuexTypes.assetByCode](record.baseAsset.id)
    this.baseBalanceId = _get(record, 'baseBalance.id')
    this.quoteAsset = store.getters[vuexTypes.assetByCode](record.quoteAsset.id)
    this.quoteAmount = _get(record, 'quoteAmount')
    this.quoteBalanceId = _get(record, 'quoteBalance.id')
    this.price = _get(record, 'price')
    this.orderBookId = _get(record, 'orderBookId')
    this.isBuy = _get(record, 'isBuy')
    this.createdAt = _get(record, 'createdAt')
  }
}
