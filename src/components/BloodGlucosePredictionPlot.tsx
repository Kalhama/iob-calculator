import { Box, TextField } from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { VictoryChart, VictoryLine } from 'victory'
import { Tuple } from '../types'
import { useSelector } from 'react-redux'
import { useBloodGlucosePrediction } from '../hooks/useBloodGlucosePrediction'
import { selectBolusAsMap } from '../store/reducers/bolus'

export const BloodGlucosePredictionPlot = () => {
    const [bloodGlucose, setBloodGlucose] = useState('7')
    const bolusMap = useSelector(selectBolusAsMap)
    const data = useBloodGlucosePrediction(Number(bloodGlucose || '7'), bolusMap)
    const dataArr = Array.from(data).map(([key, value]) => {
        return [DateTime.fromSeconds(key).toJSDate(), value] as [Date, number]
    })

    const domain = (() => {
        const now = DateTime.now()
        const minDate = now.toJSDate()
        const maxDate = now.plus({ hours: 3 }).toJSDate()
        const values = dataArr.map((d) => d[1])
        const maxValue = Math.max(...values)

        return {
            x: [minDate, maxDate] as Tuple<Date>,
            y: [0, maxValue + 1 || 10] as Tuple<number>
        }
    })()

    return (
        <>
            <Box sx={{ height: '400px' }}>
                <TextField
                    id="standard-number"
                    label="Number"
                    type="number"
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    InputLabelProps={{
                        shrink: true
                    }}
                    variant="standard"
                    autoFocus
                />
                <Graph data={dataArr} domain={domain} />
            </Box>
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
    return (
        <>
            <VictoryChart height={400} domain={domain}>
                <VictoryLine
                    x={0}
                    y={1}
                    data={data}
                    style={{
                        data: { strokeDasharray: '2 2', strokeWidth: 1 }
                    }}
                />
            </VictoryChart>
        </>
    )
}
