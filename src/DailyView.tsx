import { DateTime } from 'luxon'
import { useState } from 'react'
import { BolusList } from './BolusList'
import { IOBPlot } from './IOBPlot'

export const DailyView = () => {
    const now = DateTime.now().set({ millisecond: 0, second: 0, minute: 0, hour: 0 })
    const [date, setDate] = useState(now)
    const changeDate = (d: number) => {
        setDate(date.plus({ days: d }))
    }
    return (
        <>
            <h1>Daily view</h1>
            <button onClick={() => changeDate(-1)}>previous</button>
            {date.toLocaleString()}
            <button onClick={() => changeDate(1)}>next</button>
            <button onClick={() => setDate(now)}>now</button>

            <IOBPlot date={date} />
            <BolusList date={date} />
        </>
    )
}
