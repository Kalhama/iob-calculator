import _ from 'lodash'
import { useMemo } from 'react'
import { CarbsMap } from '../store/reducers/carbs'

const carbsOnBody = (t: number, carbs: number, absorptionLength: number) => {
    if (t > absorptionLength) return 0
    else if (t < 0) return 0
    else return (1 - t / absorptionLength) * carbs
}

export const useCOBCurve = (epochToCarbsMap: CarbsMap) => {
    return useMemo(() => {
        // non zero parts of the function
        const carbsOnBoard = new Map<number, number>()
        epochToCarbsMap.forEach(({ carbs, absorptionLength }, epoch) => {
            _.range(0, 500).forEach((i) => {
                // olettaen, että epoch on pyöristetty oikein jo valmiiksi minuuttiin
                const epochKey = epoch + i * 60
                carbsOnBoard.set(
                    epochKey,
                    carbsOnBody(i, carbs, absorptionLength) + (carbsOnBoard.get(epochKey) || 0)
                )
            })
        })

        // zero parts of the function
        const domain = [
            Math.min(...epochToCarbsMap.keys(), new Date().valueOf() / 1000) - 60 * 60 * 3,
            Math.max(...epochToCarbsMap.keys(), new Date().valueOf() / 1000) + 60 * 60 * 6
        ]
        const range = _.range(domain[0], domain[1], 60)
        range.forEach((epoch) => {
            carbsOnBoard.set(epoch, carbsOnBoard.get(epoch) || 0)
        })

        return carbsOnBoard
    }, [epochToCarbsMap])
}
