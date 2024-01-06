import { DateTime } from 'luxon'
import { useState } from 'react'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    IconButton
} from '@mui/material'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import React from 'react'

interface IProps {
    onSubmit?: (data: DateTime) => unknown
}

export const JumpToDate = ({ onSubmit }: IProps) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const handleOpen = () => {
        setDatetime(DateTime.now())
        setOpen(true)
    }

    const [datetime, setDatetime] = useState(DateTime.now())

    const handleSubmit = () => {
        if (typeof onSubmit === 'function') onSubmit(datetime)
        handleClose()
    }

    return (
        <>
            <IconButton
                onClick={handleOpen}
                color="primary"
                aria-label="jump to date"
                component="label">
                <CalendarMonthIcon />
            </IconButton>
            <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Jump to date</DialogTitle>
                    <DialogContent>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}>
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <StaticDatePicker
                                    displayStaticWrapperAs="desktop"
                                    orientation="landscape"
                                    shouldDisableDate={(day: DateTime) => {
                                        return (
                                            (DateTime.now().diff(day, 'days').as('days') ?? 999) < 0
                                        )
                                    }}
                                    openTo="day"
                                    value={datetime}
                                    onChange={setDatetime}
                                    renderInput={(params) => (
                                        <TextField variant="standard" {...params} />
                                    )}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Go</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}
