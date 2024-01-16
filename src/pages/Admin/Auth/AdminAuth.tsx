import { useEffect, useState } from 'react'
import Button from '../../../components/Button/Button'
import KirribilliK from '../../../assets/logos/KirribilliK'
import './AdminAuth.css'
import Input from '../../../components/Input/Input'
import { useNavigate } from 'react-router-dom'
import { checkForAdminAuth, signInAdmin } from '../../../services/AuthService'
import { DotLottiePlayer } from '@dotlottie/react-player'
import whiteSpinner from '../../../assets/animations/white-spinner.json'

export default function AdminAuth() {

  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [signInLoading, setSignInLoading] = useState<boolean>(false)
  const [checkingForAuth, setCheckingForAuth] = useState<boolean>(true)

  const signIn = async () => {
    try {
      setSignInLoading(true)
      const result = await signInAdmin(email, password)
      if (!result) throw Error('Error during admin sign in')
      navigate('/admin')
    } catch (error) {
      console.log(error)
    } finally {
      setSignInLoading(false)
    }
  }

  const getAuthStatus = async () => {
    try {
      setCheckingForAuth(true)
      const result = await checkForAdminAuth()
      if (!result) return
      navigate('/admin')
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
    <div className='page__main auth__main'>

      <div className='auth__logo__container'>
        <KirribilliK className='logo__large' />
      </div>

      {checkingForAuth
        ? <div className='loading__container'>
          <DotLottiePlayer
            src={whiteSpinner}
            autoplay
            loop
            style={{ width: '32px' }}
          />
        </div>
        : <div className='auth__container'>

          <div className='title__block'>
            <h2>Welcome to Kirribilli Parking</h2>
            <p>To get started, enter your unit number.</p>
          </div>

          <Input
            id='email-address'
            label='Email address'
            value={email}
            onChange={(input: string) => setEmail(input)}
            size='regular'
            htmlType='email'
            autoFocus
          />

          <Input
            id='password'
            label='Password'
            value={password}
            onChange={(input: string) => setPassword(input)}
            size='regular'
            htmlType='password'

          />

          <div className='button__stack'>
            <Button
              label='Forgot password?'
              highlight='Reset here'
              onClick={() => null}
              styling='tertiary'
              size='small'
            />

            <Button
              label={'Continue'}
              onClick={() => signIn()}
              styling='primary'
              size='regular'
              loading={signInLoading}
            />
          </div>

        </div>}
    </div>
  )
}