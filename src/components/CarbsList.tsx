import { Delete } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemText, Paper } from '@mui/material'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '../store'
import { deleteCarbs } from '../store/reducers/carbs'
import { InputBolusFab } from './InputBolusFab'

interface IProps {
    start: DateTime
    end: DateTime
}

export const CarbsList = ({ start, end }: IProps) => {
    const dispatch = useDispatch()

    const carbsArray = useSelector((state: IRootState) =>
        state.carbs.filter((d) => {
            const datetime = DateTime.fromISO(d.datetime)
            return datetime.valueOf() >= start.valueOf() && datetime.valueOf() <= end.valueOf()
        })
    )

    return (
        <>
            {carbsArray.map((el) => {
                return (
                    <Paper sx={{ maxWidth: '20em', margin: '0 auto' }} key={el.id}>
                        <List dense>
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        onClick={() => dispatch(deleteCarbs(el.id))}
                                        edge="end"
                                        aria-label="delete">
                                        <Delete />
                                    </IconButton>
                                }>
                                <ListItemText
                                    primary={el.carbs + 'g | ' + el.absorptionLength + 'min'}
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
