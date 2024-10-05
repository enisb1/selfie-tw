// Global variables
let addedEvents = [[],[],[],[],[],[],[]];   // array with a list of added events for each day of the week
let nEvents = 0;
let timeslotHeight = 4.1;   // rem, including line (infact each timeslot has min-height of 4rem + 0.1rem line)
let eventsBgColors = ["bg-cyan-500", "bg-cyan-700", "bg-sky-500", "bg-sky-700", "bg-sky-900", "bg-blue-500", "bg-blue-700", "bg-blue-900", "bg-violet-400", "bg-violet-700", "bg-violet-900"];

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

function addEvent(eventToAdd) {
    // TODO: CHANGE ENDTIMESTRING below
    const [eventToAddHEnd, eventToAddMEnd] = eventToAdd.endTime.split(':').map(Number);
    const [eventToAddHStart, eventToAddMStart] = eventToAdd.startTime.split(':').map(Number);
    const evtToAddStartTotalMinutes = eventToAddHStart*60 + eventToAddMStart;
    const evtToAddEndTotalMinutes = eventToAddHEnd*60 + eventToAddMEnd;

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

    // set new left and width to the events that are in the same time frame as the event to add
    numOfEventsInTimeFrame++;    // including the event to add
    for (let i = 0; i<numOfEventsInTimeFrame-1; i++) {
        const eventDiv = document.getElementById(eventsSharingTimeFrame[i].divId);
        //eventDiv.style.left = `${100/numOfEventsInTimeFrame*i}%`;
        //eventDiv.style.width = `${100/numOfEventsInTimeFrame}%`;
    }

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd);

    // grid positon
    // each timeslot has 12 grid rows (minute 0 = gridrow1, minute55 = gridrow12)
    eventToAddDiv.style.gridColumn = "2 / span 1";  //TODO: change 2 to actual day
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12+1 + (eventToAddMStart/5)} / ${eventToAddHEnd*12+1 + (eventToAddMEnd/5)}`;
    eventToAddDiv.style.height = "100%";
    eventToAddDiv.classList.add(eventsBgColors[Math.floor(Math.random() * eventsBgColors.length)]);

    // left
    //eventToAddDiv.style.left = `${100-100/numOfEventsInTimeFrame}%`;

    // width
    //eventToAddDiv.style.width = `${100/numOfEventsInTimeFrame}%`;
    eventToAddDiv.style.width = "100%"

    // id
    eventToAddDiv.id = `event${nEvents}Weekly`;

    // add to events container
    const eventsContainerDiv = document.getElementById("events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);

    // add id field to eventToAdd and push it to addedEvents
    eventToAdd.divId = `event${nEvents}Weekly`;
    addedEvents[1].push(eventToAdd);  //TODO: change addedEvents' index to actual day
    nEvents++;
}

document.addEventListener("DOMContentLoaded", () => {
    // test array
    const events = [
        { title: "Event 1", startTime: "00:30", endTime: "01:30"},
        { title: "Event 2", startTime: "00:45", endTime: "03:00"},
        { title: "Event 3", startTime: "01:00", endTime: "02:00"}
    ];

    addEvent(events[0]);
    addEvent(events[1]);
    addEvent(events[2]);
});