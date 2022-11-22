import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
// Redux
import { Provider } from 'react-redux';
import { store } from './store/store';

createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)
