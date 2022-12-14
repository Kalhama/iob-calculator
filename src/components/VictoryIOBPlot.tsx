import { Box } from '@mui/material'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { DomainTuple, VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory'
import { selectBolusAsMap, useEpochToIOB, useIOB } from '../hooks/useIOB'
import { useNow } from '../hooks/useNow'
import { InputBolusFab } from './InputBolusFab'
import { JumpToDate } from './JumpToDate'
import { Tuple } from '../types'
import { useSelector } from 'react-redux'

const maxPoints = 240

export const VictoryIOBPlot = () => {
    const bolusMap = useSelector(selectBolusAsMap)
    const data = useEpochToIOB(bolusMap)
    const IOB = useIOB(bolusMap)
    const dataArr = Array.from(data).map(([key, value]) => {
        return [DateTime.fromSeconds(key).toJSDate(), value] as [Date, number]
    })

    const domain = {
        x: [_.minBy(dataArr, (d) => d[0])[0], _.maxBy(dataArr, (d) => d[0])[0]] as Tuple<Date>,
        y: [_.minBy(dataArr, (d) => d[1])[1], _.maxBy(dataArr, (d) => d[1])[1]] as Tuple<number>
    }

    return (
        <>
            <Box sx={{ height: '400px' }}>
                <Graph data={dataArr} domain={domain} />
            </Box>
            <Box>Current IOB {Math.round(IOB * 10) / 10}</Box>
            <InputBolusFab />
        </>
    )
}

interface IProps {
    data: [Date, number][]
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
        return [0, Math.max(4, _.maxBy(filteredData, (d) => d[1])[1] + 1)]
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
        </>
    )
}
