import { BloodGlucosePredictionPlot } from './BloodGlucosePredictionPlot'
import { InputBolusFab } from './InputBolusFab'
import { IOBPlot } from './IOBPlot'

export const Overview = () => {
    return (
        <>
            <IOBPlot />
            <InputBolusFab />
            <BloodGlucosePredictionPlot />
        </>
    )
}