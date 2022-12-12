import { createAction, createReducer } from '@reduxjs/toolkit'

interface SettingsInterface {
    carbRate: number
    adjustmentRate: number
    IOBOffset: number
}

export const setSettings = createAction<SettingsInterface>('settings/setSettings')

const initialState: SettingsInterface = {
    carbRate: 10,
    adjustmentRate: 1.5,
    IOBOffset: 1
}

export const settingsReducer = createReducer(initialState, (builder) => {
    return builder.addCase(setSettings, (state, action) => {
        const { carbRate, adjustmentRate, IOBOffset } = action.payload

        if (carbRate === undefined || adjustmentRate === undefined || IOBOffset === undefined) {
            return
        }

        if (carbRate < 0) {
            action.payload.carbRate = 0
        }
        if (adjustmentRate < 0) {
            action.payload.carbRate = 0
        }

        state.carbRate = Number(carbRate)
        state.adjustmentRate = Number(adjustmentRate)
        state.IOBOffset = Number(IOBOffset)
    })
})
