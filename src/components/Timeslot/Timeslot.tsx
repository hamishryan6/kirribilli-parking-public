import { bookingDay, newBooking, timeslotString } from "../../types"
import { timeslotToString } from "../../utilities"

type Props = {
    unavailable: boolean
    timeslotString: timeslotString
    onClick?: () => void
    parkNumber: number
    newBooking: newBooking| undefined
    selectedDay: bookingDay
}

export default function Timeslot({ unavailable, timeslotString, onClick, parkNumber, newBooking, selectedDay }: Props) {

    const renderTimeClass = () => {
        let className = ' time '
        if (parkNumber === newBooking?.parkingNumber && selectedDay.date.toDateString() === newBooking.startingDate.toDateString() && timeslotString === timeslotToString(newBooking.timeslot)) className = className + ' selected '
        if (unavailable) className = className + ' unavailable '

        return className
    }

    return (
        <li
            className={renderTimeClass()}
            children={timeslotString}
            onClick={unavailable ? () => null : onClick}
        />
    )
}
