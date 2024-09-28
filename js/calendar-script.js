const events = [
    { title: "Event 1", startTime: "00:30", endTime: "01:30" },
    { title: "Event 2", startTime: "02:15", endTime: "03:00" },
    { title: "Event 3", startTime: "04:45", endTime: "05:15" }
];

function createDefaultEventDiv(event) {
    const eventDiv = document.createElement("div");
    eventDiv.classList.add("absolute", "bg-blue-700", "left-20", 
        "h-20", "text-white", "p-1", "rounded-md", "shadow-md");
    
    const title = document.createElement("p");
    title.innerText = event.title;
    
    eventDiv.appendChild(title);

    return eventDiv;
}

// calculates distance between two lines in the calendar
// this distance varies based on the device size
function getDistanceBetweenTwoLines() {
    const line1 = document.getElementById("daily-hour-00");
    const line2 = document.getElementById("daily-hour-01");

    const line1Top = line1.getBoundingClientRect().top;
    const line2Top = line2.getBoundingClientRect().top;

    return line2Top-line1Top;
}

function getTimeBetweenStartEnd(endTimeString, startTimeString) {
    const [hours_end, minutes_end] = endTimeString.split(':').map(Number);
    const [hours_start, minutes_start] = startTimeString.split(':').map(Number);
    return (hours_end*60+minutes_end) - (hours_start*60+minutes_start);
}

document.addEventListener("DOMContentLoaded", () => {
    const event = events[0];
    const eventDiv = createDefaultEventDiv(event);
    const startTime = event.startTime;
    const endTime = event.endTime;
    const distanceBetweenTwoLines = getDistanceBetweenTwoLines();

    // Set top (position of that hour's line + fraction of distance between lines based on minutes)
    const [start_hours_string, start_minutes_string] = startTime.split(':');
    const lineElement = document.getElementById(`daily-line-${start_hours_string}`);
    const linePosition = lineElement.getBoundingClientRect().top + (Number(start_minutes_string)/60)*distanceBetweenTwoLines;
    eventDiv.style.top = `${linePosition}px`;

    // Set height
    const eventMinutes = getTimeBetweenStartEnd(endTime, startTime);
    const hours = eventMinutes/60;
    const minutes = eventMinutes%60;
    eventDiv.style.height = `${hours*distanceBetweenTwoLines + (minutes/60)*distanceBetweenTwoLines}px`;

    // TODO: Set left (check the number of events already placed that occupy the time
    // period of event to be placed)

    document.body.appendChild(eventDiv);
});