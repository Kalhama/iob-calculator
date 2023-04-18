import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import { IRootState } from '../store'
import { CarbsMap } from '../store/reducers/carbs'
import { useCOBCurve } from './useCOBCurve'
import { useIOBCurve } from './useIOBCurve'

export const useBloodGlucosePrediction = (
    bloodGlucose: number,
    bolusMap: Map<number, number>,
    carbsMap: CarbsMap
): Map<number, number> => {
    const { adjustmentRate: insulinSensitivity, carbRate } = useSelector(
        (state: IRootState) => state.settings
    )

    const nowEpoch = DateTime.now().toUnixInteger()

    const IOB = useIOBCurve(bolusMap)

    // filter IOB
    for (const key of IOB.keys()) {
        if (key < nowEpoch) IOB.delete(key)
    }

    const COB = useCOBCurve(carbsMap)

    // filter COB
    for (const key of COB.keys()) {
        if (key < nowEpoch) COB.delete(key)
    }

    // create range for prediction
    const predictionRange = [...IOB.keys()]
    const start = predictionRange[0]

    // map for preidctions
    const predictionMap = new Map<number, number>()

    // create prediction for every range element
    predictionRange.forEach((epoch) => {
        const insulinEffect = (IOB.get(epoch) - IOB.get(start)) * insulinSensitivity
        // TODO are we absolutely sure that COB has got the same data keys than IOB? if not this fails
        const carbEffect = ((COB.get(start) - COB.get(epoch)) / carbRate) * insulinSensitivity
        const prediction = insulinEffect + carbEffect + bloodGlucose

        predictionMap.set(epoch, prediction)
    })

    return predictionMap
}
