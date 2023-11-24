import {csrfToken, dailyDetails, employeeId, isTimesheetParsed, todayDayNum} from "./timesheetData.js";
import {
    populateClockEntriesFromDefault,
    populateOneDayClockEntriesWithData
} from "./clockEntries.js";
import {doOneDay} from "./api.js";
import {delay} from "./utils.js";
import {getClockEntriesFromStorage, getConfigsFromStorage} from "../common/storage";
import {defaultConfigs} from "../common/defaults.js";

const doBulk = async () => {
    if (!isTimesheetParsed()) return;

    const btn = document.getElementById("bamboobulk_btn")
    btn.replaceWith(processingDiv())
    const processedDayEl = document.getElementById("processed_day")

    const storageEntries = await getClockEntriesFromStorage()
    console.log("storageEntries:", storageEntries)

    let configs = await getConfigsFromStorage()
    if (!configs) {
        configs = defaultConfigs
    }

    for (const oneDay of Object.values(dailyDetails)) {
        if (!oneDay.date) continue;

        processedDayEl.textContent = oneDay.date

        //skipping Holidays if in configs
        if (configs.skipHolidays && !!oneDay?.holidays?.length) continue;

        //skipping Time Offs if in configs
        if (configs.skipTimeOffs && !!oneDay?.timeOff?.length) continue;

        const oneDayDate = new Date(oneDay.date)
        const oneDayWeekNum = oneDayDate.getDay()

        //skipping Weekends if in configs
        if (configs.skipWeekends && (oneDayWeekNum === 6 || oneDayWeekNum === 0)) continue;

        //only days below or equal today
        if (oneDayDate.getDate() > todayDayNum) continue;

        //skip days that already have clockEntries
        if (!!oneDay?.clockEntries?.length) continue;

        const clockEntries = !!storageEntries?.length
            ? populateOneDayClockEntriesWithData(storageEntries, oneDay.date, employeeId, oneDayWeekNum)
            : populateClockEntriesFromDefault(oneDay.date, employeeId)

        console.log(clockEntries)
        await doOneDay(csrfToken, clockEntries)
        await delay(500)

        console.log(oneDay.date)
    }
    location.reload()
}

const processingDiv = () => {
    /*const loader = document.createElement("div")
    loader.className = "loader"*/
    const div = document.createElement("div")
    div.className = "processing_div"
    div.innerHTML = `<div class="loader"></div>Processing<div id="processed_day"></div>`
    return div
}

const bulkButton = () => {
    const bulkBtn = document.createElement("button")
    bulkBtn.type = "button"
    bulkBtn.id = "bamboobulk_btn"
    bulkBtn.className = "bamboobulk_btn"
    bulkBtn.textContent = "Bulk Time Entries"
    bulkBtn.addEventListener("click", doBulk)
    return bulkBtn
}

export const bulkContainer = () => {
    const bambooBulkBtnContainer = document.createElement("div")
    bambooBulkBtnContainer.id = "bamboo-bulk-btn-container"
    bambooBulkBtnContainer.className = "bamboo-bulk-btn-container"
    bambooBulkBtnContainer.appendChild(bulkButton())
    return bambooBulkBtnContainer
}

