import "./content-style.css"
import {
    isEditable,
    isTimesheetParsed,
    parseTimeSheetAndPopulateData
} from "./timesheetData.js";
import {populateEachDay} from "./oneDay.js";
import {bulkContainer} from "./bulk.js";

const timeSheetContainer = document.querySelector(".TimesheetSummaryContainer")

if(timeSheetContainer){
    parseTimeSheetAndPopulateData()

    if(isTimesheetParsed() && isEditable) {
        timeSheetContainer.prepend(bulkContainer()) // bulk button and actions logic
        populateEachDay() // each day "del"/"add" buttons and logic
    }
}


