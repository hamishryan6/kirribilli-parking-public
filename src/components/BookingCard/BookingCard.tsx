import ChevronRight from '../../assets/icons/ChevronRight'
import { timeslotString } from '../../types'
import './BookingCard.css'

type Props = {
  date: string
  timeslot: timeslotString
  parkNumber: number
  registration: string
  onClick?: () => void
}

export default function BookingCard({ date, timeslot, parkNumber, registration, onClick }: Props) {
  
  return (
    <div className='bookingcard__main' onClick={onClick}>
      <p className='date'>{date}</p>
      <p className='timeslot'>{timeslot}</p>
      <p>Park #{parkNumber + 45} • {registration}</p>
      {onClick && <ChevronRight className='icon__chevron' />}
    </div>
  )
}
