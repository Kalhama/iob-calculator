import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { selectBolusBetween } from '../store/reducers/bolus'
import { IRootState } from '../store'
import _ from 'lodash'
import { getPercentageEffect } from '../FiaspModel'
import { Tuple } from '../types'
import { dateRange } from '../utils/dateRange'

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
                IOB: _.sum(IOBArray)
            }
        })
    }, [bolusInjectionArray])

    return [consolidatedIOB]
}

export const useIOBCurve = (): [
    IOBCurve: Array<{ x: Date; y: number }>,
    domain: { x: Tuple<Date>; y: Tuple<number> }
] => {
    const bolusData = useSelector((state: IRootState) => state.bolusReducer).map((b) => {
        return {
            ...b,
            datetime: DateTime.fromISO(b.datetime)
        }
    })

    const XDomain = useMemo(() => {
        const lastBolus = _.maxBy(bolusData, (d) => d.datetime).datetime
        const last = DateTime.max(lastBolus.plus({ hours: 6 }), DateTime.now().plus({ hours: 6 }))
        const firstDatetime = _.minBy(bolusData, (d) => d.datetime).datetime
        return [firstDatetime.minus({ hours: 3 }).toJSDate(), last.toJSDate()] as Tuple<Date>
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
                const diff =
                    (datetime.toUnixInteger() - bolusInjection.datetime.toUnixInteger()) / 60
                const scale = bolusInjection.bolus

                return getPercentageEffect(diff) * scale
            })
            return {
                x: datetime.toJSDate(),
                y: _.sum(IOBArray)
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
