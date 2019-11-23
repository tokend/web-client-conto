export class BookingBusinessRecord {
  constructor (record) {
    this._record = record
    this.id = record.id
    this.owner = record.owner.id
    this.confirmationTypes = record.bookingDetails.confirmationTypes
    this.calendarId = record.calendar.id

    this.details = record.details
    this.maxDuration = record.bookingDetails.maxDuration
    this.maxDuration = record.bookingDetails.minDuration
    this.capacity = record.bookingDetails.specificDetails.capacity
    this.payloads = record.bookingDetails.specificDetails.payloads
    this.prices = record.bookingDetails.specificDetails.prices
  }
}
