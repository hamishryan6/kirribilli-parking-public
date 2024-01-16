import './TimetableSlot.css'

type Props = {
  unit?: string
  registration?: string
}

export const TimetableSlot = ({ unit, registration }: Props) => {

  const renderContent = () => {
    if (!unit || !registration) return
      return <>
        <p className='timetableslot__unit'>Unit {unit}</p>
        <p className='timetableslot__registration'>{registration}</p>
      </>
  }

  return (
    <div className={`timetableslot__main ${!unit && !registration ? 'empty' : ''}`}>
      {renderContent()}
    </div>
  )
}
