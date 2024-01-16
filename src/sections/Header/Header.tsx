import './Header.css'
import ArrowLeft from '../../assets/icons/ArrowLeft'
import KirribilliK from '../../assets/logos/KirribilliK'
import Signout from '../../assets/icons/Signout'

type Props = {
  leftIcon?: 'back' | 'signout'
  onLeftClick?: () => void
  title?: string
  rightIcon?: string
  onRightClick?: () => void
}

export default function Header({ leftIcon, onLeftClick, title, rightIcon, onRightClick }: Props) {

  const renderIcon = (icon?: string) => {
    if (!icon) return
    switch (icon) {
      case 'back': return <ArrowLeft className='icon__header' />
      case 'signout': return <Signout className='icon__header' />
      default: return
    }
  }

  const renderHeaderContent = () => {
    if (!title) return <KirribilliK className='logo__small' />
    return <h3>{title}</h3>
  }

  return (
    <header>
      <div className='header__content'>
        <button className='icon__container' onClick={onLeftClick}>
          {renderIcon(leftIcon)}
        </button>
        {renderHeaderContent()}
        <button className='icon__container' onClick={onRightClick}>
          {renderIcon(rightIcon)}
        </button>
      </div>
    </header>
  )
}
