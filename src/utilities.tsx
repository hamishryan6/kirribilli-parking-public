import { BookingDB, BookingObj, BookingObjComplete, authDetails, bookingDate, bookingDay, bookingSpot, bookingTime, bookingTimeslot, newBooking, rulesStatus, snackbar, timeslot, timeslotString, timetableBooking, timetableSpot } from "./types"
import { getScheduledBookingsDB } from "./services/FirestoreService"
import { NavigateFunction } from "react-router-dom"
import { Timestamp } from "firebase/firestore"

export const asyncTimeout = (milliseconds: number): Promise<null> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(null), milliseconds)
  })
}

export const checkForConnection = (setSnackbar: (state: snackbar) => void) => {
  if (navigator.onLine) return true

  setSnackbar({
    url: 'all',
    state: 'alert',
    message: 'No connection. Check your network.'
  })

  return false
}

const mondayWeekIndex = (index: number) => {
  switch (index) {
    case 0: return 6
    case 1: return 0
    case 2: return 1
    case 3: return 2
    case 4: return 3
    case 5: return 4
    case 6: return 5
    default: return 0
  }
}

export const getThisWeeksMonday = (date: Date) => {
  const monday = new Date(date)
  monday.setDate(monday.getDate() - mondayWeekIndex(monday.getDay()))
  monday.setHours(0, 0, 0, 0)

  return monday
}

export const getDayOfWeekIndex = (date: Date) => {
  const dayOfWeek = new Date(date).getDay()

  return mondayWeekIndex(dayOfWeek)
}

export const getWeekNumberFromDates = (startDate: Date, selectedDate: Date) => {
  let start = new Date(startDate)
  let date = new Date(selectedDate)
  const differenceInMs: number = date.getTime() - start.getTime()
  return Math.floor((Math.floor(differenceInMs / (1000 * 3600 * 24))) / 7)
}

export const unitCodes = [
  'G1', 'G2', 'G3',
  '104', '103', '102', '101',
  '204', '203', '202', '201',
  '304', '303', '302', '301',
  '404', '403', '402', '401',
  '504', '503', '502', '501',
  '604', '603', '602', '601',
  '704', '703', '702', '701',
  '803', '802', '801',
  '903', '902', '901',
  'PH'
]

export const units = [
  {
    level: 'Ground Level',
    unitCodes: ['G1', 'G2', 'G3']
  },
  {
    level: 'Level 1',
    unitCodes: ['101', '102', '103', '104']
  },
  {
    level: 'Level 2',
    unitCodes: ['201', '202', '203', '204']
  },
  {
    level: 'Level 3',
    unitCodes: ['301', '302', '303', '304']
  },
  {
    level: 'Level 4',
    unitCodes: ['401', '402', '403', '404']
  },
  {
    level: 'Level 5',
    unitCodes: ['501', '502', '503', '504']
  },
  {
    level: 'Level 6',
    unitCodes: ['601', '602', '603', '604']
  },
  {
    level: 'Level 7',
    unitCodes: ['701', '702', '703', '704']
  },
  {
    level: 'Level 8',
    unitCodes: ['801', '802', '803']
  },
  {
    level: 'Level 9',
    unitCodes: ['901', '902', '903']
  },
  {
    level: 'Level 10',
    unitCodes: ['PH']
  }
]

export const validateLogin = (unitCode: string, navigate: NavigateFunction, setError: (state: boolean) => void) => {
  if (unitCodes.indexOf(unitCode) === -1) return setError(true)

  const authDetails: authDetails = {
    unit: unitCode
  }

  localStorage.setItem('auth', JSON.stringify(authDetails))
  navigate('/')
}

export const checkForAuth = (navigate: NavigateFunction, setUnit: (unit: string) => void) => {
  const authStorage = localStorage.getItem('auth')
  if (authStorage === null) return navigate('/login')
  const authDetails = JSON.parse(authStorage) as authDetails
  if (unitCodes.indexOf(authDetails.unit) === -1) navigate('/login')
  setUnit(authDetails.unit)
}

export const checkForCompleteBooking = (booking: BookingObj) => {
  if (booking.unit === '') return false
  if (booking.registration === '') return false
  if (booking.parkingNumber === 0) return false
  if (booking.bookingDay === '') return false
  if (booking.bookingTimeslot === undefined) return false
  if (booking.startTime === undefined) return false
  if (booking.endTime === undefined) return false

  return booking as BookingObjComplete
}

export const getBookingDays = (startDay: Date) => {
  let bookingWeeks: bookingDay[][] = []
  let bookingWeek: bookingDay[] = []

  const start = new Date(startDay)
  const end = new Date(startDay).setDate(start.getDate() + 13)

  const daysRequired = (new Date(start).toDateString() === getThisWeeksMonday(start).toDateString() ? 14 : 21)


  new Array(daysRequired).fill(0).forEach((element, index) => {

    let date = new Date(start)
    date.setDate(getThisWeeksMonday(start).getDate() + index)
    let day: bookingDay = {
      date,
      active: new Date(date) >= new Date(start) && new Date(end) >= new Date(date)
    }

    if (bookingWeek.length === 6) {
      bookingWeek.push(day)
      bookingWeeks.push(bookingWeek)
      bookingWeek = []
    } else {
      bookingWeek.push(day)
    }
  })

  return bookingWeeks
}

export const getIndexOfDate = (date: Date, bookingDayArray: bookingDay[]) => {
  let dateIndex = 0

  bookingDayArray.forEach((day, index) => {
    if (day.date.toLocaleDateString() !== date.toLocaleDateString()) return
    dateIndex = index
  })
  return dateIndex
}

export const setThemeColour = (colour: string) => {
  const themeColourTag = document.getElementById('theme-color') as HTMLMetaElement
  themeColourTag.content = colour
}

export const dateToLongString = (date: Date | undefined) => {
  if (!date) return ''
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
}

export const convertDateToSimpleString = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}

export const timeslotToString = (timeslot: timeslot) => {
  return `${timeslot.startTime} - ${timeslot.endTime}` as timeslotString
}

export const stringToTimeslot = (timeslot: timeslotString) => {

  const timeslotSplit = timeslot.split(' ')

  const startTime = timeslotSplit[0] as '8am' | '12pm' | '4pm' | '8pm'
  const endTime = timeslotSplit[2] as '8am' | '12pm' | '4pm' | '8pm'

  return {
    startTime: startTime,
    endTime: endTime
  } as timeslot
}

export const stringToDate = (time: string, date: Date) => {
  const isPM: boolean = (time.slice(-2) === 'pm')
  const hours = parseInt(time.slice(0, -2))

  let formattedHours = hours + (isPM && hours !== 12 ? 12 : 0)

  const updatedDate = new Date(date)
  updatedDate.setHours(formattedHours, 0, 0)

  return updatedDate
}

export const generateDayStrings = (startDay: Date, endDay?: Date) => {
  const start = new Date(startDay)
  let days = 14

  if (endDay !== undefined) {
    let end = new Date(endDay)
    const differenceInMs: number = end.getTime() - start.getTime()
    days = Math.ceil(differenceInMs / (1000 * 3600 * 24))
  }

  let dayStrings: string[] = []

  new Array(days).fill(0).forEach((element, index) => {
    let date = new Date(startDay)
    date.setDate(start.getDate() + index)

    dayStrings.push(dateToLongString(date))
  })

  return dayStrings
}

export const checkTimeslotIsAvailable = async (newBooking: BookingObjComplete) => {
  try {
    const bookings = await getScheduledBookingsDB(generateDayStrings(new Date()))
    if (!bookings) return
    for (const booking of bookings) {
      if (booking.bookingDay === newBooking.bookingDay && booking.bookingTimeslot === newBooking.bookingTimeslot && booking.parkingNumber === newBooking.parkingNumber) {
        throw new Error()
      }
    }
    return true
  } catch (error) {
    return false
  }
}

const checkForBookingCombo = (shortTerms: BookingDB[], overnights: BookingDB[]) => {
  let combos = 0

  shortTerms.forEach(shortTerm => {
    const shortTermDay: Date = shortTerm.startTime.toDate()
    overnights.forEach(overnight => {
      const overnightDay: Date = overnight.startTime.toDate()
      if (dateToLongString(getThisWeeksMonday(shortTermDay)) === dateToLongString(getThisWeeksMonday(overnightDay))) {
        combos += 1
      }
    })
  })

  return combos
}

export const getRulesStatus = (userBookings: BookingDB[], day: Date, setRulesStatus?: (status: rulesStatus) => void, avoidBooking?: BookingDB) => {
  const weekMonday = getThisWeeksMonday(day)
  const shortTerms: BookingDB[] = []
  const overnights: BookingDB[] = []
  const bookingsToday: BookingDB[] = []

  let updatedUserBookings = [...userBookings]

  if (avoidBooking?.id) updatedUserBookings = userBookings.filter(booking => booking.id !== avoidBooking.id)

  updatedUserBookings.forEach(booking => {
    const bookingDay: Date = booking.startTime.toDate()

    if (dateToLongString(weekMonday) !== dateToLongString(getThisWeeksMonday(bookingDay))) return
    if (dateToLongString(day) === dateToLongString(bookingDay)) bookingsToday.push(booking)
    if (booking.bookingTimeslot === '8pm - 8am') {
      overnights.push(booking)
    } else {
      shortTerms.push(booking)
    }
  })

  const rulesStatus: rulesStatus = {
    shortTermsThisWeek: shortTerms.length,
    overnightsThisWeek: overnights.length,
    bookingOnThisDay: bookingsToday.length,
    combosThisWeek: checkForBookingCombo(shortTerms, overnights)
  }

  if (setRulesStatus) return setRulesStatus(rulesStatus)
  return rulesStatus
}

const isDayAllowed = (date: Date, userBookings: BookingDB[], avoidBooking?: BookingDB) => {
  const rulesStatus = getRulesStatus(userBookings, date, undefined, avoidBooking) as rulesStatus

  let daytimeAllowed = true
  let overnightAllowed = true
  let message: string | null = null

  if (rulesStatus.bookingOnThisDay >= 1) {
    daytimeAllowed = false
    overnightAllowed = false
    message = "You have hit the maximum of 1 booking per day"
  } else if (rulesStatus.overnightsThisWeek >= 1) {
    overnightAllowed = false
    message = "You have hit the maximum of 1 overnight booking per week"
  } else if (rulesStatus.shortTermsThisWeek >= 3) {
    daytimeAllowed = false
    overnightAllowed = false
    message = "You have hit the maximum of 3 bookings per week"
  } else if (rulesStatus.shortTermsThisWeek >= 2) {
    overnightAllowed = false
  }

  if (rulesStatus.combosThisWeek >= 1) {
    daytimeAllowed = false
    overnightAllowed = false
    message = "You have hit the maximum combination of 1 daytime and 1 overnight booking per week"
  }

  return { daytimeAllowed: daytimeAllowed, overnightAllowed: overnightAllowed, message: message }
}

export const generateBookingAvailability = async (selectedDate: Date, bookingSpotCount: number, timeslots: timeslot[], scheduledBookings: BookingDB[], userBookings: BookingDB[], setBookingAvailability: (bookingDates: bookingDate) => void, avoidBooking?: BookingDB) => {
  let bookingSpots: bookingSpot[] = []

  // Run through booking spots
  new Array(bookingSpotCount).fill(0).forEach((zero, index) => {
    let bookingTimeslots: bookingTimeslot[] = []

    // Run through each timeslot
    timeslots.forEach(time => {
      let booked = false

      scheduledBookings.forEach(booking => {
        if (dateToLongString(selectedDate) !== dateToLongString(booking.startTime.toDate())) return
        if (booking.bookingDay === dateToLongString(selectedDate) &&
          timeslotToString(time) === booking.bookingTimeslot &&
          (index + 1) === booking.parkingNumber) booked = true

        if (avoidBooking?.id) {
          if (timeslotToString(time) === avoidBooking.bookingTimeslot &&
            dateToLongString(selectedDate) === avoidBooking.bookingDay &&
            (index + 1) === avoidBooking.parkingNumber) {
            booked = false
          }
        }
      })

      bookingTimeslots.push({
        timeslot: timeslotToString(time),
        startTime: time.startTime,
        endTime: time.endTime,
        booked: booked
      })
    })

    bookingSpots.push({
      [index + 1]: bookingTimeslots
    })

  })

  const allowance = isDayAllowed(selectedDate, userBookings, avoidBooking)

  setBookingAvailability({
    date: selectedDate,
    dateString: dateToLongString(selectedDate),
    bookings: bookingSpots,
    allowance: {
      daytimeAllowed: allowance.daytimeAllowed,
      overnightAllowed: allowance.overnightAllowed,
      message: allowance.message,
    }
  })
}

export const selectFirstDayOnWeekChange = (weekView: number, weeks: bookingDay[][], setSelectedDay: (day: bookingDay) => void) => {
  if (weekView === undefined || !weeks || weeks[weekView] === undefined) return
  if (weekView === 0) return setSelectedDay(weeks[weekView][getIndexOfDate(new Date(), weeks[weekView])])
  setSelectedDay(weeks[weekView][0])
}

export const formatStorageBookingTime = (bookingTime: bookingTime) => {
  let formattedBookingTime: bookingTime = {
    parkingNumber: bookingTime.parkingNumber,
    timeslot: bookingTime.timeslot,
    startingDate: new Date(bookingTime.startingDate)
  }

  return formattedBookingTime
}

export const timeslotStringToDates = (timeslot: timeslot, startingDate: Date) => {

  let dates = {
    start: new Date(startingDate),
    end: new Date(startingDate)
  }

  const overnight = (timeslot.startTime.slice(-2) === 'pm' && timeslot.endTime.slice(-2) === 'am')

  new Array(2).fill(0).forEach((zero, index) => {

    const time = index === 0 ? timeslot.startTime : timeslot.endTime

    const isPM = (time.slice(-2) === 'pm')
    const hours = parseInt(time.slice(0, -2))

    let formattedHours = hours + (isPM && hours !== 12 ? 12 : 0)

    const updatedDate = new Date(startingDate.getTime())
    updatedDate.setDate(updatedDate.getDate() + ((overnight && index === 1) ? 1 : 0))
    updatedDate.setHours(formattedHours, 0, 0)

    dates[index === 0 ? 'start' : 'end'] = updatedDate

  })
  return dates
}

export const newBookingToBookingObj = (newBooking: newBooking) => {
  const dates = timeslotStringToDates(newBooking.timeslot, newBooking.startingDate)
  return {
    unit: newBooking.unit,
    registration: newBooking.registration,
    startTime: Timestamp.fromDate(dates.start),
    endTime: Timestamp.fromDate(dates.end),
    bookingDay: dateToLongString(newBooking.startingDate),
    bookingTimeslot: timeslotToString(newBooking.timeslot),
    parkingNumber: newBooking.parkingNumber
  } as BookingObjComplete

}

export const checkIfTimeHasPassed = (endDate: Date) => {
  return endDate < new Date()
}

export const generateBookingTimetable = (bookings: BookingDB[], bookingSpotCount: number, timeslots: timeslot[]) => {
  let bookingSpots: timetableSpot[] = []

  // Run through booking spots
  new Array(bookingSpotCount).fill(0).forEach((zero, index) => {
    let bookingTimeslots: timetableBooking[] = []

    // Run through each timeslot
    timeslots.forEach(time => {
      let bookingDetails = undefined

      bookings.forEach(booking => {
        if (timeslotToString(time) === booking.bookingTimeslot &&
          (index + 1) === booking.parkingNumber) bookingDetails = {
            unit: booking.unit,
            registration: booking.registration,
            id: booking.id
          }
      })

      bookingTimeslots.push({
        timeslot: timeslotToString(time),
        bookingDetails: bookingDetails,
        bookingSpace: index + 1
      })
    })

    bookingSpots.push({
      [index + 1]: bookingTimeslots
    })

  })

  return bookingSpots
}