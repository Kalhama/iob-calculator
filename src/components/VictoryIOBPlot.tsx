import { Box } from '@mui/material'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { DomainTuple, VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory'
import { useIOBCurve, useIOB } from '../hooks/useIOB'
import { InputBolusFab } from './InputBolusFab'
import { JumpToDate } from './JumpToDate'
import { Tuple } from '../types'

const maxPoints = 240

export const VictoryIOBPlot = () => {
    const [data, domain] = useIOBCurve()
    const IOB = useIOB(DateTime.now())

    return (
        <>
            <Box sx={{ height: '400px' }}>
                <Graph data={data} domain={domain} />
            </Box>
            <Box>Current IOB {Math.round(IOB * 10) / 10}</Box>
            <InputBolusFab />
        </>
    )
}

interface IProps {
    data: {
        x: Date
        y: number
    }[]
    domain: {
        x: Tuple<Date>
        y: Tuple<number>
    }
}

export const Graph = ({ data, domain }: IProps) => {
    const initialXDomain = [
        DateTime.now().minus({ hours: 3 }).toJSDate(),
        DateTime.now().plus({ hours: 3 }).toJSDate()
    ] as Tuple<Date>
    const [zoomedXDomain, setZoomedXDomain] = useState(initialXDomain)

    const onDomainChange = (domain: { x: DomainTuple; y: DomainTuple }) => {
        setZoomedXDomain(domain.x as Tuple<Date>)
    }

    const filteredData = useMemo(() => {
        const filtered = data.filter((d) => d.x >= zoomedXDomain[0] && d.x <= zoomedXDomain[1])

        if (filtered.length > maxPoints) {
            const k = Math.ceil(filtered.length / maxPoints)
            return filtered.filter((d, i) => i % k === 0)
        }

        return filtered
    }, [zoomedXDomain, data])

    const filteredYDomain = useMemo<Tuple<number>>(() => {
        return [0, Math.max(4, _.maxBy(filteredData, (d) => d.y).y + 1)]
    }, [filteredData])

    const handleJumpToDate = (date: DateTime) => {
        setZoomedXDomain([date.toJSDate(), date.plus({ hours: 24 }).toJSDate()] as Tuple<Date>)
    }

    return (
        <>
            <JumpToDate onSubmit={handleJumpToDate} />
            <VictoryChart
                height={400}
                domain={{ ...domain, y: filteredYDomain }}
                containerComponent={
                    <VictoryZoomContainer
                        zoomDomain={{ x: zoomedXDomain }}
                        zoomDimension="x"
                        onZoomDomainChange={onDomainChange}
                        minimumZoom={{ x: 15 * (1000 * 60) }}
                    />
                }>
                <VictoryLine data={filteredData} />
                <VictoryLine
                    style={{
                        data: { strokeDasharray: '2 2', strokeWidth: 1, stroke: '#c43a31' }
                    }}
                    data={[
                        { x: new Date(), y: domain.y[0] },
                        { x: new Date(), y: domain.y[1] + 1 }
                    ]}
                />
            </VictoryChart>
        </>
    )
}
