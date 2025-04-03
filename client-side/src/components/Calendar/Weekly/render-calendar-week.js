// Global variables
let addedSchedules = [[],[],[],[],[],[],[]];   // array of arrays of added events for each day of the week
let nSchedules = 0;
let zIndexCount = 0; 

function createDefaultEventDiv(event, resource) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("event","absolute", "text-white", "truncate", "rounded-md", "shadow-md", "opacity-75", "hover:font-bold");
    eventDiv.setAttribute('data-event-id', `event${event._id}`); // this and event class is used to add hover listener on event boxes

    const title = document.createElement("p");
    title.innerText = resource? `${resource.username} used` : event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

function createDefaultActivityDiv(activity) {
    const activityDiv = document.createElement("div");
    activityDiv.classList.add("absolute", "text-white", "truncate", "shadow-md", "font-bold");
    if (activity.isDone)
        activityDiv.classList.add("line-through")

    const title = document.createElement("p");
    title.classList.add("pl-1")
    title.innerText = `${((new Date).getTime() > new Date(activity.deadline).getTime())? 'EXPIRED' : 'DEADLINE'}: '${activity.title}'`;
    
    activityDiv.appendChild(title);

    return activityDiv;
}

// updates event's div zIndex
// what it does: set zIndex of event's div, search for events that have start time between event's
// start and end time, sort them based on growing start time and call setZIndex on them
function setZIndex(schedule, day) {
    const scheduleDiv = document.getElementById(schedule.divId);
    scheduleDiv.style.zIndex = zIndexCount;
    zIndexCount++;
    
    const schedulesContained = [];
    // fill eventsContained
    for (const s of addedSchedules[day-1]) {
        if (schedule.startInMinutes<s.startInMinutes && s.startInMinutes<schedule.endInMinutes) {
            schedulesContained.push(s);
        }
    }

    // increment zIndex of events contained in newly added event box
    schedulesContained.sort((s1,s2) => s1.startInMinutes - s2.startInMinutes);
    schedulesContained.forEach((s) => {
        setZIndex(s, day);
    });
}

function addEvent(eventToAdd, startDate, endDate, resource) {
    const eventToAddHStart = startDate.getHours();
    const eventToAddMStart = startDate.getMinutes();
    const eventToAddHEnd = endDate.getHours();
    let eventToAddMEnd = endDate.getMinutes();
    if (eventToAddMEnd == 59)   // this only happens when event endDate is truncated to 23.59
        eventToAddMEnd = 60;    // 59 is not valid for the calculations since minutes are displayed in hops of 5
    if (eventToAddMEnd % 5 != 0)    // round minutes to the nearest 5 (could happen for pomodoro events)
        eventToAddMEnd = Math.ceil(eventToAddMEnd/5)*5;
    // add startInMinutes and endInMinutes to event's prototype (will be used in calculations)
    eventToAdd.startInMinutes = eventToAddHStart*60 + eventToAddMStart;
    eventToAdd.endInMinutes = eventToAddHEnd*60 + eventToAddMEnd;

    // get array of events with same start time
    let numSchedulesSharingStart = 0;
    let day = startDate.getDay()==0 ? 7 : startDate.getDay();
    let schedulesSharingStart = [];    // need to be able to retrieve div id of events sharing start, this does not include current event
    addedSchedules[day-1].forEach(s => {        
        if (s.startInMinutes == eventToAdd.startInMinutes) {
            numSchedulesSharingStart++;
            schedulesSharingStart.push(s);
        } 
    });

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd, resource);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    eventToAddDiv.style.gridColumn = `${day} / span 1`;
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    eventToAddDiv.style.backgroundColor = eventToAdd.color;

    // set div's id
    eventToAddDiv.id = `schedule${nSchedules}Weekly`;
    
    // set new left and width to the events that share the start time of the event to add
    // left and width are set based on the number of events with same start time
    numSchedulesSharingStart++;    // include current event in the count
    for (let i = 0; i<numSchedulesSharingStart-1; i++) {
        const scheduleDiv = document.getElementById(schedulesSharingStart[i].divId);
        scheduleDiv.style.left = `${100/numSchedulesSharingStart*i}%`;
        scheduleDiv.style.width = `${100/numSchedulesSharingStart}%`;
    }

    // left
    eventToAddDiv.style.left = `${100-100/numSchedulesSharingStart}%`;

    // width
    eventToAddDiv.style.width = `${100/numSchedulesSharingStart}%`;

    // add to events container
    const eventsContainerDiv = document.getElementById("weekly_events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);

    // add id field to the event
    eventToAdd.divId = `schedule${nSchedules}Weekly`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numSchedulesSharingStart>1) {
        const divElement = document.getElementById(schedulesSharingStart[0].divId);
        eventToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;    // set same zIndex when sharing start
    }
    else
        setZIndex(eventToAdd, day);

    // event added, push it to addedEvents
    addedSchedules[day-1].push(eventToAdd);
    nSchedules++;

    if (!resource) {
        // add click listener to show event's info
        eventToAddDiv.addEventListener('click', function () {
            let detail = null;
            if (eventToAdd.originalEvent)
                detail = eventToAdd.originalEvent;
            else
                detail = eventToAdd;
            const event = new CustomEvent('showScheduleInfoWeekly', {
                detail: detail
            });
            window.dispatchEvent(event); // Dispatch event to the global window
        });
        eventToAddDiv.style.cursor = 'pointer'
    }
    else {
        // add click listener to show resource event info
        const resourceEvent = {startDate: eventToAdd.startDate, endDate: eventToAdd.endDate,
            resourceUsername: resource.username, resourceId: resource._id, eventId: eventToAdd._id
        }
        
        eventToAddDiv.addEventListener('click', function () {
            const event = new CustomEvent('showResourceEventWeekly', {
                detail: resourceEvent
            });
            window.dispatchEvent(event); // Dispatch event to the global window
        });
        eventToAddDiv.style.cursor = 'pointer'
    }
}

function addActivity(activityToAdd) {
    const deadline = new Date(activityToAdd.deadline);
    const activityToAddH = deadline.getHours();
    let activityToAddM = deadline.getMinutes();
    // edge case in which the activity has a deadline near the end of the grid are handled by
    // anticipating deadline to a fake one... the activity will still officially have its normal deadline
    if (activityToAddH == 23 && activityToAddM > 40)
        activityToAddM = 40;
    if (activityToAddM % 5 != 0)    // round minutes to the nearest 5 (could happen for activities from expiring tasks)
        activityToAddM = Math.ceil(activityToAddM/5)*5;
    activityToAdd.startInMinutes = activityToAddH*60 + activityToAddM;
    activityToAdd.endInMinutes = activityToAdd.startInMinutes + 20; // spans 20 minutes to have enough space in the grid

    // get array of schedules with same start time
    let numSchedulesSharingStart = 0;
    let day = deadline.getDay()==0 ? 7 : deadline.getDay();
    let schedulesSharingStart = [];    // need to be able to retrieve div id of schedules sharing start, this does not include current schedule
    addedSchedules[day-1].forEach(s => {        
        if (s.startInMinutes == activityToAdd.startInMinutes) {
            numSchedulesSharingStart++;
            schedulesSharingStart.push(s);
        } 
    });

    // create div for new activity
    const activityToAddDiv = createDefaultActivityDiv(activityToAdd);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    activityToAddDiv.style.gridColumn = `${day} / span 1`;
    activityToAddDiv.style.gridRow = `${activityToAddH*12+1 + (activityToAddM/5)} / span 4`; // spans 20 minutes to have enough space
    activityToAddDiv.style.height = "100%";
    activityToAddDiv.style.backgroundColor = 'crimson'; //TODO: select an activity color and set it here

    // set div's id
    activityToAddDiv.id = `schedule${nSchedules}Weekly`;
    
    // set new left and width to the events that share the start time of the event to add
    // left and width are set based on the number of events with same start time
    numSchedulesSharingStart++;    // include current event in the count
    for (let i = 0; i<numSchedulesSharingStart-1; i++) {
        const scheduleDiv = document.getElementById(schedulesSharingStart[i].divId);
        scheduleDiv.style.left = `${100/numSchedulesSharingStart*i}%`;
        scheduleDiv.style.width = `${100/numSchedulesSharingStart}%`;
    }

    // left
    activityToAddDiv.style.left = `${100-100/numSchedulesSharingStart}%`;

    // width
    activityToAddDiv.style.width = `${100/numSchedulesSharingStart}%`;

    // add to events container
    const eventsContainerDiv = document.getElementById("weekly_events_container");
    eventsContainerDiv.appendChild(activityToAddDiv);

    // add id field to the event
    activityToAdd.divId = `schedule${nSchedules}Weekly`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numSchedulesSharingStart>1) {
        const divElement = document.getElementById(schedulesSharingStart[0].divId);
        activityToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;    // set same zIndex when sharing start
    }
    else
        setZIndex(activityToAdd, day);

    // event added, push it to addedEvents
    addedSchedules[day-1].push(activityToAdd);
    nSchedules++;

    // add click listener to show activity's info
    activityToAddDiv.addEventListener('click', function () {
        const event = new CustomEvent('showScheduleInfoWeekly', {
            detail: activityToAdd
        });
        window.dispatchEvent(event); // Dispatch event to the global window
    });
    activityToAddDiv.style.cursor = 'pointer'
}

// objects in js are passed by reference.. since I need distint instances in order to
// correctly work with them (setting startInMinutes and endInMinutes), I need to clone them in a separate object
function cloneEvent(event) {
    const clonedEvent = structuredClone(event);
    return clonedEvent;
}

export function renderCalendar(events, activities, isResource) {
    // reset all
    document.getElementById("weekly_events_container").innerHTML="";
    addedSchedules = [[],[],[],[],[],[],[]];   // array of arrays of added schedules for each day of the week
    nSchedules = 0;
    zIndexCount = 0; 

    // render events
    for (const event of events) {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        const startDateMidnight = new Date(eventStart);
        startDateMidnight.setHours(0, 0, 0, 0);
        const endDateMidnight = new Date(eventEnd);
        endDateMidnight.setHours(0, 0, 0, 0);

        const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
        const daysBetween = Math.round((endDateMidnight - startDateMidnight) / oneDay);
        
        if (daysBetween > 0) {
            for (let i=0; i<=daysBetween; i++) {
                const iteratedDayStart = new Date(startDateMidnight.getTime() + i * oneDay);

                if (i==0) {
                    const start = new Date(eventStart);
                    const end = new Date(start.setHours(23,59, 59, 999));
                    if (isResource) {
                        for (const resource of event.matchedResources)
                            addEvent(cloneEvent(event), eventStart, end, resource)
                    }
                    else
                        addEvent(cloneEvent(event), eventStart, end, null)
                }
                else if (i<daysBetween) {
                    const start = new Date(iteratedDayStart);
                    const end = new Date(iteratedDayStart.setHours(23, 59, 59, 999));
                    if (isResource) {
                        for (const resource of event.matchedResources)
                            addEvent(cloneEvent(event), start, end, resource)
                    }
                    else
                        addEvent(cloneEvent(event), start, end, null)
                }
                else if (i==daysBetween) {
                    const end = new Date(eventEnd);
                    const start = new Date(end.setHours(0,0,0,0));
                    if (isResource) {
                        for (const resource of event.matchedResources)
                            addEvent(cloneEvent(event), start, eventEnd, resource)
                    }
                    else
                        addEvent(cloneEvent(event), start, eventEnd, null);
                }
            }
        }
        else {
            // no need to clone since the event is not getting divided in smaller parts
            if (isResource) {
                for (const resource of event.matchedResources)
                    addEvent(event, eventStart, eventEnd, resource);
            }
            else
                addEvent(event, eventStart, eventEnd, null);
        }
    }

    if (!isResource) {
        // render activities
        for (let activity of activities) {
            // mapping expiring task to activity object fields
            if (activity.expiration) {
                activity = {
                    title: activity.title? activity.title : "",
                    deadline: activity.expiration,
                    isDone: activity.done,
                    users: activity.users,
                    expiringTask: true
                }
            }
            addActivity(activity)
        }
    }
    
}