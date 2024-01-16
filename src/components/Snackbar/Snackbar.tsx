import { useEffect } from 'react'
import { useBookingContext } from '../../Context'
import { Check } from '../../assets/icons/Check'
import './Snackbar.css'
import { Alert } from '../../assets/icons/Alert'
import { useLocation } from 'react-router-dom'

export const Snackbar = () => {

  const { snackbar, setSnackbar } = useBookingContext()
  const URL = useLocation().pathname

  const renderIcon = () => {
    if (!snackbar) return
    switch (snackbar.state) {
      case 'success': return <Check className='icon__success' />
      case 'error': return <Alert className='icon__error' />
      case 'alert': return <Alert className='icon__alert' />
    }
  }

  useEffect(() => {
    if (!snackbar) return
    setTimeout(() => setSnackbar(undefined), 3000)
  }, [snackbar])

  useEffect(() => {
    if (URL === snackbar?.url || snackbar?.url === 'any') return
    setSnackbar(undefined)
  }, [URL])

  if (!snackbar) return <></>
  return (
    <div className='snackbar__container'>
      <div className={`snackbar__main snackbar__${snackbar.state}`} >
        {renderIcon()}
        <p>{snackbar.message}</p>
      </div>
    </div>
  )
}