import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DateTime, DurationLike } from 'luxon'
import { useSelector } from 'react-redux'
import { IRootState } from './store'
import { useMemo } from 'react'

const useIOB = (start: DateTime, end: DateTime) => {
    const bolusInjectionArray = useSelector((state: IRootState) => {
        // filter entries that are too far away in future or past
        return state.bolusReducer.filter((bolus) => {
            const bolusDatetime = DateTime.fromISO(bolus.datetime)
            return Math.abs(bolusDatetime.diff(start, 'hours').toObject().hours) <= 36
        })
    })

    const IOB = (t: number) => {
        if (t < 0) return 0
        else {
            const divider = -55 * Math.exp(-0 / 55) * (55 + 0)
            const iob = (-55 * Math.exp(-t / 55) * (55 + t)) / divider
            if (iob < 0.001) return 0
            else return iob
        }
    }

    const dateRange = (start: DateTime, end: DateTime, interval: DurationLike) => {
        const arr = []
        let cursor = start
        while (cursor < end) {
            arr.push(cursor)
            cursor = cursor.plus(interval)
        }
        return arr
    }

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

    const range = dateRange(start, end, { minutes: 1 })

    const consolidatedIOB = useMemo(() => {
        // for each minute of the day, calculate IOB separately for every bolus injection
        // then sum them together in order to get the consolidated IOB
        return range.map((datetime) => {
            const IOBArray = bolusInjectionArray.map((bolusInjection) => {
                const diff = datetime
                    .diff(DateTime.fromISO(bolusInjection.datetime), 'minutes')
                    .toObject().minutes
                const scale = bolusInjection.bolus
                return IOB(diff) * scale
            })
            return {
                datetime: datetime.toJSDate(),
                IOB: sum(IOBArray)
            }
        })
    }, [bolusInjectionArray])

    return [consolidatedIOB]
}

export const IOBPlot = ({ date }: { date: DateTime }) => {
    const start = date.set({ second: 0, millisecond: 0, minute: 0, hour: 0 })
    const end = start.plus({ hours: 24 })
    const [consolidatedIOB] = useIOB(start, end)

    const formatDate = (date: Date) =>
        DateTime.fromJSDate(date).toLocaleString({
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'short'
        })

    return (
        <ResponsiveContainer width={'100%'} height={'30%'}>
            <LineChart
                width={730}
                height={250}
                data={consolidatedIOB}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                    scale="time"
                    dataKey="datetime"
                    tickFormatter={formatDate}
                    interval={60 * 3 - 1}
                />
                <YAxis />
                <Tooltip
                    cursor={false}
                    formatter={(value: number) => Math.round(value * 100) / 100}
                    labelFormatter={formatDate}
                />
                <Line
                    type="basis"
                    isAnimationActive={false}
                    dot={false}
                    dataKey="IOB"
                    stroke="#8884d8"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
