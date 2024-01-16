import { useNavigate } from 'react-router-dom'
import { Building } from '../../assets/icons/Building'
import Car from '../../assets/icons/Car'
import './Nav.css'

type Props = {
  items: Array<{ label: 'Units' | 'Bookings', link: string}>
  active: 'Units' | 'Bookings' | undefined
}

export const Nav = ({ items, active }: Props) => {

  const navigate = useNavigate()

  const renderIconClass = (item: 'Units' | 'Bookings') => {
    let className = ' icon__nav-item '

    if (item === active) className = className + ' active '

    return className
  }

  const renderIcon = (item: 'Units' | 'Bookings') => {
    switch (item) {
      case 'Units': return <>
        <Building className={renderIconClass(item)} />
        <p
          className={`navitem__name ${item === active ? 'active' : ''}`}
          children={item}
        />
      </>
      case 'Bookings': return <>
        <Car className={renderIconClass(item)} />
        <p
          className={`navitem__name ${item === active ? 'active' : ''}`}
          children={item}
        />
      </>
    }
  }

  const renderItems = () => {
    return items.map((item, index) => (
      <li key={index} onClick={() => navigate(item.link)}>
        {renderIcon(item.label)}
      </li>
    ))
  }

  return (
    <nav className='nav__main'>
      <ul>
        {renderItems()}
      </ul>
    </nav>
  )
}