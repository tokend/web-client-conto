export class BookingRoomRecord {
  constructor (record) {
    this.id = record.id || 'room_' + +new Date()
    this.capacity = record.capacity
    this.price = {
      amount: record.price.amount,
      asset: record.price.asset,
    }
    this.workDays = record.workDays
    this.name = record.name || ' - '
    this.logoUrl = record.logoUrl
  }
}
