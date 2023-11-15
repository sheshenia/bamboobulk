import {Button, ButtonGroup, Divider, IconButton, Stack} from "@mui/material";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import DeleteIcon from '@mui/icons-material/Delete';

const PickersContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    margin: 8px 0 !important;
    padding: 4px;
`;

const DayBtn = ({dayNum, isDaySelected, updateEntry}) => {
    return <Button variant={isDaySelected ? "contained" : "outlined"}>dayjs().day(dayNum).format("ddd")</Button>
}

export const ClockEntry = ({clockEntry, updateEntry}) => {
    const isDayInEntry = (dayNum) => clockEntry.days.includes(dayNum)
    const daySelected = (dayNum) => isDayInEntry(dayNum) ? "contained" : "outlined"

    return (<Stack style={{marginLeft: "24px"}} spacing={4}>
        <Stack direction="row" justifyContent="flex-start" spacing={2}>
            <TimePicker
                label="Time Start"
                value={dayjs('2022-04-17T' + clockEntry.start)}
                onChange={(newValue) => updateEntry({...clockEntry, start: formatHHMM(newValue)})}
            />
            <TimePicker
                className="time-end"
                label="Time End"
                value={dayjs('2022-04-17T' + clockEntry.end)}
                onChange={(newValue) => updateEntry({...clockEntry, end: formatHHMM(newValue)})}
            />
            <IconButton color="primary" aria-label="delete clock entry">
                <DeleteIcon />
            </IconButton>
        </Stack>
        <Stack direction="row" justifyContent="flex-start" spacing={20}>
            <ButtonGroup variant="outlined" aria-label="Weekdays">
                <Button variant={daySelected(1)}>Mon</Button>
                <Button variant={daySelected(2)}>Tue</Button>
                <Button variant={daySelected(3)}>Wed</Button>
                <Button variant={daySelected(4)}>Thu</Button>
                <Button variant={daySelected(5)}>Fri</Button>
            </ButtonGroup>
            <ButtonGroup variant="outlined" aria-label="Weekends">
                <Button variant={daySelected(6)}>Sat</Button>
                <Button variant={daySelected(0)}>Sun</Button>
            </ButtonGroup>
        </Stack>
    </Stack>)
}

const addZero = (i) => i < 10 ? "0" + i : i

function formatHHMM(val) {
    return addZero(val.$H) + ":" + addZero(val.$m)
}
