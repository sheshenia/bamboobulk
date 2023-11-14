/*Timesheet data and parse*/
export let dailyDetails
export let employeeId
export let csrfToken
export let todayDayNum

export const isTimesheetParsed = () => dailyDetails && employeeId && csrfToken
export const isDateInDailyDetails = (dateData) => dailyDetails.hasOwnProperty(dateData)
export const isDateContainsTimeEntries = (dateData) => !!dailyDetails[dateData]?.clockEntries?.length
export const isDateTodayOrPast = (dateData) => new Date(dateData).getDate() <= todayDayNum
const isDateToday = (dateData) => new Date(dateData).getDate() === todayDayNum

const extractCsrfToken = () => {
    const tokenRegexp = /CSRF_TOKEN\s*=\s*"([^"]+)"/im
    const collection = document.scripts;
    for (let i = 0; i < collection.length; i++) {
        const text = collection[i].text
        if (!text) continue;
        const match = text.match(tokenRegexp)
        if (!!match?.length) return match[1]
    }
}

export const parseTimeSheetAndPopulateData = () => {
    const timesheetJsonEl = document.getElementById("js-timesheet-data")
    if (!timesheetJsonEl) return;

    const timesheetJson = JSON.parse(timesheetJsonEl.textContent)
    console.log(timesheetJson)

    dailyDetails = timesheetJson?.timesheet?.dailyDetails
    employeeId = timesheetJson?.employeeId
    csrfToken = extractCsrfToken() //window.CSRF_TOKEN
    console.log("CSRF_TOKEN: ", csrfToken)

    todayDayNum = new Date(timesheetJson?.today?.date ?? Date.now()).getDate()
    console.log(todayDayNum)
}