import { Box } from '@mui/material'
import { DateTime } from 'luxon'
import { useEffect, useMemo, useState } from 'react'
import { VictoryChart, VictoryLine, VictoryZoomContainer } from 'victory'
import { useNow } from '../hooks/useNow'
import React from 'react'
import { Tuple } from '../types'

const maxPoints = 240

interface IProps {
    data: [Date, number][]
    dataDomain: {
        x: Tuple<Date>
        y: Tuple<number>
    }
    date: DateTime
}

export const ZoomableGraph = ({ data, dataDomain, date }: IProps) => {
    const now = useNow(60)

    const initialXDomain = [date.toJSDate(), date.plus({ hours: 3 }).toJSDate()] as Tuple<Date>
    const [xDomain, setXDomain] = useState(initialXDomain)

    // update zoom if date changes
    useEffect(() => {
        const xDomainDateTime = [DateTime.fromJSDate(xDomain[0]), DateTime.fromJSDate(xDomain[1])]

        const zoomDuration = xDomainDateTime[1].diff(xDomainDateTime[0])
        const newDomainStart = date
        const newDomainEnd = newDomainStart.plus(zoomDuration)
        setXDomain([newDomainStart.toJSDate(), newDomainEnd.toJSDate()])
    }, [date])

    const yDomain = useMemo(() => {
        const filteredData = data.filter((d) => d[0] >= xDomain[0] && d[0] <= xDomain[1])

        const yDomain = [0, Math.max(10, ...filteredData.map((d) => d[1] + 1))] as Tuple<number>

        return yDomain
    }, [xDomain, data])

    return (
        <>
            <Box sx={{ height: '400px' }}>
                <VictoryChart
                    height={400}
                    domain={dataDomain}
                    containerComponent={
                        <VictoryZoomContainer
                            zoomDomain={{ x: xDomain, y: yDomain }}
                            zoomDimension="x"
                            onZoomDomainChange={(domain) => setXDomain(domain.x as Tuple<Date>)}
                            minimumZoom={{ x: 15 * (1000 * 60) }}
                        />
                    }>
                    <VictoryLine x={0} y={1} data={data} />
                    <VictoryLine
                        style={{
                            data: { strokeDasharray: '2 2', strokeWidth: 1, stroke: '#c43a31' }
                        }}
                        data={[
                            { x: now.toJSDate(), y: yDomain[0] },
                            { x: now.toJSDate(), y: yDomain[1] }
                        ]}
                    />
                </VictoryChart>
            </Box>
        </>
    )
}
