// Global variables
let addedEvents = [[],[],[],[],[],[],[]];   // array with a list of added events for each day of the week
let nEvents = 0;
let timeslotHeight = 4.1;   // rem, including line (infact each timeslot has min-height of 4rem + 0.1rem line)
let eventsBgColors = ["bg-cyan-500", "bg-cyan-700", "bg-sky-500", "bg-sky-700", "bg-sky-900", "bg-blue-500", "bg-blue-700", "bg-blue-900", "bg-violet-400", "bg-violet-700", "bg-violet-900"];
let zIndexCount = 0; 

function eventsOverlap(event1StartMinutes, event1EndMinutes, event2StartMinutes, event2EndMinutes) {
    return (event1StartMinutes<event2EndMinutes && event1EndMinutes>event2StartMinutes);
}

function createDefaultEventDiv(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("absolute", "text-white", "p-1", "text-truncate", "rounded-md", "shadow-md");
    
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
        setZIndex(e, day);
    });
}

function addEvent(eventToAdd) {
    // TODO: CHANGE ENDTIMESTRING below
    const [eventToAddHEnd, eventToAddMEnd] = eventToAdd.endTime.split(':').map(Number);
    const [eventToAddHStart, eventToAddMStart] = eventToAdd.startTime.split(':').map(Number);
    eventToAdd.startInMinutes = eventToAddHStart*60 + eventToAddMStart; // add start in minutes to event's prototype (will be useful)
    eventToAdd.endInMinutes = eventToAddHEnd*60 + eventToAddMEnd; // add end in minutes to event's prototype (will be useful)

    let numEventsSharingStart = 0;
    let day = 2;
    /*change this for events with same start time
    // add height based on duration and left based on number of events in same time frame
    let day = 1;    // TODO: change this based on actual day
    let numOfEventsInTimeFrame = 0;
    let eventsSharingTimeFrame = [];    // need to be able to retrieve events' div id
    // get events and number of events sharing time frame
    addedEvents[day].forEach(e => {
        const [eventHEnd, eventMEnd] = e.endTime.split(':').map(Number);
        const [eventHStart, eventMStart] = e.startTime.split(':').map(Number);
        const evtStartTotalMinutes = eventHStart*60 + eventMStart;
        const evtEndTotalMinutes = eventHEnd*60 + eventMEnd;
        
        if (eventsOverlap(evtStartTotalMinutes, evtEndTotalMinutes, evtToAddStartTotalMinutes, evtToAddEndTotalMinutes)) {
            numOfEventsInTimeFrame++;
            eventsSharingTimeFrame.push(e);
        } 
    });
*/

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    eventToAddDiv.style.gridColumn = "2 / span 1";  //TODO: change 2 to actual day
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    eventToAddDiv.classList.add(eventsBgColors[Math.floor(Math.random() * eventsBgColors.length)]); // choose random bg color

    // id
    eventToAddDiv.id = `event${nEvents}Weekly`;
    
    // set new left and width to the events that are in the same time frame as the event to add
    numEventsSharingStart++;    // including the event to add
    for (let i = 0; i<numEventsSharingStart-1; i++) {
        const eventDiv = document.getElementById(eventsSharingTimeFrame[i].divId);
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

    // TODO: no need to call for this if eventToAdd shares start time with other events,
    // just set the same zIndex
    // add id field and set zIndex to div
    eventToAdd.divId = `event${nEvents}Weekly`;
    setZIndex(eventToAdd, day);

    // event added, push it to addedEvents
    addedEvents[day-1].push(eventToAdd);  //TODO: change addedEvents' index to actual day
    nEvents++;
}

document.addEventListener("DOMContentLoaded", () => {
    // test array
    const events = [
        {title: "Event 1", startTime: "01:00", endTime: "03:00"},
        {title: "Event 2", startTime: "02:30", endTime: "03:30"},
        {title: "Event 3", startTime: "00:30", endTime: "01:30"}, 
        {title: "Event 4", startTime: "00:10", endTime: "02:30"}
    ];

    addEvent(events[0]);
    addEvent(events[1]);
    addEvent(events[2]);
    addEvent(events[3]);
});