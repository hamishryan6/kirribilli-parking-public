import './DateButton.css'

type Props = {
    date: Date
    selected: boolean
    inactive: boolean
    onClick: () => void
}

export default function DateButton({ date, selected, inactive, onClick }: Props) {

  const renderClassNames = () => {
    let className = ' date__main '

    if (inactive) className = className + ` date__inactive `
    if (selected) className = className + ` date__selected `

    return className
  }

  return (
    <li className={renderClassNames()} onClick={onClick}>
        <p className='date__weekday'>{date.toLocaleDateString('en-GB', { weekday: 'short' } )}</p>
        <p className='date__number'>{date.toLocaleDateString('en-GB', { day: 'numeric' })}</p>
    </li>
  )
}