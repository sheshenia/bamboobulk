import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const timeSheetContainer = document.querySelector(".TimesheetSummaryContainer")
const rootElement = document.createElement("div")
rootElement.id = "react-bulk-app"
rootElement.className = "TimesheetSummary"

if (timeSheetContainer) {
    ReactDOM.createRoot(timeSheetContainer).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}

