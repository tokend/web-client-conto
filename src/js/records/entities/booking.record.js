import _isEmpty from 'lodash/isEmpty'
import { amountToPrecision } from '@/js/helpers/amount'

export class BookingRecord {
  constructor (record, business) {
    this._record = record
    this.id = record.id

    this.amount = amountToPrecision(record.amount)
    this.assetCode = record.asset.id
    this.startTime = record.startTime
    this.endTime = record.endTime
    this.participants = record.participants
    this.payload = record.payload
    this.room = this.getRoom(business)
    this.event = record.event
    this.owner = record.owner.id
    this.cancelTill = record.cancelTill
    this.lockTime = record.lockTime
    this.state = record.state
    this.reference = record.reference
  }

  getRoom (business) {
    return _isEmpty(business)
      ? { name: this.payload }
      : business.getRoomById(this.payload)
  }
}
