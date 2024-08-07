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
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useIOBNow } from '../hooks/useIOBNow'
import { IRootState } from '../store'
import SendIcon from '@mui/icons-material/Send'
import { InputBolusDialog } from './InputBolusDialog'
import { selectBolusAsMap } from '../store/reducers/bolus'
import React from 'react'
import { useEffect } from 'react'

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

const RandomLocationGenerator = () => {
    const sides = ['left', 'right']
    const horizontally = ['right', 'middle', 'left']
    const vertically = ['top', 'middle', 'bottom']

    const getRandomElement = (array: Array<unknown>) =>
        array[Math.floor(Math.random() * array.length)]

    const getRandomString = () =>
        `${getRandomElement(sides)} ${getRandomElement(horizontally)} ${getRandomElement(
            vertically
        )}`

    const [randomString, setRandomString] = useState(getRandomString())

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRandomString(getRandomString())
        }, 60000) // Update every 60000ms (1 minute)

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div>
            <p>Random location: {randomString}</p>
        </div>
    )
}

export const InsulinCalculator = () => {
    const {
        carbRate,
        adjustmentRate,
        IOBOffset,
        targetBloodGlucose: targetBloodGlucoseDefault
    } = useSelector((state: IRootState) => state.settings)

    const [bloodGlucose, setBloodGlucose] = useState('7')
    const [targetBloodGlucose, setTargetBloodGlucose] = useState(targetBloodGlucoseDefault || '7')
    const [mealCarbohydrates, setMealCarbohydrates] = useState('0')
    const bolusMap = useSelector(selectBolusAsMap)
    const IOB = useIOBNow(bolusMap)

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
            <RandomLocationGenerator />
        </>
    )
}
