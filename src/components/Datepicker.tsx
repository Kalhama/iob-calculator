import { DateTime } from 'luxon'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { IconButton } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export const DatePicker = ({
    date,
    onChange
}: {
    date: DateTime
    onChange?: (date: DateTime) => unknown
}) => {
    const changeDate = (d: number) => {
        onChange(date.plus({ days: d }))
    }

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
                        onChange={(e) => onChange(e)}
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
