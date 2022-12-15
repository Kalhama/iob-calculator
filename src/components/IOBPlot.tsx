import { Box } from '@mui/material'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { DomainTuple, VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory'
import { useIOBNow } from '../hooks/useIOBNow'
import { useIOBCurve } from '../hooks/useIOBCurve'
import { useNow } from '../hooks/useNow'
import { JumpToDate } from './JumpToDate'
import { Tuple } from '../types'
import { useSelector } from 'react-redux'
import { selectBolusAsMap } from '../store/reducers/bolus'

const maxPoints = 240

interface IData {
    data: [Date, number][]
    domain: {
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
    }) as [Date, number][]

    const domain = {
        x: [_.minBy(data, (d) => d[0])[0], _.maxBy(data, (d) => d[0])[0]] as Tuple<Date>,
        y: [_.minBy(data, (d) => d[1])[1], _.maxBy(data, (d) => d[1])[1]] as Tuple<number>
    } as { x: Tuple<Date>; y: Tuple<number> }

    const IOB = useIOBNow(bolusMap)

    return { data, domain, IOB }
}

export const IOBPlot = () => {
    const { data, domain, IOB } = useDataForIOBPlot()

    const initialXDomain = [
        DateTime.now().minus({ hours: 3 }).toJSDate(),
        DateTime.now().plus({ hours: 3 }).toJSDate()
    ] as Tuple<Date>
    const [zoomedXDomain, setZoomedXDomain] = useState(initialXDomain)
    const now = useNow(60)

    const onZoomDomainChange = (domain: { x: DomainTuple; y: DomainTuple }) => {
        setZoomedXDomain(domain.x as Tuple<Date>)
    }

    const filteredData = useMemo(() => {
        const filtered = data.filter((d) => d[0] >= zoomedXDomain[0] && d[0] <= zoomedXDomain[1])

        if (filtered.length > maxPoints) {
            const k = Math.ceil(filtered.length / maxPoints)
            return filtered.filter((d, i) => i % k === 0)
        }

        return filtered
    }, [zoomedXDomain, data])

    const filteredYDomain = useMemo<Tuple<number>>(() => {
        return [0, Math.max(4, ...filteredData.map((d) => d[1] + 1))]
    }, [filteredData])

    const handleJumpToDate = (date: DateTime) => {
        setZoomedXDomain([date.toJSDate(), date.plus({ hours: 24 }).toJSDate()] as Tuple<Date>)
    }

    return (
        <>
            <Box sx={{ height: '400px' }}>
                <JumpToDate onSubmit={handleJumpToDate} />
                <VictoryChart
                    height={400}
                    domain={{ ...domain, y: filteredYDomain }}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDomain={{ x: zoomedXDomain }}
                            zoomDimension="x"
                            onZoomDomainChange={onZoomDomainChange}
                            minimumZoom={{ x: 15 * (1000 * 60) }}
                        />
                    }>
                    <VictoryLine x={0} y={1} data={filteredData} />
                    <VictoryLine
                        style={{
                            data: { strokeDasharray: '2 2', strokeWidth: 1, stroke: '#c43a31' }
                        }}
                        data={[
                            { x: now.toJSDate(), y: 0 },
                            { x: now.toJSDate(), y: 5 }
                        ]}
                    />
                </VictoryChart>
            </Box>
            <Box sx={{ marginTop: '2em' }}>Current IOB {Math.round(IOB * 10) / 10}</Box>
        </>
    )
}
