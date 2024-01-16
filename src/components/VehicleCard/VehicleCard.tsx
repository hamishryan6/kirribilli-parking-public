import Car from '../../assets/icons/Car'
import './VehicleCard.css'

type Props = {
  vehicle: string
  isSelected?: boolean
  onClick?: () => void
  deletable?: boolean
  onDelete?: () => void
}

export const VehicleCard = ({ onClick, vehicle, isSelected, deletable, onDelete }: Props) => {

  const onDeleteClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!onDelete) return
    event.stopPropagation()
    onDelete()
  }

  return (
    <div
      className={`vehicle__card ${isSelected ? 'selected' : ''} ${deletable ? 'deletable' : ''}`}
      onClick={onClick}>
      <Car className="icon__car" />
      <p>{vehicle}</p>
      {deletable && <button
        children={'Delete'}
        onClick={(e) => onDeleteClick(e)}
      />}
    </div>
  )
}
