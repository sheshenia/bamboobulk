import {Stack} from "@mui/material";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import styled from "@emotion/styled";

const PickersContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 8px 0 !important;
    padding: 4px;
`;

export const ClockEntry = ({clockEntry, updateEntry}) => {
    return (<Stack spacing={4}>
        <PickersContainer>
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
        </PickersContainer>
    </Stack>)
}

function formatHHMM(val) {
    return addZero(val.$H) + ":" + addZero(val.$m)
}

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
}