import { useEffect, useState } from "react"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import './CarRegistrationModal.css'
import { Check } from "../../assets/icons/Check"

type Props = {
  isOpen: boolean
  closeModal: () => void
  newCarRegistration: string
  setNewCarRegistration: (input: string) => void
  fixedHeight?: boolean
  onClick: () => void
  saveRegistration: boolean
  setSaveRegistration: (state: boolean) => void
  error: string
}

export const CarRegistrationModal = ({ isOpen, closeModal, newCarRegistration, setNewCarRegistration, fixedHeight, onClick, saveRegistration, setSaveRegistration, error }: Props) => {

  const [modalClosed, setModalClosed] = useState<boolean>(false)

  const onRegistrationChange = (input: string) => {
    let uppercaseInput = input.toUpperCase()

    setNewCarRegistration(uppercaseInput)
  }

  const onModalClose = () => {
    setModalClosed(true)

    setTimeout(() => {
      closeModal()
      setModalClosed(false)
    }, 120)
  }

  const renderModalClass = () => {
    let className = ' modal '
    if (modalClosed) className = className + ` closed `
    if (fixedHeight) className = className + ` fixed `
    return className
  }

  useEffect(() => {
    setNewCarRegistration('')
  }, [isOpen])

  return (
    <div className={`modal__container ${fixedHeight ? 'fixed' : ''}`} onClick={closeModal}>
      <div className={renderModalClass()} onClick={(e) => e.stopPropagation()}>
        <div className='title__block'>
          <h2>Add new vehicle</h2>
          <p>Add a new registration for the booking.</p>
        </div>

        <Input
          value={newCarRegistration}
          onChange={(input: string) => onRegistrationChange(input)}
          size='large'
          label="Car registration"
          id='NewCarRegistration'
          error={error.length > 0}
          errorMessage={error}
          autoFocus
        />

        <button className="checkbox__main" onClick={() => setSaveRegistration(!saveRegistration)}>
          <div className={`checkbox ${saveRegistration ? ' selected ' : ''}`}>
            <Check className="icon__check" />
          </div>

          <p>Save car registration to unit number</p>
        </button>

        <div className='button__pair'>
          <Button
            label='Go back'
            styling='secondary'
            size='small'
            onClick={() => onModalClose()}
          />

          <Button
            label='Confirm'
            styling='primary'
            size='small'
            onClick={onClick}
          />
        </div>

      </div>
    </div>
  )
}
