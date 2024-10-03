// Global variables
let addedEvents = [[],[],[],[],[],[],[]];   // array with a list of added events for each day of the week
let nEvents = 0;
let timeslotHeight = 4.1;   // rem, including line (infact each timeslot has min-height of 4rem + 0.1rem line)

function eventsOverlap(event1StartMinutes, event1EndMinutes, event2StartMinutes, event2EndMinutes) {
    return (event1StartMinutes<event2EndMinutes && event1EndMinutes>event2StartMinutes);
}

function createDefaultEventDiv(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("absolute", "bg-blue-700", "text-white", "p-1", "rounded-md", "shadow-md");
    
    const title = document.createElement("p");
    title.innerText = event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

function addEvent(eventToAdd) {
    // TODO: CHANGE ENDTIMESTRING below
    const [eventToAddHEnd, eventToAddMEnd] = eventToAdd.endTime.split(':').map(Number);
    const [eventToAddHStart, eventToAddMStart] = eventToAdd.startTime.split(':').map(Number);
    const eventToAddStartTotalMinutes = eventToAddHStart*60 + eventToAddMStart;
    const eventToAddEndTotalMinutes = eventToAddHEnd*60 + eventToAddMEnd;

    // add height based on duration and left based on number of events in same time frame
    let day = 2;    // TODO: change this based on actual day
    let numOfEventsInTimeFrame = 0;
    let eventsSharingTimeFrame = [];    // need to be able to retrieve events' div id
    // get events and number of events sharing time frame
    addedEvents[day].forEach(e => {
        const [eventHEnd, eventMEnd] = e.endTime.split(':').map(Number);
        const [eventHStart, eventMStart] = e.startTime.split(':').map(Number);
        const eventStartTotalMinutes = eventHStart*60 + eventMStart;
        const eventEndTotalMinutes = eventHEnd*60 + eventMEnd;
        
        if (eventsOverlap(eventStartTotalMinutes, eventEndTotalMinutes, eventToAddStartTotalMinutes, eventToAddEndTotalMinutes)) {
            numOfEventsInTimeFrame++;
            eventsSharingTimeFrame.push(e);
        } 
    });

    // set new left and width to the events that are in the same time frame as the event to add
    numOfEventsInTimeFrame++;    // including the event to add
    for (let i = 0; i<numOfEventsInTimeFrame-1; i++) {
        const eventDiv = document.getElementById(eventsSharingTimeFrame[i].elementId);
        eventDiv.style.left = `${100/numOfEventsInTimeFrame*i}%`;
        eventDiv.style.width = `${100/numOfEventsInTimeFrame}%`;
    }

    // create div for new event
    const eventToAddDiv = createDefaultEventDiv(eventToAdd);

    // grid positon
    eventToAddDiv.style.gridColumn = "2 / span 1";  //TODO: change 2 to actual day
    eventToAddDiv.style.gridRow = `${eventToAddHStart*12 + eventToAddMStart/5}`;

    // left
    eventToAddDiv.style.left = `${100-100/numOfEventsInTimeFrame}`;

    // width
    eventToAddDiv.style.width = `${100/numOfEventsInTimeFrame}`;

    // id
    eventToAddDiv.id = `event${nEvents}Weekly`;

    // set height
    const eventToAddDurationH = (eventToAddEndTotalMinutes-eventToAddStartTotalMinutes) / 60;
    const eventToAddDurationM = (eventToAddEndTotalMinutes-eventToAddStartTotalMinutes) % 60;
    eventToAddDiv.style.height = `${timeslotHeight*eventToAddDurationH + (eventToAddDurationM/60)*timeslotHeight}rem`;
    
    const eventsContainerDiv = document.getElementById("events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);

    // add id field to eventToAdd and push it to addedEvents
    eventToAdd.id = `event${nEvents}Weekly`;
    addedEvents[2-1].push(eventToAdd);  //TODO: change this(2) to actual day
    nEvents++;
}

document.addEventListener("DOMContentLoaded", () => {
    // test array
    const events = [
        { title: "Event 1", startTime: "00:30", endTime: "01:30"},
        { title: "Event 2", startTime: "00:45", endTime: "03:00"},
        { title: "Event 3", startTime: "04:45", endTime: "05:15"}
    ];

    addEvent(events[0]);
   
    /*const eventToAddDiv = createDefaultEventDiv(events[0]);
    eventToAddDiv.style.gridColumn = "2 / span 1";
    eventToAddDiv.style.gridRow = "37";

    const eventsContainerDiv = document.getElementById("events_container");
    eventsContainerDiv.appendChild(eventToAddDiv);
    */
});