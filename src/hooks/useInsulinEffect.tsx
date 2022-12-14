import _ from 'lodash'
import { useMemo } from 'react'
import { insulinEffect } from '../FiaspModel'

/**
 *
 * @param epochToBolusMap Map where key is epoch in seocnds rounded to closest minute and value is amount of bolus
 * @returns Map where key is epoch in seconds rounded to closest minute and value is amount of bolus wear off during the minute
 */
export const useInsulinEffect = (epochToBolusMap: Map<number, number>) => {
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
