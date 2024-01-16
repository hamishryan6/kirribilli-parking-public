import './Toggle.css'

type Props = {
  items: string[]
  selection: string
  onSelection: (selection: string) => void
}

export const Toggle = ({ items, selection, onSelection }: Props) => {

  const renderItems = () => {
    return items.map((item, index) => (
      <button
        className={`toggle__item ${item === selection ? 'active' : ''}`}
        children={item}
        onClick={() => onSelection(item)}
      />
    ))
  }

  return (
    <div className='toggle__main' style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {renderItems()}
      <div className='toggle__selection__container' style={{ width: `${(1 / items.length) * 100}%`, transform: `translateX(${items.indexOf(selection)}00%)` }} >
        <div className='toggle__selection' />
      </div>
    </div>
  )
}
