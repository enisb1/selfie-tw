import { getUsers } from "@/apis/users";

export async function getCalendarOptions(event, currentUserId) {
    // attendees
    const usersObjects = await getUsers(event.users);
    const usersWithoutSelf = usersObjects.filter(user => user._id !== currentUserId);
    const attendees = usersWithoutSelf.map(user => {
        return {
            name: user.firstName,
            email: user.email
        }
    });

    // recurrence
    const recurrence = {
        frequency: event.frequency.toUpperCase(),
        interval: 1,
        count: event.repetitionNumber? event.repetitionNumber : undefined,
        end: event.repetitionDate? event.repetitionDate : undefined
    };
    
    return {
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        location: event.location,
        attendees: attendees,
        recurrence: event.frequency !== 'none' ? recurrence : undefined
    };
}

export function getICalendarAlarms(event) {
    const alarms = []

    // 15 minutes before the event
    if (event.notify15Before) {
        const triggerDate = new Date(event.startDate);
        triggerDate.setMinutes(triggerDate.getMinutes() - 15);
        alarms.push(
            {
                action: 'EMAIL',
                summary: event.title,
                description: event.title + ' starting in 15 minutes',
                trigger: {
                    minutes: triggerDate.toISOString()
                },
            }
        )
    }

    // 30 minutes before the event
    if (event.notify30Before) {
        const triggerDate = new Date(event.startDate);
        triggerDate.setMinutes(triggerDate.getMinutes() - 30);
        alarms.push(
            {
                action: 'EMAIL',
                summary: event.title,
                description: event.title + ' starting in 30 minutes',
                trigger: {
                    minutes: triggerDate.toISOString()
                },
            }
        )
    }

    // 1 hour before the event
    if (event.notify1HourBefore) {
        const triggerDate = new Date(event.startDate);
        triggerDate.setMinutes(triggerDate.getMinutes() - 60);
        alarms.push(
            {
                action: 'EMAIL',
                summary: event.title,
                description: event.title + ' starting in 1 hour',
                trigger: {
                    minutes: triggerDate.toISOString()
                },
            }
        )
    }

    // 1 day before the event
    if (event.notify1DayBefore) {
        const triggerDate = new Date(event.startDate);
        triggerDate.setMinutes(triggerDate.getMinutes() - 60*24);
        alarms.push(
            {
                action: 'EMAIL',
                summary: event.title,
                description: event.title + ' starting in 1 day',
                trigger: {
                    minutes: triggerDate.toISOString()
                },
            }
        )
    }

    return alarms;
}

export function exportEventToICS(event) {

}