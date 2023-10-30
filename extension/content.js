/*global chrome*/

/*
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
const defaultEntry = {
    "id": null,
    "note": "",
    "projectId": null,
    "taskId": null
}

const defaultEntries = [
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
const doBulk = async () => {
    const btn= document.getElementById("bamboobulk_btn")
    btn.disabled = true
    btn.textContent = "Processing..."

    const timesheetJsonEl = document.getElementById("js-timesheet-data")
    if (!timesheetJsonEl) return;

    const timesheetJson = JSON.parse(timesheetJsonEl.textContent)
    console.log(timesheetJson)

    const dailyDetails = timesheetJson?.timesheet?.dailyDetails
    const employeeId = timesheetJson?.employeeId
    const csrfToken = extractCsrfToken() //window.CSRF_TOKEN
    console.log("CSRF_TOKEN: ", csrfToken)

    if(!dailyDetails || !employeeId || !csrfToken) return;
    console.log(dailyDetails)

    const todayDayNum = new Date(timesheetJson?.today?.date ?? Date.now()).getDate()
    console.log(todayDayNum)


    const storageEntries = await getClockEntriesFromStorage()
    console.log("storageEntries:", storageEntries)

    for (const oneDay of Object.values(dailyDetails)) {
        //skipping Holidays and vacations
        if(!oneDay.date || !!oneDay?.holidays?.length || !!oneDay?.timeOff?.length) continue;

        const oneDayDate = new Date(oneDay.date)
        const oneDayWeekNum = oneDayDate.getDay()

        //only days below or equal today, except weekends
        if(oneDayDate.getDate() > todayDayNum || oneDayWeekNum === 6 || oneDayWeekNum === 0) continue;

        //skip days that already have clockEntries
        if(!!oneDay?.clockEntries?.length) continue;

        let clockEntries
        if(!!storageEntries?.length){
            clockEntries = storageEntries.map((entry,index) => {
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
                    "date": oneDay.date,
                    start,
                    end,
                    "note": "",
                    "projectId": null,
                    "taskId": null
                }
            })
        }else {
            clockEntries = defaultEntries.map(entry => {
                return {...entry, employeeId, date: oneDay.date}
            })
        }
        console.log(clockEntries)
        await doOneDay(csrfToken, clockEntries)
        await delay(500)

        console.log(oneDay.date)
    }
    location.reload()
}

const timeSheetContainer = document.querySelector(".TimesheetSummaryContainer")

if(timeSheetContainer){
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
}
