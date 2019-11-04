import _get from 'lodash/get'
import { store, vuexTypes } from '@/vuex/index'

export class SoldAssetRecord {
  constructor (record) {
    this.id = record.id
    this.totalProceeds = _get(record, 'totalProceeds')
    this.totalSold = _get(record, 'totalSold')
    this.proceedAssetCode = _get(record, 'proceedAsset')
    this.assetName = store.getters[vuexTypes.assetByCode](record.asset)
      .name
  }
}
