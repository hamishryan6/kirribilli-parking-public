import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import './Home.css'
import Header from '../../../sections/Header/Header'
import { Snackbar } from '../../../components/Snackbar/Snackbar'
import { useEffect, useState } from 'react'
import { useBookingContext } from '../../../Context'
import { getUnit, getUnitBookings } from '../../../services/FirestoreService'
import { DotLottiePlayer } from '@dotlottie/react-player'
import greySpinner from '../../../assets/animations/grey-spinner.json'
import BookingCard from '../../../components/BookingCard/BookingCard'
import { asyncTimeout, checkForAuth, checkForConnection, generateDayStrings } from '../../../utilities'
import { snackbar } from '../../../types'
import { EmptyState } from '../../../components/EmptyState/EmptyState'

export default function Home() {

  const navigate = useNavigate()

  const { setSnackbar, unit, setUnit, unitBookings, setUnitBookings, setUnitDetails, setBookingDetails, setSelectedDay, setNewBooking } = useBookingContext()

  const [isBookingsLoading, setIsBookingsLoading] = useState<boolean>(true)

  const onCreateClick = () => {
    if (checkForConnection((state: snackbar) => setSnackbar(state))) return navigate('/new-booking/select-time', { state: { quickChange: false } })
  }

  const handleSignout = async () => {
    setUnitBookings([])
    setUnitDetails(undefined)
    localStorage.removeItem('auth')
    navigate('/login')
  }

  const getBookings = async () => {
    try {
      if (!checkForConnection((state: snackbar) => setSnackbar(state))) return
      setIsBookingsLoading(true)
      const [bookings] = await Promise.all([
        getUnitBookings(unit, generateDayStrings(new Date())),
        asyncTimeout(240)
      ])
      if (bookings === false) throw Error
      setUnitBookings(bookings)
    } catch (error) {
      console.log(error)
    } finally {
      setIsBookingsLoading(false)
    }
  }

  const getUnitDetails = async () => {
    try {
      if (!checkForConnection((state: snackbar) => setSnackbar(state))) return
      const result = await getUnit(unit)
      if (!result) throw Error('Error getting unit details')
      console.log(result)
      setUnitDetails(result)
    } catch (error) {
      console.log(error)
    }
  }

  const renderBookings = () => {
    if (isBookingsLoading) {
      return (
        <div className='bookings__loading'>
          <DotLottiePlayer
            src={greySpinner}
            autoplay
            loop
            style={{ width: '32px' }}
          />
        </div>
      )
    } else if (unitBookings.length === 0) {
      return (
        <EmptyState
        icon='parking'
          header='No bookings'
          message='You do not have any upcoming bookings for this unit number.'
        />
      )
    } else {
      return unitBookings
        .sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis())
        .map((booking, index) => (
          <BookingCard
            key={index}
            onClick={() => navigate(`/booking/${booking.id}`)}
            date={booking.bookingDay}
            timeslot={booking.bookingTimeslot}
            parkNumber={booking.parkingNumber}
            registration={booking.registration}
          />
        ))
    }
  }

  useEffect(() => {
    if (!unit) return
    getBookings()
    getUnitDetails()
  }, [unit])

  useEffect(() => {
    checkForAuth(navigate, (unit: string) => setUnit(unit))
    setNewBooking(undefined)
    setBookingDetails(undefined)
    setSelectedDay(undefined)
  }, [])

  return (
    <div className='page__main home__main'>
      <Header
        leftIcon='signout'
        onLeftClick={() => handleSignout()}
      />

      <div className='content__container'>

        <div className='content'>
          <div className='title__block'>
            <h2>Unit {unit}</h2>
            <p>Upcoming bookings</p>
          </div>

          <div className='booking__list'>
            {renderBookings()}
          </div>
        </div>

        <Snackbar />

      </div>

      <footer className='button__footer'>
        <Button
          label='Create new booking'
          onClick={() => onCreateClick()}
          styling='primary'
          size='regular'
        />
      </footer>
    </div>
  )
}