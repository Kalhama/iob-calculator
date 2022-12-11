import { DateTime } from 'luxon'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBolus } from '../store/reducers/bolus'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
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

export const InputBolus = () => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)

    const [datetime, setDatetime] = useState(DateTime.now())
    const [bolus, setBolus] = useState('0')
    const dispatch = useDispatch()

    const handleSubmit = () => {
        if (bolus === '0') return
        dispatch(
            addBolus({
                datetime: datetime,
                bolus: Number(bolus)
            })
        )

        handleClose()
    }

    return (
        <>
            <Fab
                onClick={handleOpen}
                sx={{ position: 'fixed', right: '1em', bottom: '2em' }}
                color="primary"
                aria-label="add">
                <AddIcon />
            </Fab>
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Insert bolus</DialogTitle>
                    <DialogContent>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}>
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
                                focused
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}
