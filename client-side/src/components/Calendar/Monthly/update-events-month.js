export function updateEventsObject(events, rangeStartDate, rangeEndDate) {
    // per ogni evento capire in quali giorni del mese corrente spanna, poi
    // aggiungerlo all'array per quei giorni
    let eventsByDay = {};

    // initialize arrays
    for (let day = 1; day <= rangeEndDate.getDate(); day++) {
        eventsByDay[day] = [];
    }

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
            eventsByDay[iteratedDayStart.getDate()].push(e)
            iteratedDayStart = new Date(iteratedDayStart.getTime() + oneDay);
        }
    })

    return eventsByDay;
}