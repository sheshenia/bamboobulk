import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {useEffect, useState} from "react";
import {getConfigsFromStorage, setConfigsToStorage} from "../../../common/storage";
import {defaultConfigs} from "../../../common/defaults";

export const SkipConfigs = () => {
    const [configs, setConfigs] = useState(defaultConfigs);

    useEffect(() => {
        getConfigsFromStorage().then(storageConfigs => {
            if (storageConfigs) {
                setConfigs(storageConfigs)
            } else {
                setConfigsToStorage(defaultConfigs)
            }
        })
    }, [])

    const handleChange = (event, key) => {
        const updatedConfigs = {...configs, [key]: event.target.checked}
        setConfigs(updatedConfigs)
        setConfigsToStorage(updatedConfigs)
    }
    const handleWeekends = (event) => handleChange(event, "skipWeekends")
    const handleHolidays = (event) => handleChange(event, "skipHolidays")
    const handleVacation = (event) => handleChange(event, "skipTimeOffs")

    return (
        <FormGroup row style={{marginLeft: "24px"}}>
            <FormControlLabel
                control={<Checkbox checked={configs.skipWeekends} onChange={handleWeekends}/>}
                label="Skip Weekends"/>
            <FormControlLabel
                control={<Checkbox checked={configs.skipHolidays} onChange={handleHolidays}/>}
                label="Skip Holidays"/>
            <FormControlLabel
                control={<Checkbox checked={configs.skipTimeOffs} onChange={handleVacation}/>}
                label="Skip Time Offs"/>
        </FormGroup>
    )
}