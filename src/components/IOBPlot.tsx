import { Box } from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useIOBNow } from '../hooks/useIOBNow'
import { useIOBCurve } from '../hooks/useIOBCurve'
import { JumpToDate } from './JumpToDate'
import { Tuple } from '../types'
import { useSelector } from 'react-redux'
import { selectBolusAsMap } from '../store/reducers/bolus'
import { ZoomableGraph } from './ZoomableGraph'

interface IData {
    data: [Date, number][]
    dataDomain: {
        x: Tuple<Date>
        y: Tuple<number>
    }
    IOB: number
}

const useDataForIOBPlot = (): IData => {
    const bolusMap = useSelector(selectBolusAsMap)
    const dataMap = useIOBCurve(bolusMap)
    const data = Array.from(dataMap).map(([key, value]) => {
        return [DateTime.fromSeconds(key).toJSDate(), value] as [Date, number]
    })

    const dataDomain = (() => {
        const epochArr = data.map((d) => d[0].valueOf())
        const minDate = new Date(Math.min(...epochArr))
        const maxDate = new Date(Math.max(...epochArr))
        const valueArr = data.map((d) => d[1])
        const minValue = Math.min(...valueArr)
        const maxValue = Math.max(...valueArr)
        return {
            x: [minDate, maxDate],
            y: [minValue, maxValue]
        } as IData['dataDomain']
    })()

    const IOB = useIOBNow(bolusMap)

    return { data, dataDomain, IOB }
}

export const IOBPlot = () => {
    const { data, dataDomain, IOB } = useDataForIOBPlot()
    const [date, setDate] = useState(DateTime.now().minus({ hours: 3 }))
    return (
        <>
            <JumpToDate onSubmit={setDate} />
            <ZoomableGraph date={date} data={data} dataDomain={dataDomain} />
            <Box sx={{ marginTop: '2em' }}>Current IOB {Math.round(IOB * 10) / 10}</Box>
        </>
    )
}
