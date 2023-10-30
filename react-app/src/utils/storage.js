/*global chrome*/

const clockEntriesStorageKey = "clockEntries"

export const setClockEntriesToStorage = (clockEntries) => {
    chrome.storage.local.set({[clockEntriesStorageKey]: clockEntries}).then(() => {
        if (window.__DEBUG__) {
            console.log("Saved:", clockEntries)
        }
    });
}

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