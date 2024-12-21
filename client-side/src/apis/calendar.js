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

export async function getResourcesEvents() {
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/resourcesEvents`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

// post event to db
export async function postEvent(title, location, start, end, frequency, repetitionNumber, repetitionDate, color, users, resources,
    notify15Before, notify30Before, notify1HourBefore, notify1DayBefore) {
    await axios.post('http://localhost:8000/api/calendar/addEvent', {"title": title, "location": location, "startDate": start,
        "endDate": end, "frequency": frequency, "repetitionNumber":repetitionNumber, 
        "repetitionDate": repetitionDate, "color": color, "users": users, "resources": resources,
        "notify15Before": notify15Before, "notify30Before": notify30Before, "notify1HourBefore": notify1HourBefore, 
        "notify1DayBefore": notify1DayBefore}
    )
    .then(({data}) => {
        console.log(data);
    })
}

// post event to db
export async function postActivity(title, deadline, userIds) {
    await axios.post('http://localhost:8000/api/calendar/addActivity', {"title": title, "deadline": deadline, 
        "isDone": false, "users": userIds}
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

// get all resources
export async function getResources() {
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/resources`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// get list of available resources given, list of users, startDate and endDate
export async function getAvailableResources(users, startDate, endDate) {
    const startStringUTC = new Date(startDate).toISOString();
    const endStringUTC = new Date(endDate).toISOString();
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/availableResources?users=${users}&start=${startStringUTC}&end=${endStringUTC}`)
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

export async function getResourcesFromIds(resources) {
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/resourcesFromIds?resources=${resources}`)
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

// post resource
export async function postResource(username) {
    await axios.post('http://localhost:8000/api/calendar/addResource', {"username": username})
    .then(({data}) => {
        console.log(data);
    })
}

export async function removeResourceFromEvent(resourceId, eventId) {
    try {
        const response = await axios.patch(`http://localhost:8000/api/calendar/removeResourceFromEvent`, {resource: resourceId, event: eventId})
        return response.data;
    }catch (error) {
        throw error.response.data;
    }
}

// delete resource from collection of resources and from each event that uses it
export async function deleteResource(resourceId) {
    await axios.delete(`http://localhost:8000/api/calendar/resources/${resourceId}`)
    .then(({data}) => {
        console.log(data);
    })
}