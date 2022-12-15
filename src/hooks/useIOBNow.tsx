import { useIOBCurve } from './useIOBCurve'
import { useNow } from './useNow'

/**
 * Insulin on Board (IOB)
 * @param epochToBolusMap Map where key is epoch in seocnds rounded to closest minute and value is amount of bolus
 * @returns IOB at current time
 */
export const useIOBNow = (epochToBolusMap: Map<number, number>) => {
    const now = useNow(60)
    const nowUnixInteger = Math.round(now.toUnixInteger() / 60) * 60
    const IOBCurve = useIOBCurve(epochToBolusMap)
    const IOBNow = IOBCurve.get(nowUnixInteger) || 0
    return IOBNow
}
