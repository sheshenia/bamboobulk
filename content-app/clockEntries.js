/*global chrome*/
import {defaultEntries} from "./defaultEntries.js";

const clockEntriesStorageKey = "clockEntries"
export const getClockEntriesFromStorage = async () => {
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
export const populateOneDayClockEntriesWithData = (entries, dateData, employeeId) => {
    return entries.map((entry, index) => {
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
}
export const populateClockEntriesFromDefault = (dateData, employeeId) => {
    return defaultEntries.map(entry => {
        return {...entry, employeeId, date: dateData}
    })
}