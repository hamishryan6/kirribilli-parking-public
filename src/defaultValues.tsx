import { BookingObj, bookingDay, rules, timeslot } from "./types"

export const defaultBookingDay: bookingDay = {
    date: new Date(),
    active: true
}

export const defaultBookingObj: BookingObj = {
    unit: '',
    registration: '',
    parkingNumber: 0,
    startTime: undefined,
    endTime: undefined,
    bookingDay: '',
    bookingTimeslot: undefined
}

export const bookingRules: rules = {
    overnightPerWeek: 1,
    shortTermPerWeek: 3,
    bookingsPerDay: 1,
    comboBookingPerWeek: 1,
    bookingTimeInDays: 14
}

export const timeslots: timeslot[] = [
    { startTime: '8am', endTime: '12pm' },
    { startTime: '12pm', endTime: '4pm' },
    { startTime: '4pm', endTime: '8pm' },
    { startTime: '8pm', endTime: '8am' }
  ]