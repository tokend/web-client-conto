import _get from 'lodash/get'

export class SoldAssetRecord {
  constructor (record) {
    this.id = record.id
    this.totalProceeds = _get(record, 'totalProceeds')
    this.totalSold = _get(record, 'totalSold')
    this.proceedAssetCode = _get(record, 'proceedAsset')
    this.assetCode = _get(record, 'asset')
  }
}
