import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { bolusReducer } from './reducers/bolus'
import logger from 'redux-logger'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { settingsReducer } from './reducers/settings'
const persistConfig = {
    key: 'root',
    storage
}

const reducers = combineReducers({
    bolusReducer,
    settings: settingsReducer
})

const persistedReducer = persistReducer(persistConfig, reducers)

export default configureStore({
    reducer: persistedReducer,
    middleware: [logger]
})

export type IRootState = ReturnType<typeof persistedReducer>
