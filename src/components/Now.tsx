import { InputBolus } from './InputBolus'
import { DateTime } from 'luxon'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useIOBCurve } from '../hooks/useIOB'

export const Now = () => {
    const now = DateTime.now()

    const start = now.minus({ hours: 6 })
    const end = now.plus({ hours: 3 })
    const [consolidatedIOB] = useIOBCurve(start, end)

    const formatDate = (date: Date) =>
        DateTime.fromJSDate(date).toLocaleString({
            hour: '2-digit',
            minute: '2-digit'
        })

    return (
        <>
            <ResponsiveContainer width={'100%'} height={'85%'}>
                <LineChart data={consolidatedIOB}>
                    <XAxis
                        scale="time"
                        dataKey="datetime"
                        tickFormatter={formatDate}
                        interval={60 * 4 - 1}
                    />

                    <YAxis
                        domain={[
                            (dataMin: number) => Math.floor(dataMin),
                            (dataMax: number) => Math.max(Math.ceil(dataMax), 4)
                        ]}
                    />
                    <Tooltip
                        cursor={false}
                        formatter={(value: number) => Math.round(value * 100) / 100}
                        labelFormatter={formatDate}
                    />
                    <Line
                        type="linear"
                        isAnimationActive={false}
                        dot={false}
                        dataKey="IOB"
                        stroke="#413ea0"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
            <InputBolus />
        </>
    )
}
