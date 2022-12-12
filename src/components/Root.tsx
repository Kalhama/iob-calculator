import { InputBolus } from './InputBolus'
import { IOBPlot } from './IOBPlot'
import { DatePicker } from './Datepicker'
import { useState } from 'react'
import { DateTime } from 'luxon'

export const Root = () => {
    const now = DateTime.now().set({ millisecond: 0, minute: 0, hour: 0 })
    const [date, setDate] = useState(now)

    return (
        <>
            <DatePicker date={date} onChange={setDate} />
            <IOBPlot date={date} />
            <InputBolus />
        </>
    )
}
