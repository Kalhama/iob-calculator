import { Delete } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText, Paper } from '@mui/material'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../store'
import { deleteBolus } from '../store/reducers/bolus'

export const BolusTable = ({ date }: { date: DateTime }) => {
    const dispatch = useDispatch()
    const bolusInjectionArrayDaySelector = (state: IRootState) => {
        return state.bolusReducer.filter((bolus) => {
            const bolusDatetime = DateTime.fromISO(bolus.datetime).set({
                millisecond: 0,
                second: 0,
                minute: 0,
                hour: 0
            })
            return bolusDatetime.diff(date).valueOf() === 0
        })
    }
    const bolusInjectionArray = useSelector(bolusInjectionArrayDaySelector)

    return (
        <>
            {bolusInjectionArray.map((el) => {
                return (
                    <Paper sx={{ maxWidth: '20em', margin: '0 auto' }} key={el.id}>
                        <List dense>
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        onClick={() => dispatch(deleteBolus(el.id))}
                                        edge="end"
                                        aria-label="delete">
                                        <Delete />
                                    </IconButton>
                                }>
                                <ListItemText
                                    primary={el.bolus + ' U'}
                                    secondary={DateTime.fromISO(el.datetime).toLocaleString(
                                        DateTime.DATETIME_SHORT
                                    )}
                                />
                            </ListItem>
                        </List>
                    </Paper>
                )
            })}
        </>
    )
}
