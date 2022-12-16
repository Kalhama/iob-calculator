import { BloodGlucosePredictionPlot } from './BloodGlucosePredictionPlot'
import { COBPlot } from './COBPlot'
import { InputBolusFab } from './InputBolusFab'
import { IOBPlot } from './IOBPlot'

export const Overview = () => {
    return (
        <>
            <IOBPlot />
            <BloodGlucosePredictionPlot />
            <COBPlot />
            <InputBolusFab />
        </>
    )
}
