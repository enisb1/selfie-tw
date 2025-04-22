import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

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

export async function getTodayEvents(userId) {
    const startStringUTC = new Date((new Date()).setHours(0, 0, 0, 0)).toISOString();
    const endStringUTC = new Date((new Date()).setHours(23, 59, 59, 999)).toISOString();
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/events?start=${startStringUTC}&end=${endStringUTC}&userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

export async function getTodayActivities(userId) {
    const startStringUTC = new Date((new Date()).setHours(0, 0, 0, 0)).toISOString();
    const endStringUTC = new Date((new Date()).setHours(23, 59, 59, 999)).toISOString();
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/activities?start=${startStringUTC}&end=${endStringUTC}&userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
    }
}

// Get this week's events for the current user
export async function getWeekEvents(userId) {
    const today = new Date();
    const startStringUTC = new Date(today.setHours(0, 0, 0, 0)).toISOString();

    // Calculate the last day of the week (Sunday)
    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    const endStringUTC = new Date(lastDayOfWeek.setHours(23, 59, 59, 999)).toISOString();

    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/events?start=${startStringUTC}&end=${endStringUTC}&userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching week's events: ", error);
        throw error;
    }
}

// Get this week's events for the current user
export async function getWeekActivities(userId) {
    const today = new Date();
    const startStringUTC = new Date(today.setHours(0, 0, 0, 0)).toISOString();

    // Calculate the last day of the week (Sunday)
    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    const endStringUTC = new Date(lastDayOfWeek.setHours(23, 59, 59, 999)).toISOString();

    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/activities?start=${startStringUTC}&end=${endStringUTC}&userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching week's events: ", error);
        throw error;
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
export async function postEvent(title, location, start, end, frequency, repetitionNumber, repetitionDate, color, users, creator, resources,
    notify15Before, notify30Before, notify1HourBefore, notify1DayBefore, pomodoroSettings) {
    await axios.post('http://localhost:8000/api/calendar/addEvent', {"title": title, "location": location, "startDate": start,
        "endDate": end, "frequency": frequency, "repetitionNumber":repetitionNumber, 
        "repetitionDate": repetitionDate, "color": color, "users": users, "creator": creator, "resources": resources,
        "notify15Before": notify15Before, "notify30Before": notify30Before, "notify1HourBefore": notify1HourBefore, 
        "notify1DayBefore": notify1DayBefore, "pomodoroSettings": pomodoroSettings}
    )
}

// post activity to db
export async function postActivity(title, deadline, userIds, myId, compositeActivity, projectData) {
    await axios.post('http://localhost:8000/api/calendar/addActivity', {"title": title, "deadline": deadline, 
        "isDone": false, "users": userIds, "creator": myId, "compositeActivity": compositeActivity, "projectData": projectData}
    )
    .then(({data}) => {
        return data.data;
    })
}

// post subactivities of groupActivity to db
export async function postSubacts(compositeActivityTitle, subactivities, users, myID) {
    const groupId = uuidv4(); // Generate a unique ID for the group activity
    const compositeActivity = {
        groupName: compositeActivityTitle,
        groupId: groupId
    };

    await axios.post('http://localhost:8000/api/calendar/sendCompositeInvite', {
        "groupId": groupId,
        "groupName": compositeActivityTitle,
        "users": users,
        "creator": myID
    })

    const promises = subactivities.map(subactivity => {
        const { title, deadline } = subactivity;
        return postActivity(title, deadline, [], myID,compositeActivity,null);
    });

    try {
        const results = await Promise.all(promises);
        return results;
    } catch (error) {
        console.error('Error posting subactivities:', error);
        throw error;
    }
}

export async function updateActivityProjectId(activityId, projectId) {
    try {
        const response = await axios.put(`http://localhost:8000/api/calendar/updateActivityProjectId/${activityId}`, { projectId });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// edit activity
export async function editActivity(activityId, updatedData) {
    await axios.put(`http://localhost:8000/api/calendar/activities/${activityId}`, updatedData)
}

// delete event
export async function deleteEvent(eventId) {
    await axios.delete(`http://localhost:8000/api/calendar/events/${eventId}`)
}

// delete event
export async function deleteActivity(activityId) {
    await axios.delete(`http://localhost:8000/api/calendar/activities/${activityId}`)
}

// edit event
export async function editEvent(eventId, updatedData) {
    await axios.put(`http://localhost:8000/api/calendar/events/${eventId}`, updatedData)
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
}

export async function getEventsByResource(resourceId) {
    try {
        const response = await axios.get(`http://localhost:8000/api/calendar/eventsByResource/${resourceId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function deleteActivitiesByGroup(groupName, groupId) {
    try {
        const response = await axios.delete('http://localhost:8000/api/calendar/deleteByGroup', {
            data: { groupName, groupId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting activities:', error);
        throw error;
    }
}

export async function sendExportMail(formData) {
    try {
        const response = await axios.post(`http://localhost:8000/api/calendar/export`, formData);
        return response.data;
    } catch (error) {
        return "Error sending email, try later";
    }
}