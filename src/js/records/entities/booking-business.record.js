export class BookingBusinessRecord {
  constructor (record) {
    this._record = record
    this.id = record.id
    this.owner = record.owner.id
    this.confirmationTypes = record.bookingDetails.confirmationTypes
    this.calendarId = record.calendar.id

    this.details = record.details
    this.paymentMethod = record.details.paymentMethod
    this.workDays = record.workDays
    this.maxDuration = record.bookingDetails.maxDuration
    this.minDuration = record.bookingDetails.minDuration
    this.rooms = Object.keys(record.bookingDetails.specificDetails)
      .map(item => ({
        id: item,
        ...record.bookingDetails.specificDetails[item],
        ...this.details.roomsMeta[item],
      }))
    this.payloads = this.getRoomsId(this.rooms)
  }

  getRoomsId (rooms) {
    return rooms.map(rooms => rooms.id)
  }

  getRoomById (id) {
    const room = this.rooms.find(room => {
      return room.id === id
    })
    return room
  }
}
