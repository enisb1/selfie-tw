import { RRule } from 'rrule';
import { getUser } from '@/apis/users';

export async function getUnavailableRepeatedDates(userId) {
    try {
        const userData = await getUser(userId);
        let repeatedDates = [];

        if (userData.unavailableStart && userData.unavailableEnd) {
            let startDate = new Date(userData.unavailableStart);
            let endDate = new Date(userData.unavailableEnd);
            const inBetweenTime = endDate.getTime() - startDate.getTime()
            if (userData.unavailableFrequency && userData.unavailableFrequency !== 'none') {
                let frequency = null;
                switch (userData.unavailableFrequency) {
                    case 'daily':
                        frequency = RRule.DAILY;
                        break;
                    case 'weekly':
                        frequency = RRule.WEEKLY;
                        break;
                    case 'monthly':
                        frequency = RRule.MONTHLY;
                        break;
                    case 'yearly':
                        frequency = RRule.YEARLY;
                        break;
                }

                // one between count and until will be null and the other one will be
                // meaningful to calculate all the recurring events
                let rule = null
                if (userData.unavailableRepNumber) 
                    rule = new RRule({
                        freq: frequency,
                        interval: 1,
                        count: userData.unavailableRepNumber,
                        dtstart: new Date(startDate.toISOString())
                    })
                else
                    rule = new RRule({
                        freq: frequency,
                        interval: 1,
                        until: new Date(userData.unavailableRepDate.toISOString()),
                        dtstart: new Date(startDate.toISOString())
                    })

                if (rule) {
                    const dates = rule.all();
                    dates.forEach(date => {
                        repeatedDates.push([date, new Date(date.getTime() + inBetweenTime)]);
                    });
                }
            }
            else {
                repeatedDates.push([startDate, endDate]);
            }
        }

        return repeatedDates;
    } catch (error) {
        console.error('Error fetching unavailable data:', error);
        return [];
    }
}