import { TextField } from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIOB } from '../hooks/useIOB'
import { IRootState } from '../store'
import { addBolus } from '../store/reducers/bolus'

const numToStr = (num: number): string => (Math.round(num * 10) / 10).toFixed(1)

export const InsulinCalculator = () => {
    const { carbRate, adjustmentRate, IOBOffset } = useSelector(
        (state: IRootState) => state.settings
    )

    const [bloodGlucose, setBloodGlucose] = useState('7')
    const [targetBloodGlucose, setTargetBloodGlucose] = useState('7')
    const [mealCarbohydrates, setMealCarbohydrates] = useState('0')
    const IOB = useIOB(DateTime.now())
    const dispatch = useDispatch()

    const adjustmentInsulin =
        bloodGlucose !== ''
            ? (Number(bloodGlucose) - Number(targetBloodGlucose)) / adjustmentRate
            : NaN
    const mealInsulin = Number(mealCarbohydrates) / carbRate
    const totalInsulin = adjustmentInsulin + mealInsulin - IOB + IOBOffset

    return (
        <>
            <TextField
                label="Blood Glucose"
                type="number"
                value={bloodGlucose === undefined ? '' : bloodGlucose}
                onChange={(e) => setBloodGlucose(e.target.value)}
                InputLabelProps={{
                    shrink: true
                }}
                variant="standard"
            />
            <TextField
                label="Target Blood Glucose"
                type="number"
                value={targetBloodGlucose}
                onChange={(e) => setTargetBloodGlucose(e.target.value)}
                InputLabelProps={{
                    shrink: true
                }}
                variant="standard"
            />
            <TextField
                label="Meal carbohydrates"
                type="number"
                value={mealCarbohydrates}
                onChange={(e) => setMealCarbohydrates(e.target.value)}
                InputLabelProps={{
                    shrink: true
                }}
                variant="standard"
            />
            <table>
                <tbody>
                    <tr>
                        <td>meal insulin</td>
                        <td>{numToStr(mealInsulin)}</td>
                        <td>Amount of insulin to compensate carbs from food</td>
                    </tr>
                    <tr>
                        <td>+adjustment insulin</td>
                        <td>{isNaN(adjustmentInsulin) ? 'N/A' : numToStr(adjustmentInsulin)}</td>
                        <td>Amount of insulin to get the blood glucose to the desired level</td>
                    </tr>
                    <tr>
                        <td>-Insulin on body</td>
                        <td>{numToStr(IOB)}</td>
                        <td>Insulin already active on your body</td>
                    </tr>
                    <tr>
                        <td>+IOB offset</td>
                        <td>{numToStr(IOBOffset)}</td>
                        <td>Some residual bolus insulin usually acts as long term insulin</td>
                    </tr>
                    <tr>
                        <td>Total:</td>
                        <td>{isNaN(totalInsulin) ? 'N/A' : numToStr(totalInsulin)}</td>
                    </tr>
                </tbody>
            </table>

            {totalInsulin > 0.9 ? (
                <button
                    onClick={() =>
                        dispatch(
                            addBolus({
                                bolus: Math.round(totalInsulin * 2) / 2,
                                datetime: DateTime.now().minus({ minute: 1 })
                            })
                        )
                    }>
                    Add {Math.round(totalInsulin * 2) / 2} bolus now
                </button>
            ) : null}
        </>
    )
}
