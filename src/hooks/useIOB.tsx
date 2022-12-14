import _ from 'lodash'
import { DateTime } from 'luxon'
import { useMemo } from 'react'
import { insulinEffect, insulinOnBody } from '../FiaspModel'
import { IRootState } from '../store'
import { useNow } from './useNow'

/**
 *
 * @returns bolus in Map format where key is epoch in seconds rounded to closest minute and value is amount of bolus
 */
export const selectBolusAsMap = ({ bolusReducer }: IRootState): Map<number, number> => {
    const arrayFormat = bolusReducer.map((b) => {
        // TODO should we have dates rounded already in redux?
        const epoch = Math.round(DateTime.fromISO(b.datetime).toSeconds() / 60) * 60
        return [epoch, b.bolus] as [number, number]
    })
    return new Map(arrayFormat)
}

/**
 *
 * @param epochToBolusMap Map where key is epoch in seocnds rounded to closest minute and value is amount of bolus
 * @returns Map where key is epoch in seconds rounded to closest minute and value is amount of bolus wear off during the minute
 */
export const useEpochToInsulinEffect = (epochToBolusMap: Map<number, number>) => {
    return useMemo(() => {
        const consolidatedInsulinEffect = new Map<number, number>()
        epochToBolusMap.forEach((bolus, epoch) => {
            _.range(0, 500).forEach((i) => {
                // olettaen, että epoch on pyöristetty oikein jo valmiiksi minuuttiin
                const epochKey = epoch + i * 60
                consolidatedInsulinEffect.set(
                    epochKey,
                    insulinEffect(i, bolus) + (consolidatedInsulinEffect.get(epochKey) || 0)
                )
            })
        })

        return consolidatedInsulinEffect
    }, [epochToBolusMap])
}

/**
 *
 * @param epochToBolusMap Map where key is epoch in seocnds rounded to closest minute and value is amount of bolus
 * @returns Map where key is epoch in seocnds rounded to closest minute and value is IOB at that epoch
 */
export const useEpochToIOB = (epochToBolusMap: Map<number, number>) => {
    return useMemo(() => {
        // non zero parts of the function
        const insulinOnBoard = new Map<number, number>()
        epochToBolusMap.forEach((bolus, epoch) => {
            _.range(0, 500).forEach((i) => {
                // olettaen, että epoch on pyöristetty oikein jo valmiiksi minuuttiin
                const epochKey = epoch + i * 60
                insulinOnBoard.set(
                    epochKey,
                    insulinOnBody(i, bolus) + (insulinOnBoard.get(epochKey) || 0)
                )
            })
        })

        // zero parts of the function
        const domain = [
            Math.min(...epochToBolusMap.keys()) - 60 * 60 * 3,
            Math.max(...epochToBolusMap.keys()) + 60 * 60 * 6
        ]
        const range = _.range(domain[0], domain[1], 60)
        range.forEach((epoch) => {
            insulinOnBoard.set(epoch, insulinOnBoard.get(epoch) || 0)
        })

        return insulinOnBoard
    }, [epochToBolusMap])
}

// TODO move to somewhere else

/**
 * Insulin on Board (IOB)
 * @param epochToBolusMap Map where key is epoch in seocnds rounded to closest minute and value is amount of bolus
 * @returns IOB at current time
 */
export const useIOB = (epochToBolusMap: Map<number, number>) => {
    const now = useNow(60)
    const nowUnixInteger = Math.round(now.toUnixInteger() / 60) * 60
    const IOBCurve = useEpochToIOB(epochToBolusMap)
    const IOBNow = Array.from(IOBCurve).find((el) => el[0] === nowUnixInteger)[1]
    return IOBNow
}
