import {useEffect, useState} from 'react'
import './App.css'
import {
    CssBaseline,
} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styled from "@emotion/styled";
import {ClockEntry} from "./components/ClockEntry.jsx";
import {getClockEntriesFromStorage, setClockEntriesToStorage} from "./utils/storage.js";



const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    spacing: 2,
});

const defaultClockEntries = [
    {
        "id": "1d3b0dd0",
        "start": "09:00",
        "end": "13:00",
        "days": [1,2,3,4,5]
    },
    {
        "id": "93917561",
        "start": "14:00",
        "end": "18:00",
        "days": [1,2,3,4,5]
    }
]

function App() {
    const [clockEntries, setClockEntries] = useState(defaultClockEntries);

    useEffect(()=>{
        getClockEntriesFromStorage().then(clockEntriesLS=>{
            console.log(clockEntriesLS)
            if(clockEntriesLS){
                setClockEntries(clockEntriesLS)
            }else {
                setClockEntriesToStorage(defaultClockEntries)
            }
        })
    }, [])

    const onClockEntryUpdate = (updatedValue)=> {
        const updatedEntries = clockEntries.map(one => one.id === updatedValue.id ? {...updatedValue} : one )
        setClockEntriesToStorage(updatedEntries)
        setClockEntries(updatedEntries)
    }
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <h2 style={{textAlign: 'center'}}>BambooBulk Clock Entries</h2>

                {clockEntries.map(oneEntry => {
                    return <ClockEntry
                        clockEntry={oneEntry}
                        key={oneEntry.id}
                        updateEntry={onClockEntryUpdate}
                    />
                })}

            </LocalizationProvider>
        </ThemeProvider>
    )
}

export default App
