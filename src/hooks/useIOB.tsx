import { DateTime, DurationLike } from 'luxon'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { selectBolusBetween } from '../store/reducers/bolus'

export const useIOBCurve = (start: DateTime, end: DateTime) => {
    const bolusInjectionArray = useSelector(selectBolusBetween(start.minus({ hours: 24 }), end))

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

export const useIOB = (date: DateTime) => {
    const [IOBCurve] = useIOBCurve(date.minus({ hours: 1 }), date)
    if (IOBCurve.length === 0) return 0
    else return IOBCurve[IOBCurve.length - 1].IOB
}
