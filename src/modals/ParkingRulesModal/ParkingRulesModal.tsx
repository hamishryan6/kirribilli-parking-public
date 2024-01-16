import { useState } from 'react'
import './ParkingRulesModal.css'
import Button from '../../components/Button/Button'
import { Calendar } from '../../assets/icons/Calendar'
import { CarBuilding } from '../../assets/icons/CarBuilding'
import { CarSun } from '../../assets/icons/CarSun'
import { CarMoon } from '../../assets/icons/CarMoon'
import Car from '../../assets/icons/Car'
import { Cars } from '../../assets/icons/Cars'

type Props = {
  closeModal: () => void
  fixedHeight?: boolean
}

export const ParkingRulesModal = ({ closeModal, fixedHeight }: Props) => {

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
    if (modalClosed) className = className + ` closed `
    if (fixedHeight) className = className + ` fixed `
    return className
  }

  return (
    <div className={`modal__container ${fixedHeight ? 'fixed' : ''}`} onClick={closeModal}>
      <div className={renderModalClass()} onClick={(e) => e.stopPropagation()}>
        <div className='title__block'>
          <h2>Parking rules</h2>
        </div>

        <ul className='parking__rule__list'>

          <li className='parking__rule'>
            <div className='icon__rule__container'>
              <Calendar className='icon__rule' />
            </div>
            <p>Bookings can be made up to two weeks in advance.</p>
          </li>

          <li className='parking__rule'>
            <div className='icon__rule__container'>
              <CarBuilding className='icon__rule' />
            </div>
            <p>Maximum of 1 park per booking day.</p>
          </li>

          <li className='parking__rule'>
            <div className='icon__rule__container'>
              <CarSun className='icon__rule' />
            </div>
            <p>Maximum of 3 daytime parks per booking week.</p>
          </li>

          <li className='parking__rule'>
            <div className='icon__rule__container'>
              <CarMoon className='icon__rule' />
            </div>
            <p>Maximum of 1 overnight park per booking week.</p>
          </li>

          <li className='parking__rule'>
            <div className='icon__rule__container'>
              <Cars className='icon__rule' />
            </div>
            <p>Maximum combination of 1 daytime park and 1 overnight park per booking week.</p>
          </li>
        </ul>

        <Button
          styling='secondary'
          size='regular'
          label='I understand'
          onClick={() => onModalClose()}
        />

      </div>
    </div>

  )
}
