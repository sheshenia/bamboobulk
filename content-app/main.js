import "./content-style.css"
import {
    isTimesheetParsed,
    parseTimeSheetAndPopulateData
} from "./timesheetData.js";
import {populateEachDay} from "./oneDay.js";
import {bulkContainer} from "./bulk.js";

const timeSheetContainer = document.querySelector(".TimesheetSummaryContainer")

if(timeSheetContainer){
    parseTimeSheetAndPopulateData()

    if(isTimesheetParsed()) {
        timeSheetContainer.prepend(bulkContainer())
        populateEachDay()
    }
}


