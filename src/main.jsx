import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import Store_context from './store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Store_context.Provider value={''}> */}
    <App />
    {/* </Store_context.Provider> */}
  </React.StrictMode>
)
