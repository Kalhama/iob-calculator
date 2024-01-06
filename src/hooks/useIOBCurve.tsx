import _ from 'lodash'
import { useMemo } from 'react'
import { insulinOnBody, insulinEffect } from '../FiaspModel'

const calculateInsulinCurve = (
    epochToBolusMap: Map<number, number>,
    insulinFunction: insulinFunction
) => {
    const insulinCurve = new Map<number, number>()

    epochToBolusMap.forEach((bolus, epoch) => {
        Array.from({ length: 500 }).forEach((_, i) => {
            const epochKey = epoch + i * 60 // Assuming epoch is already rounded to the nearest minute

            insulinCurve.set(
                epochKey,
                insulinFunction(i, bolus) + (insulinCurve.get(epochKey) || 0)
            )
        })
    })

    return insulinCurve
}

const fillZeroParts = (insulinCurve: Map<number, number>, epochToBolusMap: Map<number, number>) => {
    const domain = [
        Math.min(...epochToBolusMap.keys(), new Date().valueOf() / 1000) - 60 * 60 * 3, // 3 hours before first
        Math.max(...epochToBolusMap.keys(), new Date().valueOf() / 1000) + 60 * 60 * 6 // 6 hours since last
    ]
    const range = _.range(domain[0], domain[1], 60)

    range.forEach((epoch) => {
        insulinCurve.set(epoch, insulinCurve.get(epoch) || 0)
    })
}

type insulinFunction = (i: number, bolus: number) => number

/**
 * @param epochToBolusMap Map where key is epoch in seconds rounded to closest minute and value is the amount of bolus
 * @param from Start of the time filter
 * @param to End of the time filter
 * @param insulinFunction Function to calculate the insulin effect or on-body effect
 * @returns Map where key is epoch in seconds rounded to closest minute and value is the insulin effect at that epoch
 */
const useInsulinCurve = (
    epochToBolusMap: Map<number, number>,
    insulinFunction: insulinFunction
) => {
    return useMemo(() => {
        const insulinCurve = calculateInsulinCurve(epochToBolusMap, insulinFunction)

        fillZeroParts(insulinCurve, epochToBolusMap)

        return insulinCurve
    }, [epochToBolusMap])
}

/**
 * @param epochToBolusMap Map where key is epoch in seconds rounded to closest minute and value is the amount of bolus
 * @param from Start of the time filter
 * @param to End of the time filter
 * @returns Map where key is epoch in seconds rounded to closest minute and value is IOB at that epoch
 */
export const useIOBCurve = (epochToBolusMap: Map<number, number>) => {
    return useInsulinCurve(epochToBolusMap, insulinOnBody)
}

/**
 * @param epochToBolusMap Map where key is epoch in seconds rounded to closest minute and value is the amount of bolus
 * @param from Start of the time filter
 * @param to End of the time filter
 * @returns Map where key is epoch in seconds rounded to closest minute and value is the insulin effect at that epoch
 */
export const useInsulinEffectCurve = (epochToBolusMap: Map<number, number>) => {
    return useInsulinCurve(epochToBolusMap, insulinEffect)
}
