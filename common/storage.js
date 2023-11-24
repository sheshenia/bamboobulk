/*global chrome*/

const clockEntriesStorageKey = "clockEntries"
const configsStorageKey = "bamboobulkConfigs"

export const setClockEntriesToStorage = (clockEntries) => {
    chrome.storage.local.set({[clockEntriesStorageKey]: clockEntries}).then(() => {
        if (window.__DEBUG__) {
            console.log("Saved clockEntries:", clockEntries)
        }
    });
}

export const getClockEntriesFromStorage = async () => {
    const result = await chrome.storage.local.get(clockEntriesStorageKey)
    if (window.__DEBUG__) {
        console.log("clockEntries from storage: ", result?.[clockEntriesStorageKey])
    }
    return result?.[clockEntriesStorageKey]
}

export const setConfigsToStorage = (configs) => {
    chrome.storage.local.set({[configsStorageKey]: configs}).then(() => {
        if (window.__DEBUG__) {
            console.log("Saved configs:", configs)
        }
    });
}

export const getConfigsFromStorage = async () => {
    const result = await chrome.storage.local.get(configsStorageKey)
    if (window.__DEBUG__) {
        console.log("Configs from storage:", result?.[configsStorageKey])
    }
    return result?.[configsStorageKey]
}