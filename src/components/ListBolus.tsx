import { BolusTable } from './BolusTable'
import { InputBolusFab } from './InputBolusFab'
import { DatePicker } from './Datepicker'
import { useState } from 'react'
import { DateTime } from 'luxon'

export const ListBolus = () => {
    const now = DateTime.now().set({ millisecond: 0, second: 0, minute: 0, hour: 0 })
    const [date, setDate] = useState(now)

    return (
        <>
            <DatePicker date={date} onChange={setDate} />
            <BolusTable date={date} />
            <InputBolusFab />
        </>
    )
}
