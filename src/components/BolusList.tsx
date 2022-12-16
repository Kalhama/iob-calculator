import { Delete } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText, Paper } from '@mui/material'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBolus, selectBolusBetween } from '../store/reducers/bolus'
import { InputBolusFab } from './InputBolusFab'

interface IProps {
    start: DateTime
    end: DateTime
}

export const BolusList = ({ start, end }: IProps) => {
    const dispatch = useDispatch()

    const bolusArray = useSelector(selectBolusBetween(start, end))

    return (
        <>
            {bolusArray.map((el) => {
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
            <InputBolusFab />
        </>
    )
}
