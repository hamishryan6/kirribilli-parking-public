import { useNavigate, useParams } from 'react-router-dom'
import './UserBooking.css'
import Header from '../../../sections/Header/Header'
import { cancelBooking, getBooking, getUnit } from '../../../services/FirestoreService'
import { useEffect, useState } from 'react'
import { snackbar } from '../../../types'
import { asyncTimeout, checkForAuth, checkForConnection, dateToLongString, getIndexOfDate, getThisWeeksMonday, getWeekNumberFromDates } from '../../../utilities'
import Button from '../../../components/Button/Button'
import { DeleteModal } from '../../../modals/DeleteModal/DeleteModal'
import { useBookingContext } from '../../../Context'
import { Snackbar } from '../../../components/Snackbar/Snackbar'
import { DotLottiePlayer } from '@dotlottie/react-player'
import greySpinner from '../../../assets/animations/grey-spinner.json'

export const UserBooking = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { unitDetails, setUnitDetails, setUnit, bookingDetails, setBookingDetails, weeks, weekView, setWeekView, setSnackbar, setSelectedDay } = useBookingContext()

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const [cancelLoading, setCancelLoading] = useState<boolean>(false)
  const [detailsLoading, setDetailsLoading] = useState<boolean>(true)

  const [currentView, setCurrentView] = useState<'Details' | 'Time' | 'Vehicle'>('Details')

  const getUnitDetails = async () => {
    if (!unitDetails) return
    try {
      if (!checkForConnection((state: snackbar) => setSnackbar(state))) return
      const result = await getUnit(unitDetails.unit)
      if (!result) throw Error('Error getting unit details')
      console.log(result)
      setUnitDetails(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getBookingDetails = async () => {
    if (!id) return
    try {
      if (!checkForConnection((state: snackbar) => setSnackbar(state))) return
      const [result] = await Promise.all([
        getBooking(id), asyncTimeout(240)
      ])
      if (!result) throw Error
      setBookingDetails(result)
    } catch (error) {
      console.log(error)
    } finally {
      setDetailsLoading(false)
    }
  }

  const cancelUserBooking = async () => {
    setCancelLoading(true)
    if (!id) return
    try {
      const [result] = await Promise.all([
        cancelBooking(id), asyncTimeout(400)
      ])
      if (!result) throw Error('Failed to cancel booking')
      setSnackbar({
        url: '/',
        state: 'success',
        message: 'Booking successfully cancelled'
      })
      navigate('/')
    } catch (error) {

    } finally {
      setCancelLoading(false)
    }
  }

  const renderModal = () => {
    if (!showDeleteModal) return
    return <DeleteModal
      closeModal={() => setShowDeleteModal(false)}
      onClick={() => cancelUserBooking()}
      loading={cancelLoading}
    />
  }

  const onBack = () => {
    switch (currentView) {
      case 'Details': return navigate('/')
      default: setCurrentView('Details')
    }
  }

  useEffect(() => {
    if (!bookingDetails) return
    setSelectedDay({
      date: bookingDetails.startTime.toDate(),
      active: true
    })
    setWeekView(getWeekNumberFromDates(getThisWeeksMonday(new Date()), bookingDetails.startTime.toDate()))
  }, [bookingDetails, currentView])

  useEffect(() => {
    if (!bookingDetails) return
    if (weekView === getWeekNumberFromDates(getThisWeeksMonday(new Date()), bookingDetails.startTime.toDate())) return
    if (weeks.length === 0) return
    setSelectedDay(weeks[weekView][getIndexOfDate(new Date(), weeks[weekView])])
  }, [weekView])

  useEffect(() => {
    if (!id) return
    getBookingDetails()
  }, [id])

  useEffect(() => {
    checkForAuth(navigate, (unit: string) => setUnit(unit))
    getUnitDetails()
  }, [])

  return (
    <div className='userbooking__main page__main'>

      {renderModal()}

      <Header
        leftIcon='back'
        onLeftClick={() => onBack()}
        title='Your booking'
      />

      <div className="content__container">
        <div className='content'>

          {detailsLoading ? (
            <div className='bookings__loading'>
              <DotLottiePlayer
                src={greySpinner}
                autoplay
                loop
                style={{ width: '32px' }}
              />
            </div>
          ) : <>
            <div className="selection__card">
              <div className="selection__content">
                <p className="bold">Selected time</p>
                <p>{dateToLongString(bookingDetails?.startTime.toDate())}</p>
                <p>Park #{bookingDetails?.parkingNumber} • {bookingDetails?.bookingTimeslot}</p>
              </div>
              <button
                className="bold"
                children='Change'
                onClick={() => navigate(`/booking/${id}/select-time/`, { state: { quickChange: false }})}
              />
            </div>

            <div className="selection__card">
              <div className="selection__content">
                <p className="bold">Selected vehicle</p>
                <p>{bookingDetails?.registration}</p>
              </div>
              <button
                className="bold"
                children='Change'
                onClick={() => navigate(`/booking/${id}/select-vehicle/`)}
              />
            </div>
          </>
          }
        </div>

        <Snackbar />


      </div>

      <footer className='button__footer'>
        <Button
          label='Cancel booking'
          styling='secondary'
          destructive
          size='regular'
          onClick={() => setShowDeleteModal(true)}
        />
      </footer>


    </div>
  )
}