import "./content-style.css"
import {
    isEditable,
    isTimesheetParsed,
    parseTimeSheetAndPopulateData
} from "./timesheetData.js";
import {populateEachDay} from "./oneDay.js";
import {bulkContainer} from "./bulk.js";

//TODO: refactor the logic not to be dependent on site design changes, but only on actual raw data
let timesheetParseAttempted = false

// Bamboo renders the timesheet client-side after document_idle and may re-render it, so setup must be retryable and idempotent
const setup = () => {
    const timeSheetEntriesContainer = document.querySelector(".TimesheetEntries")
    if (!timeSheetEntriesContainer || !document.querySelector(".TimesheetSlat")) return;

    if (!timesheetParseAttempted) {
        timesheetParseAttempted = true
        parseTimeSheetAndPopulateData()
    }
    if (!isTimesheetParsed() || !isEditable) return;

    if (!document.getElementById("bamboo-bulk-btn-container")) {
        const clockInAndSummariesContainer = timeSheetEntriesContainer.nextSibling?.firstChild ?? timeSheetEntriesContainer.nextSibling ?? timeSheetEntriesContainer
        clockInAndSummariesContainer.prepend(bulkContainer()) // bulk button and actions logic
    }
    if (document.querySelector(".TimesheetSlat:not([data-bamboobulk])")) {
        populateEachDay() // each day "del"/"add" buttons and logic
    }
}

let setupScheduled = false
new MutationObserver(() => {
    if (setupScheduled) return;
    setupScheduled = true
    requestAnimationFrame(() => {
        setupScheduled = false
        setup()
    })
}).observe(document.body, {childList: true, subtree: true})

setup()
