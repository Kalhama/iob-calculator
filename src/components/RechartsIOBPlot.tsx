import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DateTime } from 'luxon'
import { useIOBCurveLegacy } from '../hooks/useIOB'

export const RechartsIOBPlot = ({ date }: { date: DateTime }) => {
    const start = date.set({ second: 0, millisecond: 0, minute: 0, hour: 0 })
    const end = start.plus({ hours: 24 })
    const [consolidatedIOB] = useIOBCurveLegacy(start, end)

    const formatDate = (date: Date) =>
        DateTime.fromJSDate(date).toLocaleString({
            hour: '2-digit',
            minute: '2-digit'
        })

    return (
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
    )
}
