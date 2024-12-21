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
            {{ headerDay }}
        </div>

        <div id="daily_events_container">
        </div>
    </div>

    <!-- List view -->
    <div v-show="view==='list'" class="flex flex-col items-center mx-auto text-white py-5">
        <div v-for="[startTime, activities] in Object.entries(activitiesSelectedDay)" class="flex flex-row 
        mt-4 justify-between items-start w-full bg-white bg-opacity-50 py-4 px-2 rounded-lg sm:w-1/2">
            <div class="px-4 rounded-xl py-2 font-bold" :style="{backgroundColor: 'crimson'}">{{ startTime }}</div>
            <div class="flew flex-col w-1/2">
                <div v-for="(activity, indexActivity) in activities" @click="toggleScheduleInfoOn(activity)" 
                    :class="{'line-through': activity.isDone, 'mt-4': indexActivity>0}" :style="{backgroundColor: 'crimson'}" 
                    class="font-bold w-full truncate px-4 rounded-xl py-2 cursor-pointer">
                    {{ `DEADLINE: '${activity.title}'` }}
                </div>
            </div>
        </div>

        <div v-show="eventsBeforeMidnight.length>0" class="flex flex-row 
            mt-4 justify-between items-start w-full sm:w-1/2 px-2">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold">00:00</div>
            <div class="flew flex-col bg-white bg-opacity-50 rounded-lg py-4 px-2 w-3/4">
                <div class="flex justify-between items-center" :class="{'mt-4': indexEvent>0}" 
                    v-for="(event, indexEvent) in eventsBeforeMidnight">
                    <div @click="toggleScheduleInfoOn(event.originalEvent? event.originalEvent : event)" :style="{backgroundColor: event.color}" class="px-4 opacity-75 hover:opacity-100 hover:font-bold 
                    truncate bg-secondary rounded-xl py-2 cursor-pointer max_width_half">
                        {{ event.title }}
                    </div>
                    <div class="bg-secondary px-4 rounded-xl py-2 font-semibold truncate">
                        {{ new Date(event.endDate).getTime()>new Date(new Date(selectedDate).setHours(23,59,59,999)).getTime()? 
                        `${new Date(event.endDate).getDate()} ${months[new Date(event.endDate).getMonth()]}` :
                        new Date(event.endDate).toLocaleTimeString('it-IT', {hour:"2-digit", minute:"2-digit"})}}
                    </div>
                </div>
            </div>
        </div>

        <div v-for="[startTime, events] in Object.entries(eventsAfterMidnight)" class="flex flex-row 
            mt-4 justify-between items-start w-full sm:w-1/2 px-2">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold">{{ startTime }}</div>
            <div class="flew flex-col bg-white bg-opacity-50 rounded-lg py-4 px-2 w-3/4">
                <div class="flex justify-between items-center" :class="{'mt-4': indexEvent>0}" 
                    v-for="(event, indexEvent) in events">
                    <div @click="toggleScheduleInfoOn(event.originalEvent? event.originalEvent : event)" :class="{'mt-4': indexEvent>0}" 
                        :style="{backgroundColor: event.color}" class="px-4 opacity-75 hover:opacity-100 hover:font-bold 
                        truncate bg-secondary rounded-xl py-2 cursor-pointer max_width_half">
                        {{ event.title }}
                    </div>
                    <div class="bg-secondary px-4 rounded-xl py-2 font-semibold truncate">
                        {{ new Date(event.endDate).getTime()>new Date(new Date(selectedDate).setHours(23,59,59,999)).getTime()? 
                        `${new Date(event.endDate).getDate()} ${months[new Date(event.endDate).getMonth()]}` :
                        new Date(event.endDate).toLocaleTimeString('it-IT', {hour:"2-digit", minute:"2-digit"})}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Schedule info modal -->
    <!-- v-if and not v-show because scheduleObject is defined only when showScheduleModal is true (would give error with v-show) -->
    <Modal v-if="showScheduleModal" @close="toggleScheduleInfoOff">
        <header>
            <div class="flex items-center justify-between flex-row font-bold">
                <p class="text-truncate text-lg"> '{{ scheduleObject.title }}'</p>
                <button type="button" @click="toggleScheduleInfoOff"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
                src="../../../images/x.png" alt="Croce"></button>
            </div>
            <hr style="border-color: black"/>
        </header>

        <!-- Event Modal -->
        <div v-if="scheduleObject.startDate">
            <EventInfoEdit :eventObject="scheduleObject" @updateAllCalendars="$emit('updateAllCalendars')" 
                @close="toggleScheduleInfoOff"></EventInfoEdit>
        </div>
        <!-- Activity Modal-->
        <div v-else-if="scheduleObject.deadline">
            <ActivityInfoEdit :activityObject="scheduleObject" @updateAllCalendars="$emit('updateAllCalendars')" 
                @close="toggleScheduleInfoOff"></ActivityInfoEdit>
        </div>
    </Modal>

    <!-- Resource event info modal -->
    <!-- v-if and not v-show because scheduleObject is defined only when showScheduleModal is true (would give error with v-show) -->
    <Modal v-if="showResourceEventModal" @close="toggleResourceEventInfoOff">
        <header>
            <div class="flex items-center justify-between flex-row font-bold">
                <p class="text-truncate text-lg">Info on used resource</p>
                <button type="button" @click="toggleResourceEventInfoOff"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
                src="../../../images/x.png" alt="Croce"></button>
            </div>
            <hr style="border-color: black"/>
        </header>

        <div class="flex flex-col">
            <!-- title -->
            <div class="mt-4">
                <p class="font-semibold text-base">Used resource</p>
                <p>{{ resourceEvent.resourceUsername }}</p>
            </div>
            <!-- start -->
            <div class="mt-4">
                <p class="font-semibold text-base">Start</p>
                <p>{{ new Date(resourceEvent.startDate).toLocaleDateString('it-IT', resourceDateFormat) }}</p>
            </div>
            <!-- end -->
            <div class="mt-4">
                <p class="font-semibold text-base">End</p>
                <p>{{ new Date(resourceEvent.endDate).toLocaleDateString('it-IT', resourceDateFormat) }}</p>
            </div>
        </div>

        <!-- delete button -->
        <button v-show="store.state.isAdmin" @click="removeResource" class="w-full mt-4 rounded-md 
                bg-red-500 px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Remove resource</button>
    </Modal>
</template>

<script>
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import { renderCalendar } from './render-calendar-day.js';
import { watch } from 'vue';
import { onMounted, onBeforeUnmount } from 'vue';
import { computed } from 'vue';
import { getAllEventsInstances } from '../repeated-events.js';
import { getEvents, getActivitiesInRange, getResourcesEvents, removeResourceFromEvent } from '@/apis/calendar.js';
import Modal from '@/components/Modal.vue';
import EventInfoEdit from '../EventInfoEdit.vue';
import ActivityInfoEdit from '../ActivityInfoEdit.vue';
import { useStore } from 'vuex';

export default {
    emits: ['updateAllCalendars'],
    props : {
        view: String,
        showResourcesCalendar: Boolean
    },
    components: {
        DatePicker,
        Modal,
        EventInfoEdit,
        ActivityInfoEdit
    },
    setup(props) {
        const store = useStore()

        const selectedDate = ref(new Date());   // default date = current date
        watch(selectedDate, () => {
            // update events to show and day header only if selected month is not null
            if (selectedDate.value) {
                eventsSelectedDay.value = []   // needed for changing day smoothly in list view
                                // debugging I've seen that computed properties run before updateEvents
                updateCalendar()
                updateHeaderDay()
            }
        })
        
        // events
        const eventsSelectedDay = ref([])
        const activities = ref()
        const updateCalendar = async () => {
            if (!props.showResourcesCalendar) {
                // fetch events from db and calculate all the events instances, including the one
                // that repeat themselves, filter for selected day and render
                const eventsFromDB = await getEvents(store.state._id)
                const allEventsInstances = getAllEventsInstances(eventsFromDB)  // get all instances, including those of repeating events
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

                // fetch activities
                activities.value = await getActivitiesInRange(startDate, endDate, store.state._id)

                renderCalendar(eventsSelectedDay.value, activities.value, selectedDate.value, false);
            }
            else {
                const resourcesEvents = await getResourcesEvents()
                const startDate = new Date(new Date(selectedDate.value).setHours(0,0,0,0));
                const endDate = new Date(new Date(selectedDate.value).setHours(23, 59, 59, 999));
                // filter all events instances getting only those that concern the selected day
                eventsSelectedDay.value = resourcesEvents.filter(e => {
                    const eventEndDate = new Date(e.endDate)
                    const eventStartDate = new Date(e.startDate)
                    return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
                    || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
                    || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
                })
                renderCalendar(eventsSelectedDay.value, null, selectedDate.value, true)
            }
        }

        const resourceEvent = ref()
        const removeResource = async () => {
            await removeResourceFromEvent(resourceEvent.value.resourceId, resourceEvent.value.eventId)
            updateCalendar()
            toggleResourceEventInfoOff()
        }
        const showResourceEventModal = ref(false)
        const toggleResourceEventInfoOnFromEvent = (event) => {
            resourceEvent.value = event.detail
            showResourceEventModal.value = true
        }
        const toggleResourceEventInfoOff = () => {
            showResourceEventModal.value = false
        }
        const resourceDateFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // (12 hour format)
        }

        const headerDay = ref('')
        // updated only if selectedDate is not null
        const updateHeaderDay = () => {
            headerDay.value = new Date(selectedDate.value).toLocaleDateString("en-BR", headerFormatOptions)
        }
        const headerFormatOptions = {
            weekday: 'long',  // Full name of the day (e.g., "Monday")
            day: 'numeric',    // Day of the month (e.g., 1, 2, ..., 31)
            month: 'long'      // Full name of the month (e.g., "January")
        }

        const activitiesSelectedDay = computed(() => {
            if (eventsSelectedDay.value && activities.value) {
                activities.value.sort((a1,a2) => {
                return new Date(a1.deadline).getTime() - new Date(a2.deadline).getTime();
                })
                let activitiesForDay = {};

                activities.value.forEach(a => {
                    const startDate = new Date(a.deadline);
                    const timeKey = startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

                    if (activitiesForDay[timeKey])
                        activitiesForDay[timeKey].push(a);
                    else
                        activitiesForDay[timeKey] = [a];
                })

                return activitiesForDay;
            }
            else {
                return {}
            }
        })

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
        
        // schedule info modal
        const showScheduleModal = ref(false)
        const scheduleObject = ref()
        const toggleScheduleInfoOnFromEvent = (event) => {
            scheduleObject.value = event.detail
            showScheduleModal.value = true
        }
        const toggleScheduleInfoOn = (schedule) => {
            scheduleObject.value = schedule
            showScheduleModal.value = true
        }
        const toggleScheduleInfoOff = () => {
            showScheduleModal.value = false
        }

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        // lifecycle hooks
        onMounted(() => {
            updateCalendar()
            updateHeaderDay()

            // listen to schedule boxes click event
            window.addEventListener('showScheduleInfoDaily', toggleScheduleInfoOnFromEvent);
            window.addEventListener('showResourceEventDaily', toggleResourceEventInfoOnFromEvent);
        })
        
        onBeforeUnmount(() => {
            // remove event listener when component is destroyed to not make them stack
            window.removeEventListener('showScheduleInfo', toggleScheduleInfoOnFromEvent);
        })

        return {
            selectedDate,
            formatDate,
            updateCalendar,
            eventsBeforeMidnight,
            eventsAfterMidnight,
            headerFormatOptions,
            headerDay,
            activitiesSelectedDay,
            showScheduleModal,
            scheduleObject,
            toggleScheduleInfoOn,
            toggleScheduleInfoOff,
            months,
            toggleResourceEventInfoOnFromEvent,
            resourceEvent,
            showResourceEventModal,
            toggleResourceEventInfoOff,
            resourceDateFormat,
            removeResource,
            store
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

    .max_width_half {
        max-width: 55%;
    }
</style>