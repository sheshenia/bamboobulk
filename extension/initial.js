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

const bambooURL = "https://ninjaone.bamboohr.com/timesheet/clock/entries"
const doOneDay = async (employeeId, date, csrfToken) => {
    const data = {
        entries: [
            {
                "id": null,
                "trackingId": 1,
                employeeId,
                date,
                "start": "15:00",
                "end": "19:00",
                "note": "",
                "projectId": null,
                "taskId": null
            },
            {
                "id": null,
                "trackingId": 2,
                employeeId,
                date,
                "start": "20:00",
                "end": "24:00",
                "projectId": null,
                "taskId": null
            }
        ]
    }
    await fetch(bambooURL, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-Csrf-Token": csrfToken,
        },
        body: JSON.stringify(data),
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const doBulk = async () => {
    const timesheetJsonEl = document.getElementById("js-timesheet-data")
    if (!timesheetJsonEl) return;

    const timesheetJson = JSON.parse(timesheetJsonEl.textContent)
    console.log(timesheetJson)

    const dailyDetails = timesheetJson?.timesheet?.dailyDetails
    const employeeId = timesheetJson?.employeeId
    const csrfToken = window.CSRF_TOKEN
    console.log("CSRF_TOKEN: ", csrfToken)

    if(!dailyDetails || !employeeId || !csrfToken) return;
    console.log(dailyDetails)

    const todayDayNum = new Date(timesheetJson?.today?.date ?? Date.now()).getDate()
    console.log(todayDayNum)

    for (const oneDay of Object.values(dailyDetails)) {
        //skipping Holidays
        if(!oneDay.date || !!oneDay?.holidays?.length) continue;

        const oneDayDate = new Date(oneDay.date)
        const oneDayWeekNum = oneDayDate.getDay()

        //only days below or equal today, except weekends
        if(oneDayDate.getDate() > todayDayNum || oneDayWeekNum === 6 || oneDayWeekNum === 0) continue;

        //skip days that already have clockEntries
        if(!!oneDay?.clockEntries?.length) continue;

        await doOneDay(employeeId, oneDay.date, csrfToken)
        await delay(500)

        console.log(oneDay.date)
    }
    location.reload()
}

const timeSheetContainer = document.querySelector(".TimesheetSummaryContainer")

if(timeSheetContainer){
    const bulkBtn = document.createElement("button")
    bulkBtn.type = "button"
    bulkBtn.className = "bamboobulk_btn"
    bulkBtn.textContent = "Bulk Time Entries"

    const bambooBulkBtnContainer = document.createElement("div")
    bambooBulkBtnContainer.id = "bamboo-bulk-btn-container"
    bambooBulkBtnContainer.className = "bamboo-bulk-btn-container"
    bambooBulkBtnContainer.appendChild(bulkBtn)

    timeSheetContainer.prepend(bambooBulkBtnContainer)
    bulkBtn.addEventListener("click", doBulk)
}



