export function updateActivitiesObject(activities) {
    activities.sort((a1,a2) => {
        return new Date(a1.deadline).getTime() - new Date(a2.deadline).getTime();
    })
    let activitiesForDay = {};

    activities.forEach(a => {
        const startDate = new Date(a.deadline);
        const timeKey = startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

        if (activitiesForDay[timeKey])
            activitiesForDay[timeKey].push(a);
        else
            activitiesForDay[timeKey] = [a];
    })

    return activitiesForDay;
}