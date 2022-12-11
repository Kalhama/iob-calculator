import { DateTime } from 'luxon'
import { useState } from 'react'
import * as React from 'react'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { IconButton } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export const useDatePicker = (): [date: DateTime, DateTimePicker: () => JSX.Element] => {
    const now = DateTime.now().set({ millisecond: 0, second: 0, minute: 0, hour: 0 })
    const [date, setDate] = useState(now)
    const changeDate = (d: number) => {
        setDate(date.plus({ days: d }))
    }

    const DatePicker = () => {
        return (
            <>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
                        <IconButton
                            onClick={() => changeDate(-1)}
                            color="primary"
                            aria-label="previous day"
                            component="label">
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <MobileDatePicker
                            label="Change date"
                            inputFormat="dd.MM.yyyy"
                            value={date}
                            onChange={(e) => setDate(e)}
                            // onChange={handleChange}
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{ width: '10em' }} {...params} />
                            )}
                        />
                        <IconButton
                            onClick={() => changeDate(1)}
                            color="primary"
                            aria-label="next day"
                            component="label">
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </Stack>
                </LocalizationProvider>
            </>
        )
    }

    return [date, DatePicker]
}
