import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/User/Auth/Auth'
import Home from './pages/User/Home/Home'
import ConfirmBooking from './pages/User/ConfirmBooking/ConfirmBooking'
import Context from './Context'
import { BookingDB, bookingDate, bookingDay, newBooking, newVehicle, rulesStatus, snackbar, unitDB } from './types'
import { UserBooking } from './pages/User/UserBooking/UserBooking'
import { SelectTime } from './pages/User/SelectTime/SelectTime'
import { SelectVehicle } from './pages/User/SelectVehicle/SelectVehicle'
import AdminAuth from './pages/Admin/Auth/AdminAuth'
import AdminHome from './pages/Admin/Home/AdminHome'
import { UnitDetails } from './pages/Admin/UnitDetails/UnitDetails'
import { Bookings } from './pages/Admin/Bookings/Bookings'

function App() {

  const [unit, setUnit] = useState<string>('')
  const [unitBookings, setUnitBookings] = useState<BookingDB[]>([])
  const [rulesStatus, setRulesStatus] = useState<rulesStatus>()
  const [bookingAvailability, setBookingAvailability] = useState<bookingDate>()
  const [snackbar, setSnackbar] = useState<snackbar | undefined>()

  const [newBooking, setNewBooking] = useState<newBooking>()
  const [bookingDetails, setBookingDetails] = useState<BookingDB>()

  const [unitDetails, setUnitDetails] = useState<unitDB>()
  const [newVehicle, setNewVehicle] = useState<newVehicle>()

  const [weeks, setWeeks] = useState<bookingDay[][]>([])
  const [weekView, setWeekView] = useState<number>(0)
  const [selectedDay, setSelectedDay] = useState<bookingDay>()

  return (
    <Context.Provider value={{ unit, setUnit, unitBookings, setUnitBookings, rulesStatus, setRulesStatus, newBooking, setNewBooking, snackbar, setSnackbar, bookingAvailability, setBookingAvailability, weeks, setWeeks, weekView, setWeekView, selectedDay, setSelectedDay, unitDetails, setUnitDetails, newVehicle, setNewVehicle, bookingDetails, setBookingDetails }}>
      <Routes>
        <Route path='/login' element={<Auth />} />
        <Route path='/' element={<Home />} />
        <Route path='/new-booking/select-time' element={<SelectTime />} />
        <Route path='/new-booking/select-vehicle' element={<SelectVehicle />} />
        <Route path='/new-booking/confirm' element={<ConfirmBooking />} />
        <Route path='/booking/:id' element={<UserBooking />} />
        <Route path='/booking/:id/select-time' element={<SelectTime />} />
        <Route path='/booking/:id/select-vehicle' element={<SelectVehicle />} />
        
        <Route path='/admin/login' element={<AdminAuth />} />
        <Route path='/admin/' element={<AdminHome />} />
        <Route path='/admin/unit/:unit' element={<UnitDetails />} />
        <Route path='/admin/bookings' element={<Bookings />} />
      </Routes>
    </Context.Provider>
  )
}

export default App