import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import { InputBolus } from './InputBolus'
import { DailyView } from './DailyView'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

const App = () => {
    return (
        <>
            <InputBolus />
            <DailyView />
        </>
    )
}

const rootElement = document.getElementById('root')

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    )
} else {
    alert('corrupted html file')
}
