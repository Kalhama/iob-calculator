import { createAction, createReducer } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { IRootState } from '../index'

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
        const epoch = Math.round(DateTime.fromISO(b.datetime).toSeconds() / 60) * 60
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
            // TODO should we round datetime to 60s ?
            if (action.payload.bolus < 0) return
            const id = Math.max(...state.map((bolus) => bolus.id), 0) + 1
            state.push({
                ...action.payload,
                datetime: action.payload.datetime.toISO(),
                id
            })
        })
        .addCase(deleteBolus, (state, action) => {
            return state.filter((bolus) => bolus.id !== action.payload)
        })
})
