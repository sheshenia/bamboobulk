import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

window.__DEBUG__ = true

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
