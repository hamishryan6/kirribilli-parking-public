import { useEffect, useState } from 'react'
import Button from '../../../components/Button/Button'
import { Snackbar } from '../../../components/Snackbar/Snackbar'
import Header from '../../../sections/Header/Header'
import { ParkingRulesModal } from '../../../modals/ParkingRulesModal/ParkingRulesModal'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useBookingContext } from '../../../Context'
import DateButton from '../../../components/Date/DateButton'
import { checkIfTimeHasPassed, checkTimeslotIsAvailable, convertDateToSimpleString, dateToLongString, generateBookingAvailability, generateDayStrings, getBookingDays, getRulesStatus, getThisWeeksMonday, getWeekNumberFromDates, newBookingToBookingObj, selectFirstDayOnWeekChange, stringToTimeslot, timeslotStringToDates, timeslotToString } from '../../../utilities'
import { BookingDB, authDetails, bookingDate, bookingDay, bookingTimeslot, rulesStatus } from '../../../types'
import Timeslot from '../../../components/Timeslot/Timeslot'
import { DotLottiePlayer } from '@dotlottie/react-player'
import greySpinner from '../../../assets/animations/grey-spinner.json'
import { Alert } from '../../../assets/icons/Alert'
import ChevronLeft from '../../../assets/icons/ChevronLeft'
import ChevronRight from '../../../assets/icons/ChevronRight'
import { timeslots } from '../../../defaultValues'
import { getScheduledBookingsDB, getUnitBookings, updateUserBooking } from '../../../services/FirestoreService'
import { FirebaseError } from 'firebase/app'

export const SelectTime = () => {

  const { id } = useParams()
  const pathname = useLocation().pathname
  const isEditing = pathname.includes('new-booking') === false

  const navigate = useNavigate()
  const { state } = useLocation()

  const { unit, setUnit, bookingDetails, newBooking, setNewBooking, bookingAvailability, setBookingAvailability, weeks, setWeeks, weekView, setWeekView, selectedDay, setSelectedDay, unitBookings, setUnitBookings, setRulesStatus, setSnackbar } = useBookingContext()

  const [showParkingRulesModal, setShowParkingRulesModal] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const [timeslotsLoading, setTimeslotsLoading] = useState<boolean>(true)
  const [scheduledBookings, setScheduledBookings] = useState<BookingDB[]>([])

  const previousWeekView = () => {
    if (weekView === 0) return
    setNewBooking(undefined)
    selectFirstDayOnWeekChange(weekView - 1, weeks, (day: bookingDay) => setSelectedDay(day))
    setWeekView(weekView - 1)
  }

  const nextWeekView = () => {
    if (weekView === weeks.length - 1) return
    selectFirstDayOnWeekChange(weekView + 1, weeks, (day: bookingDay) => setSelectedDay(day))
    setWeekView(weekView + 1)
  }

  const onDateClick = (day: bookingDay) => {
    setNewBooking(undefined)
    if (!day.active) return
    setSelectedDay(day)
  }

  const renderDays = () => {
    if (weeks.length === 0) return
    return weeks[weekView].map((day, index) => (
      <DateButton
        selected={dateToLongString(selectedDay?.date) === dateToLongString(day.date)}
        inactive={day.active === false}
        key={index}
        date={day.date}
        onClick={() => onDateClick(day)}
      />
    ))
  }

  const renderTimes = (timeslots: bookingTimeslot[], parkNumber: number, bookingDate: bookingDate) => {
    if (!selectedDay) return
    let filteredTimes: bookingTimeslot[]

    if (bookingDate.allowance.daytimeAllowed === false) {
      filteredTimes = timeslots.filter(time => time.startTime === '8pm')
    } else if (bookingDate.allowance.overnightAllowed === false) {
      filteredTimes = timeslots.filter(time => time.startTime !== '8pm')
    } else {
      filteredTimes = timeslots
    }

    function inputRegistration() {
      if (bookingDetails) return bookingDetails.registration
      if (newBooking?.registration) return newBooking.registration
      return undefined
    }

    return filteredTimes
    .filter(time => !checkIfTimeHasPassed(timeslotStringToDates(time, selectedDay.date).end))
    .map((time, index) => {
      return <Timeslot
        key={index}
        unavailable={time.booked}
        parkNumber={parkNumber}
        timeslotString={timeslotToString(time)}
        newBooking={newBooking}
        selectedDay={selectedDay}
        onClick={() => setNewBooking({
          unit: unit,
          registration: inputRegistration(),
          startingDate: selectedDay.date,
          timeslot: time,
          parkingNumber: parkNumber
        })}
      />
    })
  }

  const renderParks = () => {
    if (timeslotsLoading) return (
      <DotLottiePlayer
        src={greySpinner}
        autoplay
        loop
        style={{ width: '32px' }}
      />
    )
    if (!bookingAvailability) return
    if (bookingAvailability.allowance.daytimeAllowed === false && bookingAvailability.allowance.overnightAllowed === false) {
      return <div className='times__alert'>
        <Alert className='icon__alert' />
        <p>{bookingAvailability.allowance.message}</p>
      </div>
    }

    return bookingAvailability.bookings.map((booking, index) => (
      <div className='park__container' key={index}>
        <p>Park #{index + 46}</p>
        <ul className='park__times'>
          {renderTimes(booking[index + 1], index + 1, bookingAvailability)}
        </ul>
      </div>
    ))
  }

  const getBookings = async () => {
    const weekMonday = getThisWeeksMonday(new Date())
    const start = new Date()
    const endDay = new Date(start)
    endDay.setDate(start.getDate() + 13)

    const bookingDays = generateDayStrings(weekMonday, endDay)

    try {
      const [scheduledBookingsResult, unitBookingsResult] = await Promise.all([
        getScheduledBookingsDB(bookingDays),
        getUnitBookings(unit, bookingDays),
      ])
      if (scheduledBookingsResult === false || unitBookingsResult === false) throw Error
      setScheduledBookings(scheduledBookingsResult)
      setUnitBookings(unitBookingsResult)
    } catch (e) {
      const error = e as FirebaseError
      console.log(error.message)
    } finally {
      setTimeslotsLoading(false)
    }
  }

  const updateBooking = async () => {
    try {
      setUpdateLoading(true)
      if (!id || !newBooking) return
      const timeslotAvailable = await checkTimeslotIsAvailable(newBookingToBookingObj(newBooking))
      if (!timeslotAvailable) throw new Error('Booking no longer available, please try again.')
      const result = await updateUserBooking(id, newBookingToBookingObj(newBooking))
      if (!result) throw Error('Error updating booking')
      setSnackbar({
        url: `/booking/${id}`,
        message: 'Booking successfully updated',
        state: 'success'
      })
      navigate(`/booking/${id}`)
    } catch (error) {
      console.log(error)
    } finally {
      setUpdateLoading(false)
    }
  }

  const renderWeekSelection = () => {
    if (weeks.length === 0 || weekView === undefined) return
    return (
      <div className='week__selection__text'>
        <p>{convertDateToSimpleString(weeks[weekView][0].date)}</p>
        <p>-</p>
        <p>{convertDateToSimpleString(weeks[weekView][6].date)}</p>
      </div>
    )
  }

  const renderRulesModal = () => {
    if (!showParkingRulesModal) return
    return <ParkingRulesModal
      closeModal={() => setShowParkingRulesModal(false)}
      fixedHeight
    />
  }

  const renderButtonState = () => {
    if (!newBooking) return true
    return false
  }

  const onNextClick = () => {
    if (!newBooking) return
    if (isEditing) return updateBooking()
    if (state.quickChange) return navigate('/new-booking/confirm')
    navigate('/new-booking/select-vehicle')
    
  }

  const onBackClick = () => {
    if (isEditing) return navigate(`/booking/${id}`)
    navigate('/')
  }

  const setBookingDaySelection = (date: Date) => {
    const weekNumber = getWeekNumberFromDates(getThisWeeksMonday(new Date()), date)
    setWeekView(weekNumber)
    setSelectedDay({
      date,
      active: true
    })
  }

  // Get get existing booking data and generate active booking days to be displayed
  useEffect(() => {
    if (!unit) return
    getBookings()
  }, [unit])

  useEffect(() => {
    setWeeks(getBookingDays(new Date()))
  }, [])

  //  Select focus date when opening the time selection screen
  useEffect(() => {
    if (weeks.length === 0) return
    if (isEditing && bookingDetails) {
      setNewBooking({
        unit: unit,
        registration: bookingDetails.registration,
        parkingNumber: bookingDetails.parkingNumber,
        timeslot: stringToTimeslot(bookingDetails.bookingTimeslot),
        startingDate: bookingDetails.startTime.toDate()
      })
      setBookingDaySelection(bookingDetails.startTime.toDate())
    } else if (newBooking) {
      setBookingDaySelection(newBooking.startingDate)
    } else {
      setBookingDaySelection(new Date())
    }
  }, [weeks])

  // get timeslots on day change
  useEffect(() => {
    if (!selectedDay || !unitBookings || !scheduledBookings) return
    generateBookingAvailability(
      selectedDay.date,
      2,
      timeslots,
      scheduledBookings,
      unitBookings,
      (bookingDate: bookingDate) => setBookingAvailability(bookingDate),
      (isEditing ? bookingDetails : undefined)
    )

    getRulesStatus(unitBookings, selectedDay.date, (status: rulesStatus) => setRulesStatus(status))
  }, [selectedDay, unitBookings, scheduledBookings])

  useEffect(() => {
    if (!unit)
    if (isEditing && !bookingDetails) navigate(`/booking/${id}`)
    if (localStorage.getItem('auth') === null) navigate('/')
    const authDetails = JSON.parse(localStorage.getItem('auth') as string) as authDetails
    setUnit(authDetails.unit)
  }, [])

  return (
    <div className='page__main booking__main'>

      {renderRulesModal()}

      <Header
        title={isEditing ? 'Edit a booking' : 'Create a booking'}
        leftIcon='back'
        onLeftClick={() => onBackClick()}
      />

      <div className='content__container'>

        <div className='content'>

          <div className='title__block'>
            <h2>Select a time</h2>
            <p>Navigate up to two weeks in advance and select your time.</p>
          </div>

          <div className='calendar__container'>
            <div className='week__selection'>
              <button className='medium-button' onClick={() => previousWeekView()}>
                <ChevronLeft className={`icon__chevron ${weekView === 0 && 'disabled'}`} />
              </button>

              {renderWeekSelection()}

              <button className='medium-button' onClick={() => nextWeekView()}>
                <ChevronRight className={`icon__chevron ${weekView === (weeks.length - 1) && 'disabled'}`} />
              </button>
            </div>

            <div className='booking__calendar'>

              <div className='calender__weekdays'>
                {renderDays()}
              </div>

              <div className='calendar__divider' />

              <div className={`calendar__times ${timeslotsLoading ? 'loading' : ''}`}>
                {renderParks()}
              </div>

            </div>
          </div>
        </div>

        <Snackbar />

      </div>

      <footer className='button__footer'>
        <Button
          heighlightPosition='before'
          highlight='View the parking rules'
          label='before you book.'
          onClick={() => setShowParkingRulesModal(true)}
          styling='tertiary'
          size='small'
        />

        <Button
          label={id ? 'Update' : 'Next'}
          onClick={() => onNextClick()}
          styling='primary'
          size='regular'
          disabled={renderButtonState()}
          loading={updateLoading}
        />
      </footer>

    </div>
  )
}
