import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Paper,
    Stack,
    Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { IRootState } from '../store'
import { setSettings } from '../store/reducers/settings'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import React from 'react'

export const Settings = () => {
    const userSettings = useSelector((state: IRootState) => state.settings)
    const [settings, changeSettings] = useState(userSettings)
    const [fakeLoading, setFakeLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (fakeLoading) {
            setTimeout(() => {
                setFakeLoading(false)
            }, 1000)
        }
    }, [fakeLoading])

    const handleSubmit = () => {
        setFakeLoading(true)
        dispatch(setSettings(settings))
    }

    const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        changeSettings({ ...settings, [prop]: event.target.value })
    }

    return (
        <Paper sx={{ maxWidth: '20em' }} className="page container">
            <Typography variant="h1">Settings</Typography>
            <FormControl onSubmit={console.log}>
                <Stack spacing={2}>
                    <Box>
                        <OutlinedInput
                            sx={{ width: '100%' }}
                            value={settings.carbRate}
                            onChange={handleChange('carbRate')}
                            required
                            type="number"
                            endAdornment={<InputAdornment position="end">g/U</InputAdornment>}
                        />
                        <FormHelperText>Carbs per units</FormHelperText>
                    </Box>
                    <Box>
                        <OutlinedInput
                            sx={{ width: '100%' }}
                            value={settings.adjustmentRate}
                            onChange={handleChange('adjustmentRate')}
                            required
                            type="number"
                            endAdornment={
                                <InputAdornment position="end">U / mmol/l</InputAdornment>
                            }
                        />
                        <FormHelperText>Units per mmol/l</FormHelperText>
                    </Box>
                    <Box>
                        <OutlinedInput
                            sx={{ width: '100%' }}
                            value={
                                settings.targetBloodGlucose === undefined
                                    ? '7'
                                    : settings.targetBloodGlucose
                            }
                            onChange={handleChange('targetBloodGlucose')}
                            required
                            type="number"
                            endAdornment={<InputAdornment position="end">mmol/l</InputAdornment>}
                        />
                        <FormHelperText>Target blood glucose in mmol/l</FormHelperText>
                    </Box>

                    <OutlinedInput
                        sx={{ width: '100%' }}
                        value={settings.IOBOffset}
                        onChange={handleChange('IOBOffset')}
                        required
                        type="number"
                        endAdornment={<InputAdornment position="end">IOB Offset</InputAdornment>}
                    />
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={1}>
                        <Button to={'/'} component={Link} variant="outlined">
                            Cancel
                        </Button>
                        <LoadingButton
                            onClick={handleSubmit}
                            loading={fakeLoading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained">
                            Save
                        </LoadingButton>
                    </Stack>
                </Stack>
            </FormControl>
        </Paper>
    )
}
