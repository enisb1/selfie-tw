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
    eventDiv.classList.add("absolute", "text-white", "p-1", "text-truncate", "rounded-md", "shadow-md", "opacity-75", "hover:opacity-100", "hover:font-bold");
    
    const title = document.createElement("p");
    title.innerText = event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

// updates event's div zIndex
// what it does: set zIndex of event's div, search for events that have start time between event's
// start and end time, sort them based on growing start time and call setZIndex on them
function setZIndexDaily(event, day) {
    const eventDiv = document.getElementById(event.divId);
    eventDiv.style.zIndex = zIndexCount;
    zIndexCount++;
    
    eventsContained = [];
    // fill eventsContained
    for (index in addedEvents[day-1]) {
        e = addedEvents[day-1][index];
        if (event.startInMinutes<e.startInMinutes && e.startInMinutes<event.endInMinutes) {
            eventsContained.push(e);
        }
    }

    eventsContained.sort((e1,e2) => e1.startInMinutes - e2.startInMinutes);
    eventsContained.forEach((e) => {
        setZIndexDaily(e, day);
    });
}

function addEventDaily(eventToAdd) {
    const [eventToAddHEnd, eventToAddMEnd] = eventToAdd.endTime.split(':').map(Number);
    const [eventToAddHStart, eventToAddMStart] = eventToAdd.startTime.split(':').map(Number);
    // add startInMinutes and endInMinutes to event's prototype
    // TODO: save this directly in db, probably better than to calculate it in script
    eventToAdd.startInMinutes = eventToAddHStart*60 + eventToAddMStart;
    eventToAdd.endInMinutes = eventToAddHEnd*60 + eventToAddMEnd;

    // get array of events with same start time
    let numEventsSharingStart = 0;
    let day = 2;    //TODO: change this based on event's day
    let eventsSharingStart = [];    // need to be able to retrieve events' div id
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
    eventToAddDiv.style.gridColumn = "2 / span 1";  //TODO: change 2 to actual day
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    eventToAddDiv.classList.add(eventsBgColors[Math.floor(Math.random() * eventsBgColors.length)]); // choose random bg color

    // set div's id
    eventToAddDiv.id = `event${nEvents}Weekly`;
    
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
    const eventsContainerDiv = document.getElementById("events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);

    // add id field to the event
    eventToAdd.divId = `event${nEvents}Weekly`;

    // if eventToAdd has same startTime as other events then set the same zIndex (no need to increment)
    if (numEventsSharingStart>1) {
        const divElement = document.getElementById(eventsSharingStart[0].divId);
        eventToAddDiv.style.zIndex = window.getComputedStyle(divElement).zIndex;
    }
    else
        setZIndexDaily(eventToAdd, day);

    // event added, push it to addedEvents
    addedEvents[day-1].push(eventToAdd);  //TODO: change addedEvents' index to actual day
    nEvents++;
}

document.addEventListener("DOMContentLoaded", () => {
    // test array
    const events = [
        {title: "Event 3", startTime: "01:30", endTime: "04:30"},
        {title: "Event 1", startTime: "01:00", endTime: "03:00"},
        {title: "Event 2", startTime: "01:00", endTime: "03:30"}
    ];

    addEventDaily(events[0]);
    addEventDaily(events[1]);
    addEventDaily(events[2]);
});