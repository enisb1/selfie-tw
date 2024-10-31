// Global variables 
let addedEvents = [];   // array of added events
let eventsBgColors = ["bg-cyan-500", "bg-cyan-700", "bg-sky-500", "bg-sky-700", "bg-sky-900", "bg-blue-500", "bg-blue-700", "bg-blue-900", "bg-violet-400", "bg-violet-700", "bg-violet-900"];
let nEvents = 0;
let zIndexCount = 0;

function createDefaultEventDiv(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("absolute", "text-white", "p-1", "text-truncate", "rounded-md", "shadow-md", "opacity-75", "hover:opacity-100", "hover:font-bold");
    
    const title = document.createElement("p");
    title.innerText = event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

// updates event's div zIndex
// what it does: set zIndex of event's div, search for events that have start time between event's
// start and end time, sort them based on growing start time and call setZIndex on them
function setZIndex(event) {
    const eventDiv = document.getElementById(event.divId);
    eventDiv.style.zIndex = zIndexCount;
    zIndexCount++;
    
    const eventsContained = [];
    // fill eventsContained
    for (const e of addedEvents) {
        if (event.startInMinutes<e.startInMinutes && e.startInMinutes<event.endInMinutes) {
            eventsContained.push(e);
        }
    }

    eventsContained.sort((e1,e2) => e1.startInMinutes - e2.startInMinutes);
    eventsContained.forEach((e) => {
        setZIndex(e);
    });
}

function addEvent(eventToAdd) {
    const startDate = new Date(eventToAdd.startDate);
    const endDate = new Date(eventToAdd.endDate);
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
    let eventsSharingStart = [];
    addedEvents.forEach(e => {        
        if (e.startInMinutes == eventToAdd.startInMinutes) {
            numEventsSharingStart++;
            eventsSharingStart.push(e);
        } 
    });

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    // setting gridRow to gridRow = startRow / endRow
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    eventToAddDiv.classList.add(eventsBgColors[Math.floor(Math.random() * eventsBgColors.length)]); // choose random bg color

    // set div's id
    eventToAddDiv.id = `event${nEvents}Daily`;
    
    // set new left and width to the events that share the start time of the event to add
    // left and width are set based on the number of events with same start time
    numEventsSharingStart++;    // include the event to add in the count
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
    eventToAdd.divId = `event${nEvents}Daily`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numEventsSharingStart>1) {
        const divElement = document.getElementById(eventsSharingStart[0].divId);
        eventToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;
    }
    else
        setZIndex(eventToAdd);

    // event added, push it to addedEvents
    addedEvents.push(eventToAdd);
    nEvents++;
}

export function renderEvents(events, day) {
    // reset all
    document.getElementById("daily_events_container").innerHTML="";
    addedEvents = [];
    nEvents = 0;
    zIndexCount = 0;
    
    const sDate = new Date(new Date(day).setHours(0, 0, 0, 0));
    const eDate = new Date(new Date(day).setHours(23, 59, 59, 999));
    // add new events to calendar
    for (const event of events) {
        // trunc events starting before the current day or finishing after the current day
        const evtStartTime = new Date(event.startDate).getTime();
        const evtEndTime = new Date(event.endDate).getTime();
        if (evtStartTime < sDate.getTime())
            event.startDate = sDate;
        if (evtEndTime > eDate.getTime())
            event.endDate = eDate;
        addEvent(event);
    }
}