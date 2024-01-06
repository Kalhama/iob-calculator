import { createAction, createReducer } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { IRootState } from '../index'
import { roundEpochToMinute } from '../../utils/roundEpochToMinute'

interface PostBolusInterface {
    datetime: DateTime
    bolus: number
}

interface BolusInterface {
    id: number
    datetime: string
    bolus: number
}

export const selectBolusBetween = (start: DateTime, end: DateTime) => {
    return (state: IRootState) =>
        state.bolusReducer.filter((bolus) => {
            const datetime = DateTime.fromISO(bolus.datetime)
            return start <= datetime && datetime <= end
        })
}

/**
 *
 * @returns bolus in Map format where key is epoch in seconds rounded to closest minute and value is amount of bolus
 */
export const selectBolusAsMap = ({ bolusReducer }: IRootState): Map<number, number> => {
    const arrayFormat = bolusReducer.map((b) => {
        // TODO should we have dates rounded already in redux?
        // TODO warning if there is two inputs on same minute this causes errors
        const epoch = roundEpochToMinute(DateTime.fromISO(b.datetime).toSeconds())
        return [epoch, b.bolus] as [number, number]
    })
    return new Map(arrayFormat)
}

export const addBolus = createAction<PostBolusInterface>('bolus/addBolus')
export const deleteBolus = createAction<number>('bolus/deleteBolus')

const initialState: BolusInterface[] = []

export const bolusReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(addBolus, (state, action) => {
            const { datetime, bolus } = action.payload
            if (bolus === undefined || bolus < 0) return
            if (datetime === undefined || !datetime.isValid) return

            state.push({
                id: Math.max(...state.map((bolus) => bolus.id + 1), 0),
                datetime: datetime.toISO() ?? '2000-01-01T00:00:00.000-00:00',
                bolus
            })
        })
        .addCase(deleteBolus, (state, action) => {
            return state.filter((bolus) => bolus.id !== action.payload)
        })
})
