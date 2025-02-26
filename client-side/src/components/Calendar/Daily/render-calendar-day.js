// Global variables 
let addedSchedules = [];   // array of added events
let nSchedules = 0;
let zIndexCount = 0;

function createDefaultEventDiv(event, resource) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("truncate","absolute", "text-white", "rounded-md", "shadow-md", "opacity-75", "hover:opacity-100", "hover:font-bold");
    
    const title = document.createElement("p");
    title.innerText = resource? `${resource.username} used` : event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

function createDefaultActivityDiv(activity) {
    const activityDiv = document.createElement("div");
    activityDiv.classList.add("absolute", "text-white", "truncate", "shadow-md", "font-bold");
    activityDiv.style.backgroundColor = 'crimson';
    if (activity.isDone)
        activityDiv.classList.add("line-through")

    const title = document.createElement("p");
    title.classList.add("pl-1")
    title.innerText = `DEADLINE: '${activity.title}'`;
    
    activityDiv.appendChild(title);

    return activityDiv;
}

// updates event's div zIndex
// what it does: set zIndex of event's div, search for events that have start time between event's
// start and end time, sort them based on growing start time and call setZIndex on them
function setZIndex(schedule) {
    const scheduleDiv = document.getElementById(schedule.divId);
    scheduleDiv.style.zIndex = zIndexCount;
    zIndexCount++;
    
    const schedulesContained = [];
    // fill eventsContained
    for (const s of addedSchedules) {
        if (schedule.startInMinutes<s.startInMinutes && s.startInMinutes<schedule.endInMinutes) {
            schedulesContained.push(s);
        }
    }

    schedulesContained.sort((s1,s2) => s1.startInMinutes - s2.startInMinutes);
    schedulesContained.forEach((s) => {
        setZIndex(s);
    });
}

function addEvent(eventToAdd, startDate, endDate, resource) {
    // events from db have string and not Date objects in startDate and endDate
    const eventToAddHStart = startDate.getHours();
    const eventToAddMStart = startDate.getMinutes();
    const eventToAddHEnd = endDate.getHours();
    let eventToAddMEnd = endDate.getMinutes();
    if (eventToAddMEnd == 59)   // this only happens when event endDate is truncated to 23.59
        eventToAddMEnd = 60;    // 59 is not valid for the calculations since minutes are displayed in hops of 5
    // add startInMinutes and endInMinutes to event's prototype (will be used in calculations)
    eventToAdd.startInMinutes = eventToAddHStart*60 + eventToAddMStart;
    eventToAdd.endInMinutes = eventToAddHEnd*60 + eventToAddMEnd;

    // get array of events with same start time
    let numEventsSharingStart = 0;
    let eventsSharingStart = [];    // need to be able to retrieve div id of events sharing start, this does not include current event
    addedSchedules.forEach(e => {        
        if (e.startInMinutes == eventToAdd.startInMinutes) {
            numEventsSharingStart++;
            eventsSharingStart.push(e);
        } 
    });

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd, resource);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    // setting gridRow to gridRow = startRow / endRow
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    eventToAddDiv.style.backgroundColor = eventToAdd.color;

    // set div's id
    eventToAddDiv.id = `schedule${nSchedules}Daily`;
    
    // set new left and width to the events that share the start time of the event to add
    // left and width are set based on the number of events with same start time
    numEventsSharingStart++;    // include current event in the count
    for (let i = 0; i<numEventsSharingStart-1; i++) {
        const eventDiv = document.getElementById(eventsSharingStart[i].divId);
        eventDiv.style.left = `${100/numEventsSharingStart*i}%`;
        eventDiv.style.width = `${100/numEventsSharingStart}%`;
    }

    // left
    eventToAddDiv.style.left = `${100-100/numEventsSharingStart}%`;

    // width
    eventToAddDiv.style.width = `${100/numEventsSharingStart}%`;

    // add to events container
    const eventsContainerDiv = document.getElementById("daily_events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);

    // add id field to the event
    eventToAdd.divId = `schedule${nSchedules}Daily`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numEventsSharingStart>1) {
        const divElement = document.getElementById(eventsSharingStart[0].divId);
        eventToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;
    }
    else
        setZIndex(eventToAdd);

    // event added, push it to addedEvents
    addedSchedules.push(eventToAdd);
    nSchedules++;

    if (!resource) {
        // add click listener to show event's info
        eventToAddDiv.addEventListener('click', function () {
            let detail = null;
            if (eventToAdd.originalEvent)
                detail = eventToAdd.originalEvent;
            else
                detail = eventToAdd;
            const event = new CustomEvent('showScheduleInfoDaily', {
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
            const event = new CustomEvent('showResourceEventDaily', {
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
    activityToAdd.startInMinutes = activityToAddH*60 + activityToAddM;
    activityToAdd.endInMinutes = activityToAdd.startInMinutes + 20; // spans 20 minutes to have enough space in the grid

    // get array of schedules with same start time
    let numSchedulesSharingStart = 0;
    let schedulesSharingStart = [];    // need to be able to retrieve div id of schedules sharing start, this does not include current schedule
    addedSchedules.forEach(s => {        
        if (s.startInMinutes == activityToAdd.startInMinutes) {
            numSchedulesSharingStart++;
            schedulesSharingStart.push(s);
        } 
    });

    // create div for new event
    const activityToAddDiv = createDefaultActivityDiv(activityToAdd);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    activityToAddDiv.style.gridRow = `${activityToAddH*12+1 + (activityToAddM/5)} / span 4`; // spans 20 minutes to have enough space
    activityToAddDiv.style.height = "100%";

    // set div's id
    activityToAddDiv.id = `schedule${nSchedules}Daily`;
    
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
    const eventsContainerDiv = document.getElementById("daily_events_container");
    eventsContainerDiv.appendChild(activityToAddDiv);

    // add id field to the event
    activityToAdd.divId = `schedule${nSchedules}Daily`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numSchedulesSharingStart>1) {
        const divElement = document.getElementById(schedulesSharingStart[0].divId);
        activityToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;    // set same zIndex when sharing start
    }
    else
        setZIndex(activityToAdd);

    // event added, push it to addedEvents
    addedSchedules.push(activityToAdd);
    nSchedules++;

    // add click listener to show event's info
    activityToAddDiv.addEventListener('click', function () {
        const event = new CustomEvent('showScheduleInfoDaily', {
            detail: activityToAdd
        });
        window.dispatchEvent(event); // Dispatch event to the global window
    });
    activityToAddDiv.style.cursor = 'pointer'
}

export function renderCalendar(events, activities, day, isResource) {
    // reset all
    document.getElementById("daily_events_container").innerHTML="";
    addedSchedules = [];
    nSchedules = 0;
    zIndexCount = 0;
    
    const sDate = new Date(new Date(day).setHours(0, 0, 0, 0));
    const eDate = new Date(new Date(day).setHours(23, 59, 59, 999));

    // render events
    for (const event of events) {
        // trunc events starting before the current day or finishing after the current day
        const evtStartTime = new Date(event.startDate).getTime();
        const evtEndTime = new Date(event.endDate).getTime();
        // create clone in order to not modify event's dates
        let start = new Date(event.startDate);
        let end = new Date(event.endDate);
        if (evtStartTime < sDate.getTime())
            start = sDate;
        if (evtEndTime > eDate.getTime())
            end = eDate;
        // add events
        if (isResource) {
            for (const resource of event.matchedResources)
                addEvent(event, start, end, resource)
        }
        else
            addEvent(event, start, end, null);
    }

    if (!isResource) {
        // render activities
        for (const activity of activities) 
            addActivity(activity)
    }
    
}