import { createAction, createReducer } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { IRootState } from '../index'
import { roundEpochToMinute } from '../../utils/roundEpochToMinute'

interface PostCarbsInterface {
    datetime: DateTime
    carbs: number
    absorptionLength: number
}

interface CarbsInterface {
    id: number
    datetime: string
    carbs: number
    absorptionLength: number
}

export type CarbsMap = Map<number, { carbs: number; absorptionLength: number }>

/**
 *
 * @returns carbs in Map format where key is epoch in seconds rounded to closest minute and value is amount of carbs
 */
export const selectCarbsAsMap = ({ carbs }: IRootState): CarbsMap => {
    const arrayFormat = carbs.map((d) => {
        // TODO should we have dates rounded already in redux?
        // TODO warning if there is two inputs on same minute this causes errors
        const epoch = roundEpochToMinute(DateTime.fromISO(d.datetime).toUnixInteger())
        return [epoch, { carbs: d.carbs, absorptionLength: d.absorptionLength }] as [
            number,
            { carbs: number; absorptionLength: number }
        ]
    })
    return new Map(arrayFormat)
}

export const addCarbs = createAction<PostCarbsInterface>('carbs/addCarbs')
export const deleteCarbs = createAction<number>('carbs/deleteCarbs')

const initialState: CarbsInterface[] = []

export const carbsReducer = createReducer(initialState, (builder) => {
    return builder
        .addCase(addCarbs, (state, action) => {
            const { carbs, absorptionLength, datetime } = action.payload
            if (carbs === undefined || carbs < 0) return
            if (absorptionLength === undefined || absorptionLength < 0) return
            if (datetime === undefined || !datetime.isValid) return

            state.push({
                id: Math.max(...state.map((d) => d.id + 1), 0),
                datetime: datetime.toISO() ?? '2000-01-01T00:00:00.000-00:00',
                carbs,
                absorptionLength
            })
        })
        .addCase(deleteCarbs, (state, action) => {
            return state.filter((d) => d.id !== action.payload)
        })
})
