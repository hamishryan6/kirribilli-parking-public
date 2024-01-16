import { Timestamp } from "firebase/firestore"

export type bookingStateContext = {
    unit: string,
    setUnit: (unit: string) => void

    unitBookings: BookingDB[]
    setUnitBookings: (bookings: BookingDB[]) => void

    rulesStatus: rulesStatus | undefined
    setRulesStatus: (status: rulesStatus) => void

    bookingAvailability: bookingDate | undefined
    setBookingAvailability: (bookingDates: bookingDate) => void

    snackbar: snackbar | undefined
    setSnackbar: (snackbar: snackbar | undefined) => void

    weeks: bookingDay[][]
    setWeeks: (weeks: bookingDay[][]) => void

    weekView: number
    setWeekView: (view: number) => void

    selectedDay: bookingDay | undefined
    setSelectedDay: (day: bookingDay | undefined) => void

    unitDetails: unitDB | undefined
    setUnitDetails: (unit: unitDB | undefined) => void

    newVehicle: newVehicle | undefined
    setNewVehicle: (vehicle: newVehicle | undefined) => void

    bookingDetails: BookingDB | undefined
    setBookingDetails: (booking: BookingDB | undefined) => void

    newBooking: newBooking | undefined
    setNewBooking: (booking: newBooking | undefined) => void
}

export type newVehicle = {
    registration: string
    saveToUnit: boolean
}

export type bookingDay = {
    date: Date
    active: boolean
}

export type bookingContext = {
    selectedBooking: bookingDay | undefined
}

export type timeslot = {
    startTime: '8am' | '12pm' | '4pm' | '8pm'
    endTime: '8am' | '12pm' | '4pm' | '8pm'
}

export type timeslotString = '8am - 12pm' | '12pm - 4pm' | '4pm - 8pm' | '8pm - 8am'

export type bookingTime = {
    parkingNumber: number
    timeslot: timeslot
    startingDate: Date
}

export type newBooking = {
    unit: string,
    registration: string | undefined,
    parkingNumber: number
    timeslot: timeslot
    startingDate: Date
}

export type BookingObj = {
    unit: string
    registration: string
    parkingNumber: number
    startTime: Timestamp | undefined
    endTime: Timestamp | undefined
    bookingDay: string,
    bookingTimeslot: timeslotString | undefined
}

export interface BookingObjComplete extends BookingObj {
    startTime: Timestamp
    endTime: Timestamp
    bookingTimeslot: timeslotString
}

export interface BookingDB extends BookingObjComplete {
    id: string,
    bookingTimestamp: Timestamp
}

export type rules = {
    overnightPerWeek: number
    shortTermPerWeek: number
    bookingsPerDay: number
    comboBookingPerWeek: number
    bookingTimeInDays: number
}

export type rulesStatus = {
    shortTermsThisWeek: number
    overnightsThisWeek: number
    bookingOnThisDay: number
    combosThisWeek: number
}

export type authDetails = {
    unit: string
}

export interface bookingTimeslot extends timeslot {
    timeslot: timeslotString
    booked: boolean
}

export type bookingSpot = {
    [key: number]: bookingTimeslot[]
}

export type bookingDate = {
    date: Date
    dateString: string
    bookings: bookingSpot[]
    allowance: {
        daytimeAllowed: boolean,
        overnightAllowed: boolean,
        message: string | null
    }
}

export type snackbar = {
    url: string
    message: string
    state: 'success' | 'error' | 'alert'
}

export type unitDB = {
    vehicles: string[]
    unit: string
    id: string
}

export type timetableBooking = {
    timeslot: timeslotString
    bookingSpace: number
    bookingDetails: undefined | {
        unit: string
        registration: string
        id: string
    }
}

export type timetableSpot = {
    [key: number]: timetableBooking[]
}