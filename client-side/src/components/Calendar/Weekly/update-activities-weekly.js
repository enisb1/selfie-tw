export function updateActivitiesObject(activities) {
    let activitiesForDay = {};

    activities.forEach(a => {
        const deadline = new Date(new Date(a.deadline).setHours(0,0,0,0))

        if (activitiesForDay[deadline])
            activitiesForDay[deadline].push(a)
        else
            activitiesForDay[deadline] = [a]
    })

    // sort activities array based on start date
    Object.keys(activitiesForDay).forEach(day => {
        activitiesForDay[day].sort((a1,a2) => {
            return new Date(a1.deadline).getTime() - new Date(a2.deadline).getTime();
        });
    });

    // return sorted array from object containing [date, events] (events is an array of events for that day)
    return Object.entries(activitiesForDay)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
}