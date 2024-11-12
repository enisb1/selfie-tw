import { RRule } from "rrule";

// using RRULE library to add all repeating events instances to
// array of events given as parameter
export function getAllEventsInstances(events) {
    const allEventsInstances = []
    for (const e of events) {
        if (e.frequency != 'none') {
            let frequency = null;
            switch (e.frequency) {
                case 'daily':
                    frequency = RRule.DAILY
                    break
                case 'weekly':
                    frequency = RRule.WEEKLY
                    break
                case 'monthly':
                    frequency = RRule.MONTHLY
                    break
                case 'yearly':
                    frequency = RRule.YEARLY
                    break
            }
            
            // one between count and until will be null and the other one will be
            // meaningful to calculate all the recurring events
            let rule = null
            if (e.repetitionNumber) 
                rule = new RRule({
                    freq: frequency,
                    interval: 1,
                    count: e.repetitionNumber,
                    dtstart: new Date(new Date(e.startDate).toISOString())
                })
            else
                rule = new RRule({
                    freq: frequency,
                    interval: 1,
                    until: new Date(new Date(e.repetitionDate).toISOString()),
                    dtstart: new Date(new Date(e.startDate).toISOString())
                })
            const recurringDates = rule.all() // get all dates given this recurrence
            for (const date of recurringDates) {
                // create copies of the event modifying start date and end date
                const eventDuration = new Date(e.endDate).getTime() - new Date(e.startDate).getTime()
                const eventRepeated = structuredClone(e);
                eventRepeated.startDate = date
                eventRepeated.endDate = new Date(date.getTime() + eventDuration)
                allEventsInstances.push(eventRepeated)
            }
        }
        else {
            allEventsInstances.push(e)
        }
    }
    return allEventsInstances;
}