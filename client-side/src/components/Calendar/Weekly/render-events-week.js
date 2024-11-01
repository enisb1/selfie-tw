// Global variables
let addedEvents = [[],[],[],[],[],[],[]];   // array of arrays of added events for each day of the week
let nEvents = 0;
let eventsBgColors = ["bg-cyan-500", "bg-cyan-700", "bg-sky-500", "bg-sky-700", "bg-sky-900", "bg-blue-500", "bg-blue-700", "bg-blue-900", "bg-violet-400", "bg-violet-700", "bg-violet-900"];
let zIndexCount = 0; 

function eventsOverlap(event1StartMinutes, event1EndMinutes, event2StartMinutes, event2EndMinutes) {
    return (event1StartMinutes<event2EndMinutes && event1EndMinutes>event2StartMinutes);
}

function createDefaultEventDiv(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("absolute", "text-white", "p-1", "truncate", "rounded-md", "shadow-md", "opacity-75", "hover:opacity-100", "hover:font-bold");
    
    const title = document.createElement("p");
    title.innerText = event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

// updates event's div zIndex
// what it does: set zIndex of event's div, search for events that have start time between event's
// start and end time, sort them based on growing start time and call setZIndex on them
function setZIndex(event, day) {
    const eventDiv = document.getElementById(event.divId);
    eventDiv.style.zIndex = zIndexCount;
    zIndexCount++;
    
    const eventsContained = [];
    // fill eventsContained
    for (const e of addedEvents[day-1]) {
        if (event.startInMinutes<e.startInMinutes && e.startInMinutes<event.endInMinutes) {
            eventsContained.push(e);
        }
    }

    // increment zIndex of events contained in newly added event box
    eventsContained.sort((e1,e2) => e1.startInMinutes - e2.startInMinutes);
    eventsContained.forEach((e) => {
        setZIndex(e, day);
    });
}

function addEvent(eventToAdd) {
    const eventToAddHStart = eventToAdd.startDate.getHours();
    const eventToAddMStart = eventToAdd.startDate.getMinutes();
    const eventToAddHEnd = eventToAdd.endDate.getHours();
    let eventToAddMEnd = eventToAdd.endDate.getMinutes();
    if (eventToAddMEnd == 59)   // this only happens when event endDate is truncated to 23.59
        eventToAddMEnd = 60;    // 59 is not valid for the calculations since minutes are displayed in hops of 5
    // add startInMinutes and endInMinutes to event's prototype (will be used in calculations)
    eventToAdd.startInMinutes = eventToAddHStart*60 + eventToAddMStart;
    eventToAdd.endInMinutes = eventToAddHEnd*60 + eventToAddMEnd;

    // get array of events with same start time
    let numEventsSharingStart = 0;
    let day = eventToAdd.startDate.getDay()==0 ? 7 : eventToAdd.startDate.getDay();
    let eventsSharingStart = [];    // need to be able to retrieve div id of events sharing start, this does not include current event
    addedEvents[day-1].forEach(e => {        
        if (e.startInMinutes == eventToAdd.startInMinutes) {
            numEventsSharingStart++;
            eventsSharingStart.push(e);
        } 
    });

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    eventToAddDiv.style.gridColumn = `${day} / span 1`;
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    //eventToAddDiv.classList.add(eventsBgColors[Math.floor(Math.random() * eventsBgColors.length)]); // choose random bg color
    eventToAddDiv.classList.add("bg-third")

    // set div's id
    eventToAddDiv.id = `event${nEvents}Weekly`;
    
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
    const eventsContainerDiv = document.getElementById("weekly_events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);

    // add id field to the event
    eventToAdd.divId = `event${nEvents}Weekly`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numEventsSharingStart>1) {
        const divElement = document.getElementById(eventsSharingStart[0].divId);
        eventToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;    // set same zIndex when sharing start
    }
    else
        setZIndex(eventToAdd, day);

    // event added, push it to addedEvents
    addedEvents[day-1].push(eventToAdd);
    nEvents++;
}

// objects in js are passed by reference.. since I need distint instances in order to
// correctly work with them (setting startInMinutes and endInMinutes), I need to clone them in a separate object
// what this function does is cloning the object and setting new startDate and endDate
function cloneEvent(event, startDate, endDate) {
    const clonedEvent = structuredClone(event);
    clonedEvent.startDate = startDate;
    clonedEvent.endDate = endDate;
    return clonedEvent;
}

export function renderEvents(events) {
    // reset all
    document.getElementById("weekly_events_container").innerHTML="";
    addedEvents = [[],[],[],[],[],[],[]];   // array of arrays of added events for each day of the week
    nEvents = 0;
    zIndexCount = 0; 

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
                    addEvent(cloneEvent(event, eventStart, end))
                }
                else if (i<daysBetween) {
                    const start = new Date(iteratedDayStart);
                    const end = new Date(iteratedDayStart.setHours(23, 59, 59, 999));
                    addEvent(cloneEvent(event, start, end));
                }
                else if (i==daysBetween) {
                    const end = new Date(eventEnd);
                    const start = new Date(end.setHours(0,0,0,0));
                    addEvent(cloneEvent(event, start, eventEnd));
                }
            }
        }
        else {
            // no need to clone since the event is not getting divided in smaller parts
            event.startDate = eventStart;
            event.endDate = eventEnd;
            addEvent(event);
        }
    }
}