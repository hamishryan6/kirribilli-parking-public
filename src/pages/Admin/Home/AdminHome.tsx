import './AdminHome.css'
import Header from '../../../sections/Header/Header'
import { Snackbar } from '../../../components/Snackbar/Snackbar'
import { units } from '../../../utilities'
import { Nav } from '../../../sections/Nav/Nav'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { checkForAdminAuth, signout } from '../../../services/AuthService'
import { DotLottiePlayer } from '@dotlottie/react-player'
import greySpinner from '../../../assets/animations/grey-spinner.json'

export default function AdminHome() {

  const navigate = useNavigate()

  const [checkingForAuth, setCheckingForAuth] = useState<boolean>(true)

  const handleSignout = async () => {
    try {
      const result = await signout()
      if (!result) throw Error('Error signing out')
      navigate('/admin/login')
    } catch (error) {
      console.log(error)
    }
  }

  const renderUnits = () => {
    return units.map((unitFloor, index) => (
      <div key={index} className='units__level'>
        <label>{unitFloor.level}</label>
        {unitFloor.unitCodes.map((code, index) => (
          <button
            className='units__card'
            key={index}
            children={code}
            onClick={() => navigate(`/admin/unit/${code}`)}
          />
        ))}
      </div>
    ))
  }

  const getAuthStatus = async () => {
    try {
      setCheckingForAuth(true)
      const result = await checkForAdminAuth()
      if (result) return
      navigate('/admin/login')
    } catch (error) {
      console.log(error)
    } finally {
      setCheckingForAuth(false)
    }
  }

  useEffect(() => {
    getAuthStatus()
  }, [])

  return (
    <div className='page__main home__main'>
      <Header
        leftIcon='signout'
        onLeftClick={() => handleSignout()}
      />

      {checkingForAuth ? <div className='loading__container'>
        <DotLottiePlayer
        src={greySpinner}
        autoplay
        loop
        style={{ width: '32px' }}
      /> 
      </div> : <>
        <div className='content__container'>

          <div className='content'>
            <div className='title__block'>
              <h2>Units</h2>
              <p>Select a unit to view bookings or make changes.</p>
            </div>

            <div className='units__list'>
              {renderUnits()}
            </div>
          </div>

          <Snackbar />

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
          active='Units'
        />
      </>
      }

    </div>
  )
}