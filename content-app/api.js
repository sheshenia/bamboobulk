const bambooURL = () => `https://${location.hostname}/timesheet/clock/entries`

export const doOneDay = async (csrfToken, clockEntries) => {
    await fetch(bambooURL(), {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({entries: clockEntries}),
    });
}
export const deleteOneDayEntries = async (csrfToken, clockEntries) => {
    await fetch(bambooURL(), {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "X-Csrf-Token": csrfToken,
        },
        body: JSON.stringify({entries: clockEntries}),
    });
}