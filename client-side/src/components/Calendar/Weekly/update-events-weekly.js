// slightly modified from updateEventsObject in monthly calendar because here I need
// date as key, not day of month, and also this doesn't contain empty entries (necessary
// in monthly calendar for days of calendar with no events)
export function updateEventsForDay(events, rangeStartDate, rangeEndDate) {
    let eventsForDay = {};

    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    let iteratedDayStart = null;

    events.forEach(e => {
        const eStartDate = new Date(e.startDate)
        const eEndDate = new Date(e.endDate);

        // initialize an iteration date to range start or event start
        // iterate and add to object if it's in the correct range
        if (eStartDate.getTime() < rangeStartDate.getTime()) {
            iteratedDayStart = new Date(rangeStartDate)
        }
        else {
            iteratedDayStart = new Date(new Date(eStartDate).setHours(0,0,0,0))
        }
        
        //iterate and add to object if it's lower than the range end and event's ened
        while (iteratedDayStart.getTime() < rangeEndDate.getTime() && iteratedDayStart.getTime() < eEndDate) {
            if (!eventsForDay[iteratedDayStart])
                eventsForDay[iteratedDayStart] = [];
            eventsForDay[iteratedDayStart].push(e);
            iteratedDayStart = new Date(iteratedDayStart.getTime() + oneDay);
        }
    })

    // sort events array based on start date
    Object.keys(eventsForDay).forEach(day => {
        eventsForDay[day].sort((e1,e2) => {
            return new Date(e1.startDate).getTime() - new Date(e2.startDate).getTime();
        });
    });

    // return sorted array from object containing [date, events] (events is an array of events for that day)
    return Object.entries(eventsForDay)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
}