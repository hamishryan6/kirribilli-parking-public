import './EmptyState.css'
import NoParks from '../../assets/icons/NoParks'
import { NoCars } from '../../assets/icons/NoCars'

type Props = {
  icon: 'parking' | 'vehicles'
  header: string
  message: string
}

export const EmptyState = ({ icon, header, message }: Props) => {

  const renderIcon = () => {
    switch (icon) {
      case 'parking': return  <NoParks className='icon__no-parks' />
      case 'vehicles': return <NoCars className='icon__no-parks' />
    }
  }

  return (
    <div className='booking__card-empty'>
     {renderIcon()}
      <div className='text__block-small'>
        <h4>{header}</h4>
        <p>{message}</p>
      </div>
    </div>
  )
}
