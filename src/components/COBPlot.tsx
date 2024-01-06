import { DateTime } from 'luxon'
import { useState } from 'react'
import { JumpToDate } from './JumpToDate'
import { Tuple } from '../types'
import { useSelector } from 'react-redux'
import { ZoomableGraph } from './ZoomableGraph'
import { selectCarbsAsMap } from '../store/reducers/carbs'
import { useCOBCurve } from '../hooks/useCOBCurve'
import React from 'react'

interface IData {
    data: [Date, number][]
    dataDomain: {
        x: Tuple<Date>
        y: Tuple<number>
    }
}

const useDataForCOBPlot = (): IData => {
    const bolusMap = useSelector(selectCarbsAsMap)
    const dataMap = useCOBCurve(bolusMap)
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

    return { data, dataDomain }
}

export const COBPlot = () => {
    const { data, dataDomain } = useDataForCOBPlot()
    const [date, setDate] = useState(DateTime.now().minus({ hours: 1 }))
    return (
        <>
            <JumpToDate onSubmit={setDate} />
            <ZoomableGraph date={date} data={data} dataDomain={dataDomain} />
        </>
    )
}
