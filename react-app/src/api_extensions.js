/*global chrome*/

export const getJQL = async (requestText = "hello") => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    console.log("tab:", tab)
    const response = await chrome.tabs.sendMessage(tab.id, {greeting: requestText});
    //return response.jql ?? ""
    return response
}

