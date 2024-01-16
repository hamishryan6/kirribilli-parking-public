import { useEffect, useState } from 'react'
import Button from '../../../components/Button/Button'
import KirribilliK from '../../../assets/logos/KirribilliK'
import './Auth.css'
import { checkForAuth, setThemeColour, validateLogin } from '../../../utilities'
import Input from '../../../components/Input/Input'
import { useNavigate } from 'react-router-dom'
import { useBookingContext } from '../../../Context'
import { ParkingRulesModal } from '../../../modals/ParkingRulesModal/ParkingRulesModal'

export default function Auth() {

  const navigate = useNavigate()

  const { unit, setUnit } = useBookingContext()
  const [loginError, setLoginError] = useState<boolean>(false)
  const [showParkingRulesModal, setShowParkingRulesModal] = useState<boolean>(false)

  useEffect(() => {
    if (!loginError) return
    setLoginError(false)
  }, [unit])

  useEffect(() => {
    setThemeColour('#BA7847')
    setUnit('')
    checkForAuth(navigate, (unit: string) => setUnit(unit))
  }, [])

  const renderRulesModal = () => {
    if (!showParkingRulesModal) return
    return <ParkingRulesModal
      closeModal={() => setShowParkingRulesModal(false)}
      fixedHeight
    />
  }

  return (
    <div className='page__main auth__main'>

      <div className='auth__logo__container'>
        <KirribilliK className='logo__large' />
      </div>

      {renderRulesModal()}

      <div className='auth__container'>

        <div className='title__block'>
          <h2>Welcome to Kirribilli Parking</h2>
          <p>To get started, enter your unit number.</p>
        </div>

        <Input
          id='unit-number'
          label='Unit Number'
          value={unit}
          onChange={(input: string) => setUnit(input)}
          size='large'
          error={loginError}
          errorMessage='Unit not found'
          autoFocus
        />


        <div className='button__stack'>

        <div className='disclaimer'>
          <p>By continuing with this booking you must agree to the following:</p>
          <ul>
            <li>I have read and understand the Booking System Rules and agree to abide by them</li>
          </ul>
        </div>

          <Button
            label='before you book'
            highlight='View the parking rules'
            onClick={() => setShowParkingRulesModal(true)}
            styling='tertiary'
            size='small'
            heighlightPosition='before'
          />

          <Button
            label={'Agree & Continue'}
            onClick={() => validateLogin(unit, navigate, (state: boolean) => setLoginError(state))}
            styling='primary'
            size='regular'
            disabled={unit === ''}
          />
        </div>

      </div>
    </div>
  )
}