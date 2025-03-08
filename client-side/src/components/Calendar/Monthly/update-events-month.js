export function updateSchedules(events, activities, rangeStartDate, rangeEndDate) {
    // per ogni evento capire in quali giorni del mese corrente spanna, poi
    // aggiungerlo all'array per quei giorni
    let eventsByDay = {};

    // initialize arrays
    for (let day = 1; day <= rangeEndDate.getDate(); day++) {
        eventsByDay[day] = [];
    }

    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    let iteratedDayStart = null;

    // ADD EVENTS
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
        
        //iterate and add to object if it's lower than the range end and event's end
        while (iteratedDayStart.getTime() < rangeEndDate.getTime() && iteratedDayStart.getTime() < eEndDate) {
            eventsByDay[iteratedDayStart.getDate()].push(e)
            iteratedDayStart = new Date(iteratedDayStart.getTime() + oneDay);
        }
    })

    // ADD ACTIVITIES
    if (activities) {
        activities.forEach(a => {
            // mapping expiring task to activity object fields
            if (a.expiration) {
                a = {
                    title: a.title? a.title : "",
                    deadline: a.expiration,
                    isDone: a.done,
                    expiringTask: true
                }
            }
            const deadline = new Date(a.deadline)
            if (eventsByDay[deadline.getDate()])
                eventsByDay[deadline.getDate()].push(a)
            else
                eventsByDay[deadline.getDate()] = [a]
        })
    }
    

    // sort arrays containing events and activities by start date
    Object.keys(eventsByDay).forEach(day => {
        eventsByDay[day].sort((e1,e2) => {
            // get correct field (could be event or activity)
            const e1Start = e1.deadline ? e1.deadline : e1.startDate
            const e2Start = e2.deadline ? e2.deadline : e2.startDate
            return new Date(e1Start).getTime() - new Date(e2Start).getTime();
        });
    });
    
    return eventsByDay
}