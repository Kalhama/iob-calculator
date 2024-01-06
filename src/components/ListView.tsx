import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { BolusList } from './BolusList'
import { CarbsList } from './CarbsList'
import { DatePicker } from './Datepicker'
import React from 'react'

export const ListView = () => {
    const now = DateTime.now().set({ millisecond: 0, second: 0, minute: 0, hour: 0 })
    const [date, setDate] = useState(now)

    const start = date.set({
        millisecond: 0,
        second: 0,
        minute: 0,
        hour: 0
    })
    const end = start.plus({ hours: 24 })

    const [selectedList, setSelectedList] = useState('bolus')
    return (
        <>
            <DatePicker date={date} onChange={setDate} />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedList}
                    label="Age"
                    onChange={(e) => setSelectedList(e.target.value)}>
                    <MenuItem value={'bolus'}>Bolus</MenuItem>
                    <MenuItem value={'carbs'}>Carbs</MenuItem>
                </Select>
            </FormControl>
            {selectedList === 'bolus' ? (
                <BolusList start={start} end={end} />
            ) : (
                <CarbsList start={start} end={end} />
            )}
        </>
    )
}
