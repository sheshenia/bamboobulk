/*global chrome*/

const defaultEntry = {
    "id": null,
    "note": "",
    "projectId": null,
    "taskId": null
}

const _DEFAULT_ENTRIES_ = [
    {
        ...defaultEntry,
        "trackingId": 1,
        "start": "09:00",
        "end": "13:00",
    },
    {
        ...defaultEntry,
        "trackingId": 2,
        "start": "14:00",
        "end": "18:00",
    }
]

/* Final entries example
{
  "entries": [
    {
      "id": null,
      "trackingId": 1,
      "employeeId": 405,
      "date": "2023-10-26",
      "start": "15:00",
      "end": "19:00",
      "note": "",
      "projectId": null,
      "taskId": null
    },
    {
      "id": null,
      "trackingId": 2,
      "employeeId": 405,
      "date": "2023-10-26",
      "start": "20:00",
      "end": "24:00",
      "projectId": null,
      "taskId": null
    }
  ]
}
* */

/*API - block start*/
const bambooURL = "https://ninjaone.bamboohr.com/timesheet/clock/entries"
const doOneDay = async (csrfToken, clockEntries) => {
    await fetch(bambooURL, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({entries: clockEntries}),
    });
}
const deleteOneDayEntries = async (csrfToken, clockEntries) => {
    await fetch(bambooURL, {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({entries: clockEntries}),
    });
}
/*API - block end*/

/*Utils - block start*/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const addZero = (i) => i < 10 ? "0" + i : i
/*Utils - block end*/

/*Timesheet data and parse - block start*/
let _DAILY_DETAILS_
let _EMPLOYEE_ID_
let _CSRF_TOKEN_
let _TODAY_DAY_NUM_

const isTimesheetParsed = () => _DAILY_DETAILS_ && _EMPLOYEE_ID_ && _CSRF_TOKEN_
const isDateInDailyDetails = (dateData) => _DAILY_DETAILS_.hasOwnProperty(dateData)
const isDateContainsTimeEntries = (dateData) => !!_DAILY_DETAILS_[dateData]?.clockEntries?.length
const isDateTodayOrPast = (dateData) => new Date(dateData).getDate() <= _TODAY_DAY_NUM_
const isDateToday = (dateData) => new Date(dateData).getDate() === _TODAY_DAY_NUM_

const extractCsrfToken = () => {
    const tokenRegexp = /CSRF_TOKEN\s*=\s*"([^"]+)"/im
    const collection = document.scripts;
    for (let i = 0; i < collection.length; i++) {
        const text = collection[i].text
        if(!text)continue;
        const match = text.match(tokenRegexp)
        if(!!match?.length) return match[1]
    }
}

const parseTimeSheetAndPopulateData = () => {
    const timesheetJsonEl = document.getElementById("js-timesheet-data")
    if (!timesheetJsonEl) return;

    const timesheetJson = JSON.parse(timesheetJsonEl.textContent)
    console.log(timesheetJson)

    _DAILY_DETAILS_ = timesheetJson?.timesheet?.dailyDetails
    _EMPLOYEE_ID_ = timesheetJson?.employeeId
    _CSRF_TOKEN_ = extractCsrfToken() //window.CSRF_TOKEN
    console.log("CSRF_TOKEN: ", _CSRF_TOKEN_)

    _TODAY_DAY_NUM_ = new Date(timesheetJson?.today?.date ?? Date.now()).getDate()
    console.log(_TODAY_DAY_NUM_)
}
/*Timesheet data and parse - block end*/

/*Clock Entries storage and default - block start*/
const clockEntriesStorageKey = "clockEntries"
const getClockEntriesFromStorage = async () => {
    const result = await chrome.storage.local.get(clockEntriesStorageKey)
    if (window.__DEBUG__) {
        console.log("Value currently is: ", result?.[clockEntriesStorageKey])
    }
    if (!result?.[clockEntriesStorageKey]) {
        if (window.__DEBUG__) {
            console.log("Not founded clockEntries in local extension storage")
        }
        return null
    }
    if (window.__DEBUG__) {
        console.log("Founded in storage:", result[clockEntriesStorageKey])
    }

    return result[clockEntriesStorageKey]
}

const populateOneDayClockEntriesWithData = (entries, dateData, employeeId) => {
    return entries.map((entry,index) => {
        let {start, end} = entry
        if(start === "24:00") {
            start = "00:00"
        }
        if(end === "00:00") {
            end = "24:00"
        }
        return {
            "id": null,
            "trackingId": index+1,
            "employeeId": employeeId,
            "date": dateData,
            start,
            end,
            "note": "",
            "projectId": null,
            "taskId": null
        }
    })
}

const populateClockEntriesFromDefault = (dateData, employeeId) => {
    return _DEFAULT_ENTRIES_.map(entry => {
        return {...entry, employeeId, date: dateData}
    })
}
/*Clock Entries storage and default - block end*/

/*One Day buttons - block start*/
const delBtn = (dateData) => {
    const delBtn = document.createElement("div")
    //delBtn.role = "button"
    delBtn.className = "one_day_del_btn"
    delBtn.title = "Delete clock entries"
    delBtn.textContent = "❌" //"🗑" ⏰
    delBtn.onclick = async (event) => {
        event.stopPropagation()
        const clockEntries = _DAILY_DETAILS_[dateData]?.clockEntries?.map(entry => entry.id)
        if(!!clockEntries?.length){
            await deleteOneDayEntries(_CSRF_TOKEN_, clockEntries)
            location.reload()
        }
    }
    //delBtn.dataset.dateData = dateData
    return delBtn
}

const addOneDayTimeEntries = async (dateData) => {
    console.log("Add:", dateData)
    const storageEntries = await getClockEntriesFromStorage()
    const clockEntries = !!storageEntries?.length
        ? populateOneDayClockEntriesWithData(storageEntries, dateData, _EMPLOYEE_ID_)
        : populateClockEntriesFromDefault(dateData, _EMPLOYEE_ID_)
    await doOneDay(_CSRF_TOKEN_, clockEntries)
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
/*One Day buttons - block end*/

const doBulk = async () => {
    if(!isTimesheetParsed()) return;

    const btn= document.getElementById("bamboobulk_btn")
    btn.disabled = true
    btn.textContent = "Processing..."

    const storageEntries = await getClockEntriesFromStorage()
    console.log("storageEntries:", storageEntries)

    for (const oneDay of Object.values(_DAILY_DETAILS_)) {
        //skipping Holidays and vacations
        if(!oneDay.date || !!oneDay?.holidays?.length || !!oneDay?.timeOff?.length) continue;

        const oneDayDate = new Date(oneDay.date)
        const oneDayWeekNum = oneDayDate.getDay()

        //only days below or equal today, except weekends
        if(oneDayDate.getDate() > _TODAY_DAY_NUM_ || oneDayWeekNum === 6 || oneDayWeekNum === 0) continue;

        //skip days that already have clockEntries
        if(!!oneDay?.clockEntries?.length) continue;

        const clockEntries = !!storageEntries?.length
            ? populateOneDayClockEntriesWithData(storageEntries, oneDay.date, _EMPLOYEE_ID_)
            : populateClockEntriesFromDefault(oneDay.date, _EMPLOYEE_ID_)

        console.log(clockEntries)
        await doOneDay(_CSRF_TOKEN_, clockEntries)
        await delay(500)

        console.log(oneDay.date)
    }
    location.reload()
}

const timeSheetContainer = document.querySelector(".TimesheetSummaryContainer")

if(timeSheetContainer){
    parseTimeSheetAndPopulateData()

    if(isTimesheetParsed()) {
        //bulk button
        const bulkBtn = document.createElement("button")
        bulkBtn.type = "button"
        bulkBtn.id = "bamboobulk_btn"
        bulkBtn.className = "bamboobulk_btn"
        bulkBtn.textContent = "Bulk Time Entries"

        const bambooBulkBtnContainer = document.createElement("div")
        bambooBulkBtnContainer.id = "bamboo-bulk-btn-container"
        bambooBulkBtnContainer.className = "bamboo-bulk-btn-container"
        bambooBulkBtnContainer.appendChild(bulkBtn)

        timeSheetContainer.prepend(bambooBulkBtnContainer)
        bulkBtn.addEventListener("click", doBulk)

        //populating timesheet days with del or add buttons
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

                if(isDateInDailyDetails(dateData) && isDateTodayOrPast(dateData)) {
                    console.log("adding delBtn to:", dayDate.textContent, "dateData:", dateData)
                    el.appendChild(isDateContainsTimeEntries(dateData) ? delBtn(dateData) : addBtn(dateData))
                }
            }catch (e) {
                console.log(e)
            }
        })
    }
}

