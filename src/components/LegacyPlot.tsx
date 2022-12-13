import { InputBolus } from './InputBolus'
import { RechartsIOBPlot } from './RechartsIOBPlot'
import { DatePicker } from './Datepicker'
import { useState } from 'react'
import { DateTime } from 'luxon'

export const LegacyPlot = () => {
    const now = DateTime.now().set({ millisecond: 0, minute: 0, hour: 0 })
    const [date, setDate] = useState(now)

    return (
        <>
            <DatePicker date={date} onChange={setDate} />
            <RechartsIOBPlot date={date} />
            <InputBolus />
        </>
    )
}
