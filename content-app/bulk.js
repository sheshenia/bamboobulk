import {csrfToken, dailyDetails, employeeId, isTimesheetParsed, todayDayNum} from "./timesheetData.js";
import {
    getClockEntriesFromStorage,
    populateClockEntriesFromDefault,
    populateOneDayClockEntriesWithData
} from "./clockEntries.js";
import {doOneDay} from "./api.js";
import {delay} from "./utils.js";

const doBulk = async () => {
    if (!isTimesheetParsed()) return;

    const btn = document.getElementById("bamboobulk_btn")
    btn.disabled = true
    btn.textContent = "Processing..."

    const storageEntries = await getClockEntriesFromStorage()
    console.log("storageEntries:", storageEntries)

    for (const oneDay of Object.values(dailyDetails)) {
        //skipping Holidays and vacations
        if (!oneDay.date || !!oneDay?.holidays?.length || !!oneDay?.timeOff?.length) continue;

        const oneDayDate = new Date(oneDay.date)
        const oneDayWeekNum = oneDayDate.getDay()

        //only days below or equal today, except weekends
        if (oneDayDate.getDate() > todayDayNum || oneDayWeekNum === 6 || oneDayWeekNum === 0) continue;

        //skip days that already have clockEntries
        if (!!oneDay?.clockEntries?.length) continue;

        const clockEntries = !!storageEntries?.length
            ? populateOneDayClockEntriesWithData(storageEntries, oneDay.date, employeeId)
            : populateClockEntriesFromDefault(oneDay.date, employeeId)

        console.log(clockEntries)
        await doOneDay(csrfToken, clockEntries)
        await delay(500)

        console.log(oneDay.date)
    }
    location.reload()
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

