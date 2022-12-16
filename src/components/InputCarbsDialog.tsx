import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack
} from '@mui/material'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { addCarbs } from '../store/reducers/carbs'

interface IProps {
    prefilledCarbs?: number
    prefilledAbsorptionLength?: number
    setOpen: (val: boolean) => unknown
    open: boolean
}

export const InputCarbsDialog = ({
    prefilledCarbs,
    prefilledAbsorptionLength,
    open,
    setOpen
}: IProps) => {
    useEffect(() => {
        if (open) {
            setDatetime(DateTime.now())
            setCarbs(prefilledCarbs === undefined ? '0' : String(prefilledCarbs))
        }
    }, [open])

    const [datetime, setDatetime] = useState(DateTime.now())
    const [carbs, setCarbs] = useState(prefilledCarbs === undefined ? '0' : String(prefilledCarbs))
    const [absorptionLength, setAbsorptionLength] = useState(
        prefilledAbsorptionLength === undefined ? '0' : String(prefilledAbsorptionLength)
    )

    const dispatch = useDispatch()

    const handleSubmit = () => {
        if (carbs === '0') return
        dispatch(
            addCarbs({
                datetime: datetime,
                carbs: Number(carbs),
                absorptionLength: Number(absorptionLength)
            })
        )

        setOpen(false)
    }

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Insert carbs</DialogTitle>
                <DialogContent>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                        <LocalizationProvider dateAdapter={AdapterLuxon}>
                            <MobileTimePicker
                                label="Time"
                                value={datetime}
                                onChange={setDatetime}
                                renderInput={(params) => (
                                    <TextField variant="standard" {...params} />
                                )}
                            />
                        </LocalizationProvider>
                        <TextField
                            id="standard-number"
                            label="Carbohydrates"
                            type="number"
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="standard"
                            autoFocus
                        />
                        <TextField
                            id="standard-number"
                            label="Absorption length (min)"
                            type="number"
                            value={absorptionLength}
                            onChange={(e) => setAbsorptionLength(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="standard"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
