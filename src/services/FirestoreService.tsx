import { Timestamp, and, collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore"
import { app } from "../Firebase"
import { FirebaseError } from "firebase/app"
import { BookingDB, BookingObjComplete, unitDB } from "../types"
import { checkForCompleteBooking, checkTimeslotIsAvailable } from "../utilities"

const db = getFirestore(app)

export const createBooking = async (booking: BookingObjComplete) => {
  try {
    if (!navigator.onLine) throw new Error('No connection. Check your network.')
    const completeBooking = checkForCompleteBooking(booking)
    if (completeBooking === false) throw new Error('Booking creation failed. Please try again')

    const result = await checkTimeslotIsAvailable(completeBooking)
    if (!result) throw new Error('Booking no longer available, please try again.')

    const docRef = doc(collection(db, "bookings"))

    await setDoc(docRef, {
      id: docRef.id,
      unit: completeBooking.unit,
      registration: completeBooking.registration,
      startTime: completeBooking.startTime,
      endTime: completeBooking.endTime,
      bookingTimestamp: Timestamp.fromDate(new Date()),
      bookingDay: completeBooking.bookingDay,
      bookingTimeslot: completeBooking.bookingTimeslot,
      parkingNumber: completeBooking.parkingNumber
    })

    return true

  } catch (e) {
    const error = e as FirebaseError
    throw new Error(error.message)
  }
}

export const getScheduledBookingsDB = async (bookingDays: string[]): Promise<BookingDB[] | false> => {
  try {
    let scheduledBookings: BookingDB[] = []
    const q = query(collection(db, "bookings"), where("bookingDay", "in", bookingDays))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      scheduledBookings.push(doc.data() as BookingDB)
    })

    return scheduledBookings

  } catch (e) {
    const error = e as FirebaseError
    console.error("Error adding document: ", error)
    return false
  }
}

export const getUnitBookings = async (unitCode: string, bookingDays: string[]): Promise<BookingDB[] | false> => {
  try {
    let bookings: BookingDB[] = []
    const q = query(collection(db, "bookings"), and(
      where("unit", "==", unitCode),
      where("bookingDay", "in", bookingDays)
    ))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      bookings.push(doc.data() as BookingDB)
    })

    return bookings

  } catch (e) {
    const error = e as FirebaseError
    console.error("Error getting documents: ", error)
    return false
  }
}

export const getBookingsFromDate = async (bookingDay: string): Promise<BookingDB[] | false> => {
  try {
    let bookings: BookingDB[] = []
    const q = query(collection(db, "bookings"), where("bookingDay", "==", bookingDay))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      bookings.push(doc.data() as BookingDB)
    })

    return bookings

  } catch (e) {
    const error = e as FirebaseError
    console.error("Error getting documents: ", error)
    return false
  }
}

export const updateUserBooking = async (bookingId: string, bookingObjComplete: BookingObjComplete) => {
  try {

    if (!navigator.onLine) throw new Error('No connection. Check your network.')

    await updateDoc(doc(db, 'bookings', bookingId), {
      parkingNumber: bookingObjComplete.parkingNumber,
      registration: bookingObjComplete.registration,
      startTime: bookingObjComplete.startTime,
      endTime: bookingObjComplete.endTime,
      bookingDay: bookingObjComplete.bookingDay,
      bookingTimeslot: bookingObjComplete.bookingTimeslot,
      bookingTimestamp: Timestamp.fromDate(new Date())
    })

    return true

  } catch (e) {
    const error = e as FirebaseError
    throw new Error(error.message)
  }
}

export const getBooking = async (bookingId: string): Promise<BookingDB | false> => {
  try {
    let bookings: BookingDB[] = []

    const q = query(collection(db, "bookings"), where('id', '==', bookingId))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      bookings.push(doc.data() as BookingDB)
    })

    return bookings[0]

  } catch (e) {
    const error = e as FirebaseError
    console.error("Error getting document: ", error)
    return false
  }
}

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'bookings', bookingId))
    return true
  } catch (e) {
    const error = e as FirebaseError
    console.log(error)
    return false
  }
}

export const getUnit = async (unit: string) => {
  try {
    let unitDetails: unitDB[] = []

    const q = query(collection(db, "units"), where('unit', '==', unit))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      unitDetails.push(doc.data() as unitDB)
    })

    return unitDetails[0]

  } catch (e) {
    const error = e as FirebaseError
    console.log(error, 'getUnit')
    return false
  }
}

export const updateUnitVehicles = async (unitId: string, updatedVehicles: string[]): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'units', unitId), {
      vehicles: updatedVehicles
    })

    return true

  } catch (e) {
    const error = e as FirebaseError
    console.log(error)
    return false
  }
}