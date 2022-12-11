import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { Navbar } from './components/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Root } from './components/Root'
import { ListBolus } from './components/ListBolus'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navbar />,
        children: [
            {
                path: '/', // yes, again
                element: <Root />
            },
            {
                path: '/bolus',
                element: <ListBolus />
            }
        ]
    }
])

const persistor = persistStore(store)

const rootElement = document.getElementById('root')

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    )
} else {
    alert('corrupted html file')
}
