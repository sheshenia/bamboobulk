import {useEffect, useState} from 'react'
import './App.css'
import {
    CssBaseline, Divider, IconButton, Stack,
} from "@mui/material";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {ClockEntry} from "./components/ClockEntry.jsx";
import {getClockEntriesFromStorage, setClockEntriesToStorage} from "../../common/storage";
import AddIcon from '@mui/icons-material/Add';
import {SkipConfigs} from "./components/SkipConfigs";

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

const newClockEntry = () => {
    return {
        "id": crypto.randomUUID().split("-")[0],
        "start": "09:00",
        "end": "10:00",
        "days": []
    }
}

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

    const onClockEntryUpdate = (updatedValue) => {
        setClockEntries((oldClockEntries) => {
            const updatedEntries = oldClockEntries.map( oneEntry => oneEntry.id === updatedValue.id ? updatedValue : oneEntry)
            setClockEntriesToStorage(updatedEntries)
            return updatedEntries
        })
    }

    const onClockEntryDelete = (clockEntryId) => {
        setClockEntries((oldClockEntries) => {
            const updatedEntries = oldClockEntries.filter( oneEntry => oneEntry.id !== clockEntryId)
            setClockEntriesToStorage(updatedEntries)
            return updatedEntries
        })
    }

    const addNewEntry = () => {
        setClockEntries((oldClockEntries) => {
            const updatedEntries = [...oldClockEntries, newClockEntry()]
            setClockEntriesToStorage(updatedEntries)
            return updatedEntries
        })
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={12}>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={8}
                    >
                        <h2>BambooBulk Clock Entries</h2>
                        <IconButton size="small" color="primary" aria-label="add" onClick={addNewEntry}>
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    {/*<h2 style={{textAlign: 'center'}}>BambooBulk Clock Entries</h2>*/}

                    <Stack spacing={8} divider={<Divider orientation="horizontal" flexItem />}>
                        {clockEntries.map(oneEntry => {
                            return <ClockEntry
                                clockEntry={oneEntry}
                                key={oneEntry.id}
                                updateEntry={onClockEntryUpdate}
                                delEntry={onClockEntryDelete}
                            />
                        })}
                    </Stack>

                    <Divider/> {/*Skip configs*/}
                    <SkipConfigs/>

                </Stack>
            </LocalizationProvider>
        </ThemeProvider>
    )
}

export default App
