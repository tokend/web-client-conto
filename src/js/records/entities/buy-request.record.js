import _get from 'lodash/get'
import { BUY_REQUEST_STATUSES } from '@/js/const/buy-request-statuses.const'
import { store, vuexTypes } from '@/vuex/index'

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
    this.promoCode = _get(record, 'promocode') || ''
    // eslint-disable-next-line max-len
    this.boughtAssetName = store.getters[vuexTypes.assetByCode](record.boughtAsset)
      .name
  }

  get isRejected () {
    return this.status === BUY_REQUEST_STATUSES.rejected.value
  }

  get isPaid () {
    return this.status === BUY_REQUEST_STATUSES.paid.value
  }

  get isTimeout () {
    return this.status === BUY_REQUEST_STATUSES.timeout.value
  }

  get isPending () {
    return this.status === BUY_REQUEST_STATUSES.pending.value
  }
}
