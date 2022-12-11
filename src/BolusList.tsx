import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from './store'
import { deleteBolus } from './store/reducers/bolus'

export const BolusList = ({ date }: { date: DateTime }) => {
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
        <table>
            <thead>
                <tr>
                    <td>Datetime</td>
                    <td>Bolus</td>
                    <td>Action</td>
                </tr>
            </thead>
            <tbody>
                {bolusInjectionArray.map((el) => {
                    return (
                        <tr key={el.id}>
                            <td>
                                {DateTime.fromISO(el.datetime).toLocaleString(
                                    DateTime.DATETIME_SHORT
                                )}
                            </td>
                            <td>{el.bolus}</td>
                            <td>
                                <button onClick={() => dispatch(deleteBolus(el.id))}>Delete</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
