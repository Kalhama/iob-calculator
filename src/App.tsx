import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { Navbar } from './components/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { InsulinCalculator } from './components/InsulinCalculator'
import { Settings } from './components/Settings'
import { VictoryIOBPlot } from './components/VictoryIOBPlot'
import { BolusTable } from './components/BolusTable'
import { createTheme, ThemeProvider } from '@mui/material'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navbar />,
        children: [
            {
                path: '/',
                element: <VictoryIOBPlot />
            },
            {
                path: '/bolus',
                element: <BolusTable />
            },
            {
                path: '/calculator',
                element: <InsulinCalculator />
            },
            {
                path: '/settings',
                element: <Settings />
            }
        ]
    }
])

const theme = createTheme({
    typography: {
        h1: {
            fontSize: 30,
            fontWeight: 'bolder',
            marginBottom: '0.5em'
        }
    }
})

const persistor = persistStore(store)

const rootElement = document.getElementById('root')

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router} />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    )
} else {
    alert('corrupted html file')
}
