import { createContext, useContext } from "react";
import { bookingStateContext } from "./types";

const bookingContext = createContext<bookingStateContext | undefined>(undefined)

export const useBookingContext = () => {
    const bookingState = useContext(bookingContext)

    if (bookingState === undefined) { throw new Error('Context is undefined') }
    else { return bookingState }
}

export default bookingContext