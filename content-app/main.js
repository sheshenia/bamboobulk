import "./content-style.css"
import {
    isEditable,
    isTimesheetParsed,
    parseTimeSheetAndPopulateData
} from "./timesheetData.js";
import {populateEachDay} from "./oneDay.js";
import {bulkContainer} from "./bulk.js";

//TODO: refactor the logic not to be dependent on site design changes, but only on actual raw data
const timeSheetEntriesContainer = document.querySelector(".TimesheetEntries")

if(timeSheetEntriesContainer){
    parseTimeSheetAndPopulateData()

    if(isTimesheetParsed() && isEditable) {
        const clockInAndSummariesContainer = timeSheetEntriesContainer.nextSibling?.firstChild ?? timeSheetEntriesContainer.nextSibling ?? timeSheetEntriesContainer
        clockInAndSummariesContainer.prepend(bulkContainer()) // bulk button and actions logic
        populateEachDay() // each day "del"/"add" buttons and logic
    }
}


