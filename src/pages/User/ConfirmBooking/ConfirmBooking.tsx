import { useEffect, useState } from 'react'
import Header from '../../../sections/Header/Header'
import './ConfirmBooking.css'
import { dateToLongString, timeslotToString, checkForAuth, checkForConnection, asyncTimeout, newBookingToBookingObj } from '../../../utilities'
import { snackbar } from '../../../types'
import Button from '../../../components/Button/Button'
import { useNavigate } from 'react-router-dom'
import { useBookingContext } from '../../../Context'
import { createBooking, updateUnitVehicles } from '../../../services/FirestoreService'
import { Snackbar } from '../../../components/Snackbar/Snackbar'

export default function Booking() {

  const [bookingCreationLoading, setBookingCreationLoading] = useState<boolean>(false)

  const navigate = useNavigate()

  const { setUnit, unitDetails, newBooking, setSnackbar, newVehicle } = useBookingContext()

  const onBookingCreationSuccess = () => {
    setSnackbar({
      url: '/',
      state: 'success',
      message: 'Booking successfully created'
    })
    navigate('/')
  }

  const addNewVehicleToUnit = async () => {
    try {
      if (!unitDetails || !newVehicle) return
      let updatedVehicles = [...unitDetails.vehicles, newVehicle.registration]
      const result = await updateUnitVehicles(unitDetails.id, updatedVehicles)
      if (!result) throw Error('Error updating vehicles')
    } catch (error) {
      console.log(error)
    }
  }

  const makeBooking = async () => {
    if (!newBooking) return
    setBookingCreationLoading(true)

    try {
      if (!checkForConnection((state: snackbar) => setSnackbar(state))) return
      await Promise.all([
        (newVehicle?.saveToUnit && addNewVehicleToUnit()),
        createBooking(newBookingToBookingObj(newBooking)),
        asyncTimeout(400)])
      onBookingCreationSuccess()
    } catch (e) {
      if (e instanceof Error) setSnackbar({
        url: '/new-booking/confirm',
        state: 'error',
        message: e.message
      })
    } finally {
      setBookingCreationLoading(false)
    }
  }

  useEffect(() => {
    checkForAuth(navigate, (unit: string) => setUnit(unit))
  }, [])

  return (
    <div className='page__main booking__main'>

      <Header
        title='Create a booking'
        leftIcon='back'
        onLeftClick={() => navigate('/new-booking/select-vehicle')}
      />

      <div className='content__container'>
        <div className='content'>

          <div className='title__block'>
            <h2>Confirm your booking</h2>
            <p>Double check your selections before confirming your booking.</p>
          </div>

          <div className="selection__container">

          <div className="selection__card">
              <div className="selection__content">
                <p className="bold centred">Unit {unitDetails?.unit}</p>
              </div>
            </div>

            <div className="selection__card">
              <div className="selection__content">
                <p className="bold">Selected time</p>
                <p>{dateToLongString(newBooking?.startingDate)}</p>
                <p>Park #{!newBooking ? '' : newBooking.parkingNumber + 45} • {!newBooking ? '' : timeslotToString(newBooking?.timeslot)}</p>
              </div>
              <button
                className="bold"
                children='Change'
                onClick={() => navigate('/new-booking/select-time', { state: { quickChange: true } })}
              />
            </div>

            <div className="selection__card">
              <div className="selection__content">
                <p className="bold">Selected vehicle</p>
                <p>{newBooking?.registration}</p>
              </div>
              <button
                className="bold"
                children='Change'
                onClick={() => navigate('/new-booking/select-vehicle', { state: { quickChange: true } })}
              />
            </div>

          </div>
        </div>

        <Snackbar />

      </div>

      <footer className='button__footer'>

        <div className='disclaimer'>
          <p>By continuing with this booking you must agree to the following:</p>
          <ul>
            <li>I am authorised to make a booking for the Unit Number entered</li>
            <li>The information I have provided is true and correct</li>
          </ul>
        </div>

        <div className='button__pair'>
        <Button
            label='Cancel'
            onClick={() => navigate('/')}
            styling='secondary'
            size='regular'
          />

          <Button
            label='Agree & Continue'
            onClick={() => makeBooking()}
            styling='primary'
            size='regular'
            loading={bookingCreationLoading}
          />
        </div>
      </footer>

    </div>
  )
}