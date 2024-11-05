<template>
    <!-- Daily date picker -->
    <div class="text-center sm:text-left">
        <DatePicker class="inline-block mt-3 sm:ml-8 w-auto" v-model="selectedDate" :enable-time-picker="false"
        :format="formatDate"></DatePicker>
    </div>
        
    <!-- Daily calendar, part of the style is in daily-calendar.css -->
    <div id="daily_calendar" class="grid mt-6" v-show="view==='calendar'">
        <div id="daily_calendar_timeslots_container">
            <div class="daily_timeslot bg-secondary min-h-16 text-white">00:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">01:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">02:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">03:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">04:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">05:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">06:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">07:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">08:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">09:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">10:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">11:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">12:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">13:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">14:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">15:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">16:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">17:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">18:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">19:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">20:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">21:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">22:00</div>
            <div class="daily_timeslot bg-secondary min-h-16 text-white">23:00</div>
        </div>

        <div id="daily_header" class="bg-secondary text-white text-center font-semibold py-1">
            {{ new Date(selectedDate).toLocaleDateString("en-BR", headerFormatOptions) }}
        </div>

        <div id="daily_events_container">
        </div>
    </div>

    <div v-show="view==='list'" class="flex flex-col items-center mx-auto w-3/4 text-white py-5">
        <div v-show="eventsBeforeMidnight.length>0" class="flex flex-row 
            mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold">00:00</div>
            <div class="flew flex-col w-1/2">
                <div v-for="(event, indexEvent) in eventsBeforeMidnight" :class="{'mt-4': indexEvent>0}" class="opacity-75 hover:opacity-100 hover:font-bold w-full truncate bg-secondary px-4 rounded-xl py-2">
                    {{ event.title }} 
                </div>
            </div>
        </div>

        <div v-for="[startTime, events] in Object.entries(eventsAfterMidnight)" class="flex flex-row 
        mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold">{{ startTime }}</div>
            <div class="flew flex-col w-1/2">
                <div v-for="(event, indexEvent) in events" :class="{'mt-4': indexEvent>0}" :style="{backgroundColor: event.color}" class="opacity-75 hover:opacity-100 hover:font-bold w-full truncate px-4 rounded-xl py-2">
                    {{ event.title }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import { renderEvents } from './render-events-day.js';
import { watch } from 'vue';
import { getEventsInRange } from '@/apis/calendar.js';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { RRule } from 'rrule';
import { getEvents } from '@/apis/calendar.js';

export default {
    props : {
        view: String
    },
    components: {
        DatePicker
    },
    setup() {
        const selectedDate = ref(new Date());   // default date = current date
        watch(selectedDate, () => {
            eventsSelectedDay.value = []   // needed for changing day smoothly in list view
                                // debugging I've seen that computed properties run before updateEvents
            updateEvents()
        })
        
        // events
        const eventsSelectedDay = ref([]);
        const updateEvents = async () => {
            // fetch events from db and calculate all the events instances, including the one
            // that repeat themselves, filter for selected day and render
            const eventsFromDB = await getEvents()
            const allEventsInstances = getAllEventsInstances(eventsFromDB)  // get all instances, including those of repeating events
            console.log(allEventsInstances)
            const startDate = new Date(new Date(selectedDate.value).setHours(0,0,0,0));
            const endDate = new Date(new Date(selectedDate.value).setHours(23, 59, 59, 999));
            // filter all events instances getting only those that concern the selected day
            eventsSelectedDay.value = allEventsInstances.filter(e => {
                const eventEndDate = new Date(e.endDate)
                const eventStartDate = new Date(e.startDate)
                return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
                || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
                || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
            })
            console.log(eventsSelectedDay.value)
        }
        // watch for updates to events and render them
        watch(eventsSelectedDay, (newEvents) => {
            renderEvents(newEvents, selectedDate.value);
        });

        // using RRULE library to add all repeating events instances to events param
        const getAllEventsInstances = (events) => {
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
                    if (e.title == 'repeat at 8 by date') {
                        console.log('at 8')
                        console.log(recurringDates)
                    }
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

        const eventsBeforeMidnight = computed(() => {
            if (eventsSelectedDay.value) {
                const todayStart = new Date(new Date(selectedDate.value).setHours(0,0,0,0))
                return eventsSelectedDay.value.filter((e) => {
                    return new Date(e.startDate).getTime() <= todayStart.getTime()
                })
            }
            else
                return []
            
        })

        const eventsAfterMidnight = computed(() => {
            if (eventsSelectedDay.value) {
                const eventsAfterMidnightArray = eventsSelectedDay.value.filter(e => 
                    !eventsBeforeMidnight.value.some(eventBeforeMidnight => eventBeforeMidnight._id === e._id))
                .sort((e1,e2) => e1.startInMinutes - e2.startInMinutes);
                
                const groupedEvents = {};
                eventsAfterMidnightArray.forEach(event => {
                    const startDate = new Date(event.startDate);

                    // format time key as hh:mm
                    const timeKey = startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

                    // initialize array for this time key if it doesn't exist
                    if (!groupedEvents[timeKey]) {
                        groupedEvents[timeKey] = [];
                    }

                    // add event to the array for this time key
                    groupedEvents[timeKey].push(event);
                });
                return groupedEvents;
            }
            else
                return {};
        })
        
        // format date
        const formatDate = (date) => {
            // format date to dd/mm/yyyy
            return date ? date.toLocaleDateString('it-IT') : '';
        }

        const headerFormatOptions = {
            weekday: 'long',  // Full name of the day (e.g., "Monday")
            day: 'numeric',    // Day of the month (e.g., 1, 2, ..., 31)
            month: 'long'      // Full name of the month (e.g., "January")
        }
        
        // lifecycle hooks
        onMounted(() => {
            updateEvents();
        })

        return {
            selectedDate,
            formatDate,
            updateEvents,
            eventsBeforeMidnight,
            eventsAfterMidnight,
            headerFormatOptions
        }
    }
}
</script>

<style scoped>
    #daily_calendar {
        grid-template-columns: 4rem auto;
        grid-template-rows: auto;
        grid-template-areas: 
        ". header"
        "timeslots_container main";
    }

    #daily_header {
        grid-area: header;
    }

    #daily_calendar_timeslots_container {
        grid-area: timeslots_container;
    }

    #daily_events_container {
        grid-area: main;
        display: grid;
        white-space: nowrap;
        grid-template-rows: repeat(288, 1fr);
        position: relative; /*devo settare una position perché i figli con position absolute si allacciano al
                            padre più prossimo che ha la position settata a qualcosa diverso da static(default)*/
    }

    /* linee del calendario */
    .daily_timeslot::after {
        content: '';
        position: absolute;
        left: 0px;
        width: 100%;
        height: 0.1rem;
        background: black;
    }
</style>