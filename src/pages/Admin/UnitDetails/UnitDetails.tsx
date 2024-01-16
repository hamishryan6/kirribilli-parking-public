import { DotLottiePlayer } from '@dotlottie/react-player'
import Header from '../../../sections/Header/Header'
import './UnitDetails.css'
import greySpinner from '../../../assets/animations/grey-spinner.json'
import { Snackbar } from '../../../components/Snackbar/Snackbar'
import { useNavigate, useParams } from 'react-router-dom'
import { Toggle } from '../../../components/Toggle/Toggle'
import { useEffect, useState } from 'react'
import { BookingDB } from '../../../types'
import BookingCard from '../../../components/BookingCard/BookingCard'
import { VehicleCard } from '../../../components/VehicleCard/VehicleCard'
import { getUnit, getUnitBookings } from '../../../services/FirestoreService'
import { generateDayStrings } from '../../../utilities'
import { EmptyState } from '../../../components/EmptyState/EmptyState'

export const UnitDetails = () => {

  const { unit } = useParams() as { unit: string }
  const navigate = useNavigate()

  const [currentView, setCurrentView] = useState<'Bookings' | 'Vehicles'>('Bookings')

  const [bookings, setBookings] = useState<BookingDB[]>([])
  const [vehicles, setVehicles] = useState<string[]>([])

  const [unitDataLoading, setUnitDataLoading] = useState<boolean>(true)

  const getUnitData = async () => {
    try {
      const [unitDetails, unitBookings] = await Promise.all([
        getUnit(unit),
        getUnitBookings(unit, generateDayStrings(new Date()))
      ])
      if (unitDetails === false || unitBookings === false) throw Error('Error getting unit data')
      setVehicles(unitDetails.vehicles)
      setBookings(unitBookings)
    } catch (error) {
      console.log(error)
    } finally {
      setUnitDataLoading(false)
    }
  }

  const renderBookings = () => {
    if (bookings.length === 0) {
      return <EmptyState
        icon='parking'
        header='No bookings found'
        message='This unit has no future bookings'
      />
    } else return bookings.map((booking, index) => (
      <BookingCard
        key={index}
        date={booking.bookingDay}
        parkNumber={booking.parkingNumber}
        timeslot={booking.bookingTimeslot}
        registration={booking.registration}
      />
    ))
  }

  const renderVehicles = () => {
    if (vehicles.length === 0) {
      return <EmptyState
        icon='vehicles'
        header='No vehicles found'
        message='This unit has no saved vehicles'
      />
    } else return vehicles.map((vehicle, index) => (
      <VehicleCard
        key={index}
        vehicle={vehicle}
      />
    ))
  }

  const renderView = () => {
    switch (currentView) {
      case 'Bookings': return renderBookings()
      case 'Vehicles': return renderVehicles()
    }
  }

  useEffect(() => {
    getUnitData()
  }, [unit])

  return (
    <div className='page__main unit__main'> 
      <Header
        leftIcon='back'
        onLeftClick={() => navigate('/admin/')}
        title='Unit details'
      />

      <div className="content__container">
        <div className='content'>

          <div className='title__block'>
            <h2>Unit {unit}</h2>
          </div>

          {unitDataLoading ? (
            <div className='bookings__loading'>
              <DotLottiePlayer
                src={greySpinner}
                autoplay
                loop
                style={{ width: '32px' }}
              />
            </div>
          ) :
            <>
              <Toggle
                items={['Bookings', 'Vehicles']}
                selection={currentView}
                onSelection={(selection: string) => setCurrentView(selection as 'Bookings' | 'Vehicles')}
              />
              <div className={`${currentView.toLocaleLowerCase()}__list`}>
                {renderView()}
              </div>
            </>
          }
        </div>

        <Snackbar />


      </div>
    </div>
  )
}
