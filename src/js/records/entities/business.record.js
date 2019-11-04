import _get from 'lodash/get'
import { documentsManager } from '@/api'

export class BusinessRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.name = _get(record, 'name')
    this.accountId = _get(record, 'accountId')
    this.industry = _get(record, 'industry')
    this.description = _get(record, 'description')
    this.statsQuoteAsset = _get(record, 'statsQuoteAsset')

    this.logo = {}
    this.logoKey = undefined
    this.logoName = undefined
    this.logoType = undefined
    this._getLogo()

    this.banner = {}
    this.bannerKey = undefined
    this.bannerName = undefined
    this.bannerType = undefined
    this._getBanner()
  }

  _getLogo () {
    try {
      this.logo = JSON.parse(_get(this._record, 'logo'))
      this.logoKey = _get(this.logo, 'key')
      this.logoName = _get(this.logo, 'name')
      this.logoType = _get(this.logo, 'type')
    } catch (e) {
    }
  }

  _getBanner () {
    try {
      this.banner = _get(this._record, 'banner') ||
        JSON.parse(_get(this._record, 'bravo'))
      this.bannerKey = _get(this.banner, 'key')
      this.bannerName = _get(this.banner, 'name')
      this.bannerType = _get(this.banner, 'type')
    } catch (error) {
    }
  }

  get logoUrl () {
    if (this.logoKey) {
      return documentsManager.getDocumentUrlByKey(this.logoKey)
    } else {
      return ''
    }
  }
}
