import { useState } from 'react'
import Button from '../../components/Button/Button'

type Props = {
  closeModal: () => void
  onClick: () => void
  loading: boolean
}

export const DeleteVehicleModal = ({ closeModal, onClick, loading }: Props) => {

  const [modalClosed, setModalClosed] = useState<boolean>(false)

  const onModalClose = () => {
    setModalClosed(true)

    setTimeout(() => {
      closeModal()
      setModalClosed(false)
    }, 120)
  }

  const renderModalClass = () => {
    let className = ' modal '

    if(modalClosed) className = className + ` closed `

    return className
  }

  return (
    <div className='modal__container' onClick={closeModal}>
      <div className={renderModalClass()} onClick={(e) => e.stopPropagation()}>
        <div className='title__block'>
          <h2>Confirm vehicle delete</h2>
          <p>Are you sure you want to remove this vehicle from the unit?</p>
        </div>

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
            destructive
            size='small'
            loading={loading}
            onClick={onClick}
          />
        </div>

      </div>
    </div>
  )
}