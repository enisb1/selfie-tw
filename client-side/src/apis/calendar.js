import axios from 'axios'

// get events array contained in time period between start and end
export async function getEvents(start, end) {
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/events?start=${start}&end=${end}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

// post event to db
export function postEvent(title, start, end) {
    axios.post('http://localhost:8000/api/calendar/addEvent', {"title": title, "startDate": start,
        "endDate": end
    })
    .then(({data}) => {
        console.log(data);
    })
}