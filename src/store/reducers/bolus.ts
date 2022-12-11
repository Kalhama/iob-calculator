import { createAction, createReducer } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'

interface PostBolusInterface {
    datetime: DateTime
    bolus: number
}

interface BolusInterface {
    id: number
    datetime: string
    bolus: number
}

export const addBolus = createAction<PostBolusInterface>('bolus/addBolus')
export const deleteBolus = createAction<number>('bolus/deleteBolus')

const initialState: BolusInterface[] = []

export const bolusReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(addBolus, (state, action) => {
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
