const doBulk = () => {
    const timesheetJsonEl = document.getElementById("js-timesheet-data")
    if (!timesheetJsonEl) return;

    const timesheetJson = JSON.parse(timesheetJsonEl.textContent)
    console.log(timesheetJson)

    const dailyDetails = timesheetJson?.timesheet?.dailyDetails
    if(!dailyDetails) return;
    console.log(dailyDetails)

    const todayDayNum = new Date(timesheetJson?.today?.date ?? Date.now()).getDate()
    console.log(todayDayNum)

    Object.values(dailyDetails).forEach((oneDay) => {
        if(!oneDay.date || !!oneDay?.holidays?.length) return;

        const oneDayDate = new Date(oneDay.date)
        const oneDayWeekNum = oneDayDate.getDay()
        //only days below or equal today, except weekends
        if(oneDayDate.getDate() > todayDayNum || oneDayWeekNum === 6 || oneDayWeekNum === 0) return;

        console.log(oneDay.date)
    })
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



