export class BookingRecord {
  constructor (record) {
    this._record = record
    this.id = record.id

    this.amount = record.amount
    this.assetCode = record.asset.id
    this.startTime = record.startTime
    this.endTime = record.endTime
    this.participants = record.participants
    this.payload = record.payload

    this.event = record.event
    this.owner = record.owner.id
    this.cancelTill = record.cancelTill
    this.lockTime = record.lockTime
    this.state = record.state
  }
}
