/*One Day buttons - block start*/
import {
    populateClockEntriesFromDefault,
    populateOneDayClockEntriesWithData
} from "./clockEntries.js";
import {
    csrfToken,
    dailyDetails,
    employeeId,
    isCurrentEditable,
    isPreviousEditable,
    isDateContainsTimeEntries,
    isDateTodayOrPast
} from "./timesheetData.js";
import {deleteOneDayEntries, doOneDay} from "./api.js";
import {addZero, skippingDay} from "./utils.js";
import {getClockEntriesFromStorage, getConfigsFromStorage} from "../common/storage";
import {defaultConfigs} from "../common/defaults.js";

const delBtn = (dateData) => {
    const delBtn = document.createElement("div")
    //delBtn.role = "button"
    delBtn.className = "one_day_del_btn"
    delBtn.title = "Delete clock entries"
    delBtn.textContent = "❌" //"🗑" ⏰
    delBtn.onclick = async (event) => {
        event.stopPropagation()
        const clockEntries = dailyDetails[dateData]?.clockEntries?.map(entry => entry.id)
        if (!!clockEntries?.length) {
            await deleteOneDayEntries(csrfToken, clockEntries)
            location.reload()
        }
    }
    //delBtn.dataset.dateData = dateData
    return delBtn
}

const addOneDayTimeEntries = async (dateData) => {
    const storageEntries = await getClockEntriesFromStorage()
    let clockEntries = []
    if(!!storageEntries?.length){
        clockEntries = populateOneDayClockEntriesWithData(storageEntries, dateData, employeeId)
    }
    if(!clockEntries.length){
        clockEntries = populateClockEntriesFromDefault(dateData, employeeId)
    }
    await doOneDay(csrfToken, clockEntries)
    location.reload()
}

const addBtn = (dateData) => {
    const addBtn = document.createElement("div")
    //delBtn.role = "button"
    addBtn.className = "one_day_add_btn"
    addBtn.title = "Add clock entries"
    addBtn.textContent = "🕔" //"⏰"
    addBtn.onclick = () => addOneDayTimeEntries(dateData)
    //delBtn.dataset.dateData = dateData
    return addBtn
}

export const populateEachDay = async () => {
    if (!isCurrentEditable() && !isPreviousEditable()) return;

    let configs = await getConfigsFromStorage()
    if (!configs) {
        configs = defaultConfigs
    }

    document.querySelectorAll(".TimesheetSlat").forEach(el => {
        const dayDate = el.querySelector(".TimesheetSlat__dayDate")
        if(!dayDate) return;

        //generate date string in format '2023-10-31', equal to the key format in bamboo timesheet
        try {
            /*
            * toISOString() produces not local result, so while testing in CET timezone always get one day lower result
            * const dateData = new Date(dayDate.textContent + " " + new Date().getFullYear()).toISOString().substring(0, 10)
            * */
            const year = new Date().getFullYear()
            const dateTimeData = new Date(dayDate.textContent + " " + year)
            const dateData = `${year}-${addZero(dateTimeData.getMonth()+1)}-${addZero(dateTimeData.getDate())}`

            const isEditable = isPreviousEditable() || isDateTodayOrPast(dateData)
            if (!isEditable) return;

            const oneDay = dailyDetails[dateData]
            if(!oneDay || skippingDay(configs, oneDay)) return;

            el.appendChild(isDateContainsTimeEntries(dateData) ? delBtn(dateData) : addBtn(dateData))
        }catch (e) {
            console.log(e)
        }
    })
}