import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBolus } from '../store/reducers/bolus'
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

interface IProps {
    prefilledBolus?: number
    setOpen: (val: boolean) => unknown
    open: boolean
}

export const InputBolusDialog = ({ prefilledBolus, open, setOpen }: IProps) => {
    useEffect(() => {
        if (open) {
            setDatetime(DateTime.now())
            setBolus(prefilledBolus === undefined ? '0' : String(prefilledBolus))
        }
    }, [open])

    const [datetime, setDatetime] = useState(DateTime.now())
    const [bolus, setBolus] = useState(prefilledBolus === undefined ? '0' : String(prefilledBolus))
    const dispatch = useDispatch()

    const handleSubmit = () => {
        if (bolus === '0') return
        dispatch(
            addBolus({
                datetime: datetime,
                bolus: Number(bolus)
            })
        )

        setOpen(false)
    }

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Insert bolus</DialogTitle>
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
                            label="Number"
                            type="number"
                            value={bolus}
                            onChange={(e) => setBolus(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="standard"
                            autoFocus
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
