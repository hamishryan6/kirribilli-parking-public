import { useEffect, useState } from 'react'
import Header from '../../../sections/Header/Header'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Snackbar } from '../../../components/Snackbar/Snackbar'
import Button from '../../../components/Button/Button'
import { CarRegistrationModal } from '../../../modals/CarRegistrationModal/CarRegistrationModal'
import { useBookingContext } from '../../../Context'
import { getUnit, updateUnitVehicles, updateUserBooking } from '../../../services/FirestoreService'
import { checkForConnection, newBookingToBookingObj, stringToTimeslot } from '../../../utilities'
import { newBooking, snackbar } from '../../../types'
import { VehicleCard } from '../../../components/VehicleCard/VehicleCard'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { DeleteVehicleModal } from '../../../modals/DeleteVehicleModal/DeleteVehicleModal'

export const SelectVehicle = () => {

  const navigate = useNavigate()

  const { id } = useParams()

  const pathname = useLocation().pathname
  const isEditing = pathname.includes('new-booking') === false

  const [showCarRegistrationModal, setShowCarRegistrationModal] = useState<boolean>(false)
  const [newCarRegistration, setNewCarRegistration] = useState<string>('')
  const [saveRegistration, setSaveRegistration] = useState<boolean>(false)

  const [deleteVehicle, setDeleteVehicle] = useState<string>()

  const [showVehicleDeleteModal, setShowVehicleDeleteModal] = useState<boolean>(false)

  const [addVehicleError, setAddVehicleError] = useState<string>('')

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)

  const { unitDetails, setUnitDetails, newBooking, setNewBooking, bookingDetails, setSnackbar, newVehicle, setNewVehicle } = useBookingContext()

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

  const addNewVehicleToUnit = async () => {
    try {
      if (!unitDetails) return
      let updatedVehicles = [...unitDetails.vehicles, newCarRegistration]
      const result = await updateUnitVehicles(unitDetails.id, updatedVehicles)
      if (!result) throw Error('Error updating vehicles')
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const updateBooking = async (newRegistrationBooking?: newBooking) => {
    try {
      setUpdateLoading(true)
      if (!id || !newBooking) return
      let updateVehiclesResults
      if (saveRegistration) {
        updateVehiclesResults = await addNewVehicleToUnit()
        if (!updateVehiclesResults) throw Error('Error updating vehicles')
      }
      const updateBookingResult = await updateUserBooking(id, newBookingToBookingObj(newRegistrationBooking ?? newBooking))
      if (!updateBookingResult) throw Error('Error updating booking')
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

  const renderButtonState = () => {
    if (!newBooking?.registration) return true
    return false
  }

  const deleteVehicleFromUnit = async () => {
    if (!unitDetails || !deleteVehicle) return
    setDeleteLoading(true)
    try {
      const updatedVehicles = unitDetails.vehicles.filter(vehicle => vehicle !== deleteVehicle)
      const result = await updateUnitVehicles(unitDetails.id, updatedVehicles)
      if (!result) throw Error('Error deleting vehicle')
      getUnitDetails()
      setShowVehicleDeleteModal(false)
    } catch (error) {
      console.log(error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const onVehicleDelete = (vehicle: string) => {
    setDeleteVehicle(vehicle)
    setShowVehicleDeleteModal(true)
  }

  const onCarRegistrationAdd = () => {
    console.log(unitDetails, newBooking)
    if (!unitDetails) return console.log('no unit details')
    if (unitDetails.vehicles.indexOf(newCarRegistration) !== -1) return setAddVehicleError('Registration already exists')

    setNewVehicle({
      registration: newCarRegistration,
      saveToUnit: saveRegistration
    })

    if (!newBooking) return

    if (isEditing) return updateBooking(
      {
        unit: newBooking.unit,
        registration: newCarRegistration,
        parkingNumber: newBooking.parkingNumber,
        timeslot: newBooking.timeslot,
        startingDate: newBooking.startingDate
      }
    )

    setNewBooking({
      unit: newBooking.unit,
      registration: newCarRegistration,
      parkingNumber: newBooking.parkingNumber,
      timeslot: newBooking.timeslot,
      startingDate: newBooking.startingDate
    })

    navigate('/new-booking/confirm')
  }

  const onVehicleClick = (vehicle: string) => {

    let newBookingData = undefined

    if (bookingDetails) {
      newBookingData = {
        unit: bookingDetails.unit,
        registration: vehicle,
        parkingNumber: bookingDetails.parkingNumber,
        timeslot: stringToTimeslot(bookingDetails.bookingTimeslot),
        startingDate: bookingDetails.startTime.toDate()
      } as newBooking

    } else {
      if (!newBooking) return
      newBookingData = {
        unit: newBooking.unit,
        registration: vehicle,
        parkingNumber: newBooking.parkingNumber,
        timeslot: newBooking.timeslot,
        startingDate: newBooking?.startingDate
      } as newBooking
    }

    setNewBooking(newBookingData)
  }

  const renderRegistrationModal = () => {
    if (!showCarRegistrationModal) return
    return <CarRegistrationModal
      isOpen={showCarRegistrationModal}
      closeModal={() => setShowCarRegistrationModal(false)}
      newCarRegistration={newCarRegistration}
      setNewCarRegistration={(input: string) => setNewCarRegistration(input)}
      onClick={() => onCarRegistrationAdd()}
      saveRegistration={saveRegistration}
      setSaveRegistration={(state: boolean) => setSaveRegistration(state)}
      error={addVehicleError}
    />
  }

  const renderDeleteModal = () => {
    if (!showVehicleDeleteModal) return
    return <DeleteVehicleModal
      closeModal={() => setShowVehicleDeleteModal(false)}
      onClick={() => deleteVehicleFromUnit()}
      loading={deleteLoading}
    />
  }

  const renderVehicles = () => {
    if (!unitDetails) return
    if (unitDetails.vehicles.length === 0) {
      return <EmptyState
        icon='vehicles'
        header='No vehicles found'
        message='This unit has no saved vehicles'
      />
    } else return (
      unitDetails.vehicles.map((vehicle, index) => {
        return <VehicleCard
          key={index}
          vehicle={vehicle}
          isSelected={newBooking?.registration === vehicle}
          onClick={() => onVehicleClick(vehicle)}
          deletable
          onDelete={() => onVehicleDelete(vehicle)}
        />

      }
      )
    )
  }

  const onNextClick = () => {
    if (!newBooking) return
    if (isEditing) return updateBooking()
    navigate('/new-booking/confirm')
  }

  const onBackClick = () => {
    if (isEditing) return navigate(`/booking/${id}`)
    return navigate('/new-booking/select-time', { state: { quickChange: false } })
  }

  useEffect(() => {
    if (showVehicleDeleteModal) return
    setDeleteVehicle(undefined)
  }, [showVehicleDeleteModal])

  useEffect(() => {
    setNewVehicle(undefined)
    if (isEditing && !bookingDetails) navigate(`/booking/${id}`)
    if (isEditing && bookingDetails) setNewBooking({
      unit: bookingDetails.unit,
        registration: bookingDetails.registration,
        parkingNumber: bookingDetails.parkingNumber,
        timeslot: stringToTimeslot(bookingDetails.bookingTimeslot),
        startingDate: bookingDetails.startTime.toDate()
    })
    if (!newBooking && !isEditing) navigate('/')
    if (unitDetails) return
  }, [])

  return (
    <div className='page__main booking__main'>

      {renderRegistrationModal()}
      {renderDeleteModal()}

      <Header
        title={isEditing ? 'Edit a booking' : 'Create a booking'}
        leftIcon='back'
        onLeftClick={() => onBackClick()}
      />

      <div className='content__container'>

        <div className='content'>

          <div className='title__block'>
            <h2>Select a vehicle</h2>
            <p>Select which vehicle you would like to make this booking for.</p>
          </div>

          <div className="vehicle__container">
            {renderVehicles()}

            <Button
              styling='secondary'
              size='small'
              label="Add new vehicle"
              onClick={() => setShowCarRegistrationModal(true)}

            />
          </div>
        </div>

        <Snackbar />

      </div>

      <footer className='button__footer'>

        <Button
          label={(isEditing ? 'Update' : 'Next')}
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
