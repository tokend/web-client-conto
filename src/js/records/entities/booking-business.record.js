import { parseDurationTime } from '@/js/helpers/parseDurationTime'
import { BookingRoomRecord } from './booking-room.record'

export class BookingBusinessRecord {
  constructor (record) {
    this._record = record
    this.id = record.id
    this.owner = record.owner.id
    this.name = record.name
    this.confirmationTypes = record.bookingDetails.confirmationTypes
    this.calendarId = record.calendar.id

    this.details = record.details
    this.paymentMethod = record.details.paymentMethod
    this.workDays = record.workDays
    this.maxDuration = record.bookingDetails.maxDuration
    this.minDuration = record.bookingDetails.minDuration
    this.maxDurationInMinutes = parseDurationTime(
      record.bookingDetails.maxDuration
    )
    this.minDurationInMinutes = parseDurationTime(
      record.bookingDetails.minDuration
    )

    this.rooms = Object.keys(record.bookingDetails.specificDetails)
      .map(item => (new BookingRoomRecord({
        id: item,
        ...record.bookingDetails.specificDetails[item],
        ...this.details.roomsMeta[item],
      })))
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

  getDetails () {
    let details = {
      rooms_meta: {},
    }
    this.rooms.forEach(item => {
      details.rooms_meta[item.id] = {
        name: item.name,
        logo_url: item.logoUrl,
      }
    })
    return details
  }

  getSpecificDetails () {
    let details = {}
    this.rooms.forEach(item => {
      details[item.id] = {
        price: item.price,
        capacity: +item.capacity,
      }
    })
    return details
  }

  getBusinessForUpdate () {
    return {
      data: {
        work_days: this.workDays,
        owner: this.owner,
        calendar_id: +this.calendarId,
        name: this.name,
        details: this.getDetails(),
        booking: {
          specific_details: this.getSpecificDetails(),
          confirmation_types: this.confirmationTypes,
          min_duration: this.maxDuration,
          max_duration: this.minDuration,
        },
      },
    }
  }

  addRoom (room) {
    this.rooms = [
      ...this.rooms,
      new BookingRoomRecord(room),
    ]
  }

  removeRoom (roomId) {
    const roomIndex = this.rooms.findIndex(item => item.id === roomId)
    if (roomIndex > -1) {
      this.rooms.splice(roomIndex, 1)
    }
  }
}
