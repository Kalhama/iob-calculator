import { DateTime, DurationLike } from 'luxon'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { selectBolusBetween } from '../store/reducers/bolus'
import { IRootState } from '../store'
import _ from 'lodash'
import { getPercentageEffect } from '../FiaspModel'

export declare type Tuple<T> = [T, T]

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

// TODO replace https://stackoverflow.com/a/74359688
const dateRange = (start: DateTime, end: DateTime, interval: DurationLike) => {
    const arr = []
    let cursor = start
    while (cursor <= end) {
        arr.push(cursor)
        cursor = cursor.plus(interval)
    }
    return arr
}

const IOB = (t: number) => {
    if (t < 0) return 0
    const divider = -55 * Math.exp(-0 / 55) * (55 + 0)
    const iob = (-55 * Math.exp(-t / 55) * (55 + t)) / divider
    return iob
}

export const useIOBCurveLegacy = (start: DateTime, end: DateTime) => {
    const bolusInjectionArray = useSelector(selectBolusBetween(start.minus({ hours: 24 }), end))

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

export const useIOBCurve = (): [
    IOBCurve: Array<{ x: Date; y: number }>,
    domain: { x: Tuple<Date>; y: Tuple<number> }
] => {
    const bolusData = useSelector((state: IRootState) => state.bolusReducer)

    const XDomain = useMemo(() => {
        const lastBolus = _.maxBy(bolusData, (d) => DateTime.fromISO(d.datetime)).datetime
        const last = DateTime.max(
            DateTime.fromISO(lastBolus).plus({ hours: 6 }),
            DateTime.now().plus({ hours: 6 })
        )
        const firstDatetime = _.minBy(bolusData, (d) => DateTime.fromISO(d.datetime)).datetime
        return [
            DateTime.fromISO(firstDatetime).minus({ hours: 3 }).toJSDate(),
            last.toJSDate()
        ] as Tuple<Date>
    }, [bolusData])

    const range = useMemo(() => {
        return dateRange(DateTime.fromJSDate(XDomain[0]), DateTime.fromJSDate(XDomain[1]), {
            minutes: 1
        })
    }, [XDomain])

    const IOBCurve = useMemo(() => {
        // for each minute of the day, calculate IOB separately for every bolus injection
        // then sum them together in order to get the consolidated IOB
        return range.map((datetime) => {
            const IOBArray = bolusData.map((bolusInjection) => {
                const diff = datetime
                    .diff(DateTime.fromISO(bolusInjection.datetime), 'minutes')
                    .toObject().minutes
                const scale = bolusInjection.bolus

                return getPercentageEffect(diff) * scale
            })
            return {
                x: datetime.toJSDate(),
                y: sum(IOBArray)
            }
        })
    }, [bolusData])

    const YDomain = useMemo((): Tuple<number> => {
        const min = _.minBy(IOBCurve, (d) => d.y).y
        const max = _.maxBy(IOBCurve, (d) => d.y).y
        return [min, max]
    }, [IOBCurve])

    const domain = {
        x: XDomain,
        y: YDomain
    }

    return [IOBCurve, domain]
}

export const useIOB = (date: DateTime) => {
    const [IOBCurve] = useIOBCurveLegacy(date.minus({ hours: 1 }), date)
    if (IOBCurve.length === 0) return 0
    else return IOBCurve[IOBCurve.length - 1].IOB
}
