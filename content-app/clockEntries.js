/*global chrome*/
import {defaultEntries} from "./defaultEntries.js";

// that's what we have from storage
/*{
    "id": "1d3b0dd0",
    "start": "09:00",
    "end": "13:00",
    "days": [1,2,3,4,5]
},*/

export const populateClockEntriesFromDefault = (dateData, employeeId) => {
    return defaultEntries.map(entry => {
        return {...entry, employeeId, date: dateData}
    })
}

export const populateOneDayClockEntriesWithData = (
    entries,
    dateData,
    employeeId,
    dateDayOfWeekNum = new Date(dateData).getDay()
) => {
    const dayEntries = entries.filter((entry) => entry.days?.includes(dateDayOfWeekNum)).map((entry, index) => {
        let {start, end} = entry
        if (start === "24:00") {
            start = "00:00"
        }
        if (end === "00:00") {
            end = "24:00"
        }
        return {
            "id": null,
            "trackingId": index + 1,
            "employeeId": employeeId,
            "date": dateData,
            start,
            end,
            "note": "",
            "projectId": null,
            "taskId": null
        }
    })
    return dayEntries
}
