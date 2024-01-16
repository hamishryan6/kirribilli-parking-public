import { useEffect, useState } from 'react'
import ChevronLeft from '../../../assets/icons/ChevronLeft'
import ChevronRight from '../../../assets/icons/ChevronRight'
import Header from '../../../sections/Header/Header'
import './Bookings.css'
import { BookingDB, bookingDay, timetableBooking, timetableSpot } from '../../../types'
import { asyncTimeout, convertDateToSimpleString, dateToLongString, generateBookingTimetable, getBookingDays, selectFirstDayOnWeekChange } from '../../../utilities'
import DateButton from '../../../components/Date/DateButton'
import { DotLottiePlayer } from '@dotlottie/react-player'
import greySpinner from '../../../assets/animations/grey-spinner.json'
import { getBookingsFromDate } from '../../../services/FirestoreService'
import { timeslots } from '../../../defaultValues'
import { TimetableSlot } from '../../../components/TimetableSlot/TimetableSlot'
import { Nav } from '../../../sections/Nav/Nav'

export const Bookings = () => {

  const [weeks, setWeeks] = useState<bookingDay[][]>([])
  const [weekView, setWeekView] = useState<number>(0)
  const [selectedDay, setSelectedDay] = useState<bookingDay>()
  const [timeslotsLoading, setTimeslotsLoading] = useState<boolean>(true)

  const [bookings, setBookings] = useState<BookingDB[]>([])
  const [bookingTimetable, setBookingTimetable] = useState<timetableSpot[]>([])

  const getBookings = async () => {
    if (!selectedDay) return
    let bookingDay = dateToLongString(selectedDay.date)
    try {
      setTimeslotsLoading(true)
      const [bookingsResult] = await Promise.all([
        getBookingsFromDate(bookingDay),
        asyncTimeout(240)
      ])
      if (bookingsResult === false) throw Error('Error getting bookings by date')

      setBookingTimetable(generateBookingTimetable(bookingsResult, 2, timeslots))
      setBookings(bookingsResult)

    } catch (error) {

    } finally {
      setTimeslotsLoading(false)
    }
  }

  const handleSignout = () => {

  }

  const previousWeekView = () => {
    if (weekView === 0) return
    selectFirstDayOnWeekChange(weekView - 1, weeks, (day: bookingDay) => setSelectedDay(day))
    setWeekView(weekView - 1)
  }

  const nextWeekView = () => {
    if (weekView === weeks.length - 1) return
    selectFirstDayOnWeekChange(weekView + 1, weeks, (day: bookingDay) => setSelectedDay(day))
    setWeekView(weekView + 1)
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

  const onDateClick = (day: bookingDay) => {
    if (!day.active) return
    setSelectedDay(day)
  }

  const renderBookings = (parkBookings: timetableBooking[]) => {
    if (!selectedDay) return
    return parkBookings.map((booking, index) => {
      if (!booking.bookingDetails) return (
        <TimetableSlot />
      )
      return <TimetableSlot
        unit={booking.bookingDetails.unit}
        registration={booking.bookingDetails.registration}
      />
    })
  }

  const renderParks = () => {
    return bookingTimetable.map((parkBookings, index) => {
      return <div className='timetable__parks'>
        <p>Park #{index + 46}</p>
        {renderBookings(parkBookings[index + 1])}
      </div>
    })
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

  useEffect(() => {
    getBookings()
  }, [selectedDay])

  useEffect(() => {
    setSelectedDay({
      date: new Date(),
      active: true
    })
    setWeekView(0)
  }, [weeks])

  useEffect(() => {
    console.log(timeslotsLoading)
  }, [timeslotsLoading])


  useEffect(() => {
    setWeeks(getBookingDays(new Date()))
  }, [])

  return (
    <div className='page__main booking__main'>

      <Header
        leftIcon='signout'
        onLeftClick={() => handleSignout()}
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

              <div className={`calendar__times bookings ${timeslotsLoading ? 'loading' : ''}`}>
                {timeslotsLoading ?
                  <DotLottiePlayer
                    src={greySpinner}
                    autoplay
                    loop
                    style={{ width: '32px' }}
                  />
                  : <>
                    <div className='calendar__timeslots'>
                      <p>8am</p>
                      <p>12pm</p>
                      <p>4pm</p>
                      <p>8pm</p>
                    </div>
                    {renderParks()}
                  </>
                }
              </div>

            </div>
          </div>
        </div>

      </div>

      <Nav
        items={[
          {
            label: 'Units',
            link: '/admin/'
          },
          {
            label: 'Bookings',
            link: '/admin/bookings'
          }
        ]}
        active='Bookings'
      />

    </div>
  )
}
