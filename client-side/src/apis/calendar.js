import axios from 'axios'

// convert startDate and endDate to UTC time string, and get events in that range
export async function getEventsInRange(startDate, endDate) {
    const startStringUTC = new Date(startDate.setHours(0, 0, 0, 0)).toISOString();
    const endStringUTC = new Date(endDate.setHours(23, 59, 59, 999)).toISOString();
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/events?start=${startStringUTC}&end=${endStringUTC}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

// convert startDate and endDate to UTC time string, and get events in that range
export async function getActivitiesInRange(startDate, endDate, userId) {
    const startStringUTC = new Date(startDate.setHours(0, 0, 0, 0)).toISOString();
    const endStringUTC = new Date(endDate.setHours(23, 59, 59, 999)).toISOString();
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/activities?start=${startStringUTC}&end=${endStringUTC}&userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

export async function getEvents(userId) {
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/events/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

// post event to db
export async function postEvent(title, start, end, frequency, repetitionNumber, repetitionDate, color, userId) {
    await axios.post('http://localhost:8000/api/calendar/addEvent', {"title": title, "startDate": start,
        "endDate": end, "frequency": frequency, "repetitionNumber":repetitionNumber, 
        "repetitionDate": repetitionDate, "color": color, "users": [userId]}
    )
    .then(({data}) => {
        console.log(data);
    })
}

// post event to db
export async function postActivity(title, deadline, userId) {
    console.log(userId)
    await axios.post('http://localhost:8000/api/calendar/addActivity', {"title": title, "deadline": deadline, 
        "isDone": false, "users": [userId]}
    )
    .then(({data}) => {
        console.log(data);
    })
}

// edit activity
export async function editActivity(activityId, updatedData) {
    await axios.put(`http://localhost:8000/api/calendar/activities/${activityId}`, updatedData)
    .then(({data}) => {
        console.log(data);
    })
}

// delete event
export async function deleteEvent(eventId) {
    await axios.delete(`http://localhost:8000/api/calendar/events/${eventId}`)
    .then(({data}) => {
        console.log(data);
    })
}

// delete event
export async function deleteActivity(activityId) {
    await axios.delete(`http://localhost:8000/api/calendar/activities/${activityId}`)
    .then(({data}) => {
        console.log(data);
    })
}

// edit event
export async function editEvent(eventId, updatedData) {
    await axios.put(`http://localhost:8000/api/calendar/events/${eventId}`, updatedData)
    .then(({data}) => {
        console.log(data);
    })
}