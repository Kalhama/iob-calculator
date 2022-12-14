import _ from 'lodash'
import { useMemo } from 'react'
import { insulinOnBody } from '../FiaspModel'

/**
 *
 * @param epochToBolusMap Map where key is epoch in seocnds rounded to closest minute and value is amount of bolus
 * @returns Map where key is epoch in seocnds rounded to closest minute and value is IOB at that epoch
 */
export const useIOBCurve = (epochToBolusMap: Map<number, number>) => {
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
