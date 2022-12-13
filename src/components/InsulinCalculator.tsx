import {
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useIOB } from '../hooks/useIOB'
import { IRootState } from '../store'
import SendIcon from '@mui/icons-material/Send'
import { InputBolusDialog } from './InputBolusDialog'

const numToStr = (num: number): string => (Math.round(num * 10) / 10).toFixed(1)
interface IProps {
    totalInsulin: number
}

const AddBolusSuggestionButton = ({ totalInsulin }: IProps) => {
    if (totalInsulin < 0.9) return null

    const [open, setOpen] = useState(false)
    const rounded = Math.round(totalInsulin * 2) / 2

    return (
        <>
            <Button endIcon={<SendIcon />} variant="contained" onClick={() => setOpen(true)}>
                Click to add {rounded} bolus
            </Button>
            <InputBolusDialog open={open} setOpen={setOpen} prefilledBolus={rounded} />
        </>
    )
}

export const InsulinCalculator = () => {
    const { carbRate, adjustmentRate, IOBOffset } = useSelector(
        (state: IRootState) => state.settings
    )

    const [bloodGlucose, setBloodGlucose] = useState('7')
    const [targetBloodGlucose, setTargetBloodGlucose] = useState('7')
    const [mealCarbohydrates, setMealCarbohydrates] = useState('0')
    const IOB = useIOB(DateTime.now())

    const adjustmentInsulin: number =
        bloodGlucose !== ''
            ? (Number(bloodGlucose) - Number(targetBloodGlucose)) / adjustmentRate
            : NaN
    const mealInsulin = Number(mealCarbohydrates) / carbRate
    const totalInsulin = adjustmentInsulin + mealInsulin - IOB + IOBOffset

    return (
        <>
            <Paper className="page">
                <Box className="container">
                    <Typography variant="h1">Calculator</Typography>
                    <Stack direction="column" justifyContent="left" alignItems="left" spacing={2}>
                        <TextField
                            label="Blood Glucose"
                            type="number"
                            value={bloodGlucose === undefined ? '' : bloodGlucose}
                            onChange={(e) => setBloodGlucose(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            required
                            autoFocus
                        />
                        <TextField
                            label="Target Blood Glucose"
                            type="number"
                            value={targetBloodGlucose}
                            onChange={(e) => setTargetBloodGlucose(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Meal carbohydrates"
                            type="number"
                            value={mealCarbohydrates}
                            onChange={(e) => setMealCarbohydrates(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                        />
                    </Stack>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Factor</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Info</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Add: Meal insulin</TableCell>
                            <TableCell>{numToStr(mealInsulin)}</TableCell>
                            <TableCell>Amount of insulin to compensate carbs from food</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Add: Adjustment insulin</TableCell>
                            <TableCell>
                                {isNaN(adjustmentInsulin) ? 'N/A' : numToStr(adjustmentInsulin)}
                            </TableCell>
                            <TableCell>
                                Amount of insulin to get the blood glucose to the desired level
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Add: IOB offset</TableCell>
                            <TableCell>{numToStr(IOBOffset)}</TableCell>
                            <TableCell>
                                Some residual bolus insulin usually acts as basal insulin
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Reduce: Insulin on body</TableCell>
                            <TableCell>{numToStr(IOB)}</TableCell>
                            <TableCell>Insulin already active on your body</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Total:</TableCell>
                            <TableCell>
                                {isNaN(totalInsulin) ? 'N/A' : numToStr(totalInsulin)}
                            </TableCell>

                            <TableCell>
                                <AddBolusSuggestionButton totalInsulin={totalInsulin} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </>
    )
}
