import ICAL from 'ical.js';
import { getUserIdsByEmails } from '@/apis/users';

export async function getEventsFromIcsString(icsContent) {
    const jcalData = ICAL.parse(icsContent);
    const vcalendar = new ICAL.Component(jcalData);
    const vevents = vcalendar.getAllSubcomponents('vevent');

    const events = await Promise.all(vevents.map(async (vevent) => {
        const event = new ICAL.Event(vevent);

        // extract recurrence rule
        const rruleProperty = vevent.getFirstProperty('rrule');

        let frequency = 'none';
        let repetitionNumber = null;
        let repetitionDate = null;

        if (rruleProperty) {
            const rruleData = rruleProperty.getFirstValue();
            const rrule = ICAL.Recur.fromData(rruleData);
            frequency = rrule.freq.toLowerCase();
            repetitionNumber = rrule.count ? rrule.count : null;
            repetitionDate = rrule.until ? new Date(rrule.until) : null;
        }

        // extract attendees and build users of the event
        const attendeeProperties = vevent.getAllProperties('attendee');
        const attendeesEmails = attendeeProperties.map((attendeeProperty) => {
            const value = attendeeProperty.getFirstValue();
            return value.replace('MAILTO:', '');
        });
        const userIds = await getUserIdsByEmails(attendeesEmails);

        return {
            title: event.summary,
            startDate: event.startDate.toJSDate(),
            endDate: event.endDate.toJSDate(),
            location: event.location,
            frequency: frequency,
            repetitionNumber: repetitionNumber,
            repetitionDate: repetitionDate,
            users: userIds
        };
    }));

    return events;
}