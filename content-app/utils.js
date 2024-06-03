import {defaultConfigs} from "../common/defaults.js";

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const addZero = (i) => i < 10 ? "0" + i : i

const skippingHoliday = (configs, oneDay) => configs.skipHolidays && !!oneDay.holidays?.length
const skippingTimeOff = (configs, oneDay) => configs.skipTimeOffs && !!oneDay.timeOff?.length
const skippingWeekend = (configs, oneDay) => {
    if(!oneDay.date) return true;
    const oneDayDate = new Date(oneDay.date)
    const oneDayWeekNum = oneDayDate.getDay()
    return configs.skipWeekends && (oneDayWeekNum === 6 || oneDayWeekNum === 0)
}

export const skippingDay = (configs, oneDay) => {
    if (!oneDay) return true;
    if (!configs) {
        configs = defaultConfigs
    }
    return skippingHoliday(configs, oneDay) || skippingTimeOff(configs, oneDay) || skippingWeekend(configs, oneDay)
}