import { DateTime } from 'luxon'
import { useSelector } from 'react-redux'
import { IRootState } from '../store'
import { useIOBCurve } from './useIOBCurve'

export const useBloodGlucosePrediction = (
    bloodGlucose: number,
    bolusMap: Map<number, number>
): Map<number, number> => {
    const insulinSensitivity = useSelector((state: IRootState) => state.settings.adjustmentRate)

    const nowEpoch = DateTime.now().toUnixInteger()

    const IOB = useIOBCurve(bolusMap)

    // filter IOB
    for (const key of IOB.keys()) {
        if (key < nowEpoch) IOB.delete(key)
    }

    // create range for prediction
    const predictionRange = [...IOB.keys()]
    const start = predictionRange[0]

    // map for preidctions
    const predictionMap = new Map<number, number>()

    // create prediction for every range element
    predictionRange.forEach((epoch) => {
        const prediction = (IOB.get(epoch) - IOB.get(start)) * insulinSensitivity + bloodGlucose

        predictionMap.set(epoch, prediction)
    })

    return predictionMap
}
