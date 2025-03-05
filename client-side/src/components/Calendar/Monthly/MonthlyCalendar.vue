<template>
    <!-- Monthly date picker -->
    <div class="text-center sm:text-left">
        <DatePicker class="inline-block mt-3 sm:ml-8 w-auto" v-model="monthSelected" month-picker :enable-time-picker="false"></DatePicker>
    </div>
    
    <!-- Calendar view -->
    <div v-show="view==='calendar'" class="mt-6">
        <!-- Header -->
        <div class="grid grid-cols-7">
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Monday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">M</div>
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Tuesday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">T</div>
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Wednesday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">W</div>
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Thursday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">T</div>
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Friday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">F</div>
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Saturday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">S</div>
            <div class="hidden sm:block border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Sunday</div>
            <div class="block sm:hidden border-b max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">S</div>
        </div>

        <div id="monthly_calendar_container" class="grid grid-cols-7">
            <div v-for="(date, index) in daysArray" :key="index" :class="getDynamicDayClass(date, index)" class="text-white border-b border-black border-r text-center border-r">
                <div class="bg-secondary"> {{ date.getDate() }}</div>

                <div v-if="!showResourcesCalendar" v-for="event in eventsForDay[index+1]" :data-event-id="event.startDate ? event._id : null" 
                :style="{backgroundColor: event.deadline ? 'crimson' : event.color}" 
                :class="{'line-through': event.isDone, 'font-bold': event.deadline,'opacity-75': event.startDate, 'event': event.startDate}" 
                class="px-1 mt-2 truncate cursor-pointer" @click="toggleScheduleInfoOn(event.originalEvent? event.originalEvent : event)">
                    <p> {{ event.deadline? `DEADLINE: '${event.title}'` : event.title }}</p>
                </div>
                <div v-else v-for="event in eventsForDay[index+1]" :data-event-id="event._id" :style="{backgroundColor: event.color}"
                    class="px-1 mt-2 truncate cursor-pointer opacity-75 event" @click="toggleResourceEventModalOn(event)">
                    <p>{{ event.resourceUsername }} used</p>
                </div>
            </div>
        </div>
    </div>

    <!-- List view -->
    <div v-show="view==='list'" class="flex flex-col items-center mx-auto w-3/4 text-white py-5">
        <!-- activities-->
        <div v-for="[day, activities] in filteredActivities" class="flex flex-row mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="px-4 rounded-xl py-2 font-bold" :style="{backgroundColor: 'crimson'}"> 
                {{ day }} {{ months[new Date(activities[0].deadline).getMonth()] }}
            </div>
            <div class="flew flex-col w-1/2">
                <div v-for="(activity, indexActivity) in activities" @click="toggleScheduleInfoOn(activity)" 
                    :class="{'line-through': activity.isDone, 'mt-4': indexActivity>0}" 
                    :style="{backgroundColor: 'crimson', fontStyle: 'bold'}"
                    class="w-full truncate px-4 rounded-xl py-2 font-bold cursor-pointer">
                        {{ `DEADLINE: '${activity.title}'` }} 
                </div>
            </div>
        </div>
        <!-- events -->
         <!-- TODO: remove activities style, only leave those of events -->
        <div v-for="[day, events] in filteredEvents" class="flex flex-row mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold"> {{ day }} {{ months[new Date(events[0].startDate).getMonth()] }}</div>
            <div class="flew flex-col w-1/2">
                <div v-for="(event, indexEvent) in events" @click="toggleScheduleInfoOn(event.originalEvent? event.originalEvent : event)" :class="{'mt-4': indexEvent>0}" 
                    :style="{backgroundColor: event.color}" :data-event-id="event._id" 
                    class="w-full truncate px-4 rounded-xl py-2 opacity-75 event cursor-pointer">
                        {{ event.title }} 
                </div>
            </div>
        </div>
    </div>

    <!-- Schedule info modal -->
    <!-- v-if and not v-show because scheduleObject is defined only when showScheduleModal is true (would give error with v-show) -->
    <Modal v-if="showScheduleModal" @close="toggleScheduleInfoOff">
        <header>
            <div class="flex items-center justify-between flex-row font-bold">
                <p class="text-truncate text-lg"> '{{ scheduleObject.title }}' {{ scheduleObject.pomodoroSettings? '&#127813' : '' }}</p>
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

    <!-- Resource event modal -->
    <Modal v-if="showResourceEventModal" @close="toggleResourceEventModalOff">
        <header>
            <div class="flex items-center justify-between flex-row font-bold">
                <p class="text-truncate text-lg">Info on used resource</p>
                <button type="button" @click="toggleResourceEventModalOff"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
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
import { onMounted } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'
import { watch } from 'vue'
import { updateSchedules } from './update-events-month.js'
import { computed } from 'vue'
import { getEvents, getActivitiesInRange, getResourcesEvents, removeResourceFromEvent } from '@/apis/calendar.js'
import { getAllEventsInstances } from '../repeated-events.js'
import Modal from '@/components/Modal.vue'
import EventInfoEdit from '../EventInfoEdit.vue'
import ActivityInfoEdit from '../ActivityInfoEdit.vue'
import { useStore } from 'vuex'

export default {
    emits: ['updateAllCalendars'],
    props : {
        view: String,
        showResourcesCalendar: Boolean
    },
    components : {
        DatePicker,
        Modal,
        EventInfoEdit,
        ActivityInfoEdit
    },
    setup(props) {
        const store = useStore()

        // object containing field month and field year
        const monthSelected = ref({"month": new Date().getMonth(), "year": new Date().getFullYear()});
        watch(monthSelected, () => {
            // update events to show and days header only if selected month is not null
            if (monthSelected.value) {
               updateDays()
               updateCalendar() 
            }
            
        })

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

        const getDynamicDayClass = (date, index) => {
            return {
                [`grid-col-start-${date.getDay()===0 ? 7 : date.getDay()}`]: index===0, // set starting grid col for first day
                'border-left': index===0    // set left border for first day
            };
        };

        // gets filled with the month's days and shown in template
        const daysArray = ref([])
        const firstDayOfMonth = ref()
        const lastDayOfMonth = ref()
        const updateDays = () => {
            firstDayOfMonth.value = new Date(monthSelected.value.year, monthSelected.value.month, 1)
            lastDayOfMonth.value = new Date(monthSelected.value.year, monthSelected.value.month+1, 0)
            // Loop through each day of the month and add to daysArray
            daysArray.value = []
            for (let day = 1; day <= lastDayOfMonth.value.getDate(); day++) {
                // Push a new Date object for each day into the array
                daysArray.value.push(new Date(monthSelected.value.year, monthSelected.value.month, day));
            }
        }

        // events object has day of month as key and array of events for that day as value
        const schedulesForDay = ref({})
        const updateCalendar = async () => {
            if (!props.showResourcesCalendar) {
                // fetch events from db and calculate all the events instances, including the one
                // that repeat themselves, filter for selected week and render
                const eventsFromDB = await getEvents(store.state._id)
                const allEventsInstances = getAllEventsInstances(eventsFromDB)  // get all instances, including those of repeating events
                const startDate = new Date(firstDayOfMonth.value)
                const endDate = new Date(new Date(lastDayOfMonth.value).setHours(23,59,59,999))
                const events = allEventsInstances.filter(e => {
                    const eventEndDate = new Date(e.endDate)
                    const eventStartDate = new Date(e.startDate)
                    return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
                    || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
                    || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
                })
                // fetch activities
                const activities = await getActivitiesInRange(startDate, endDate, store.state._id)
                // update calendar
                schedulesForDay.value = updateSchedules(events, activities, startDate, endDate)
            }
            else {
                const resourcesEvents = await getResourcesEvents()
                const allEventsInstances = getAllEventsInstances(resourcesEvents)  // get all instances, including those of repeating events
                const startDate = new Date(firstDayOfMonth.value)
                const endDate = new Date(new Date(lastDayOfMonth.value).setHours(23,59,59,999))
                const events = allEventsInstances.filter(e => {
                    const eventEndDate = new Date(e.endDate)
                    const eventStartDate = new Date(e.startDate)
                    return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
                    || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
                    || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
                })
                const schedules = updateSchedules(events, null, startDate, endDate)
                // build structure for resource events
                // Result structure
                const transformedEventsByDay = {};

                // build a new object with day as key and as value an array containing one event for 
                // each resource in matchedResources
                // (with an added field resourceUsername corresponding to the username of that specific resource)
                for (const [day, events] of Object.entries(schedules)) {
                    const transformedEvents = [];
                    events.forEach(event => {
                        event.matchedResources.forEach(resource => {
                            // Clone the event and add the resource
                            const newEvent = { ...event, resourceUsername: resource.username, resourceId: resource._id, eventId: event._id }    // copy event and add resource
                            delete newEvent.matchedResources // remove matchedResources field (optional)
                            transformedEvents.push(newEvent)
                        });
                    });
                    transformedEventsByDay[day] = transformedEvents
                }
                schedulesForDay.value = transformedEventsByDay
                console.log(transformedEventsByDay)
            }
        }

        // resource event modal
        const showResourceEventModal = ref(false)
        const resourceEvent = ref()
        const toggleResourceEventModalOn = (event) => {
            resourceEvent.value = event
            showResourceEventModal.value = true
        }
        const toggleResourceEventModalOff = () => {
            showResourceEventModal.value = false
        }
        const removeResource = async () => {
            await removeResourceFromEvent(resourceEvent.value.resourceId, resourceEvent.value.eventId)
            updateCalendar()
            toggleResourceEventModalOff()
        }
        const resourceDateFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // (12 hour format)
        }

        // remove empty arrays and filter to only events
        const filteredEvents = computed(() => {
            return Object.entries(schedulesForDay.value)
            .filter(([day, events]) => events && events.length > 0)
            .map(([day, events]) => [
                day,
                events.filter(event => !event.deadline)
            ])
            .filter(([day, events]) => events.length > 0)
        })

        // remove empty arrays and filter to only activities
        const filteredActivities = computed(() => {
            return Object.entries(schedulesForDay.value)
            .filter(([day, events]) => events && events.length > 0)
            .map(([day, events]) => [
                day,
                events.filter(event => event.deadline)
            ])
            .filter(([day, events]) => events.length > 0)
        })

        // event boxes hover effect
        const addHoverOnEventBoxes = () => {
            const eventBoxes = document.querySelectorAll('.event');
            eventBoxes.forEach(eventBox => {
                eventBox.addEventListener('mouseover', () => {
                    const eventId = eventBox.getAttribute('data-event-id');
                    document.querySelectorAll(`.event[data-event-id="${eventId}"]`).forEach(e => {
                        e.classList.remove('opacity-75');
                        e.classList.add('font-bold')
                    });
                });

                eventBox.addEventListener('mouseout', () => {
                    const eventId = eventBox.getAttribute('data-event-id');
                    document.querySelectorAll(`.event[data-event-id="${eventId}"]`).forEach(e => {
                        e.classList.add('opacity-75');
                        e.classList.remove('font-bold')
                    });
                });
            });
        }

        // schedule info modal
        const showScheduleModal = ref(false)
        const scheduleObject = ref()
        const toggleScheduleInfoOn = (schedule) => {
            scheduleObject.value = schedule
            showScheduleModal.value = true
        }
        const toggleScheduleInfoOff = () => {
            showScheduleModal.value = false
        }

        // lifecycle hooks
        onMounted(() => {
            // set calendar to occupy at least the size of the viewport
            const calendarContainer = document.getElementById("monthly_calendar_container")
            const top = calendarContainer.getBoundingClientRect().top
            const remainingHeight = window.innerHeight - top    // window.innerHeight is the height of the viewport
            // set monthly calendar grid to take up the remaining vertical space of the viewport
            calendarContainer.style.minHeight = `${remainingHeight}px`
            
            // TODO: call only if in monthly calendar mode, then test
            updateDays()
            updateCalendar()

            // initialize MutationObserver to detect changes in the DOM
            const observer = new MutationObserver(() => {
                addHoverOnEventBoxes(); // reapply hover listener on event boxes whenever DOM changes
            });
            // observe the body (where event boxes are added)
            observer.observe(document.body, { childList: true, subtree: true });
        })
        
        return {
            monthSelected,
            daysArray,
            getDynamicDayClass,
            eventsForDay: schedulesForDay,
            updateCalendar,
            months,
            filteredEvents,
            filteredActivities,
            scheduleObject,
            showScheduleModal,
            toggleScheduleInfoOn,
            toggleScheduleInfoOff,
            toggleResourceEventModalOn,
            toggleResourceEventModalOff,
            resourceEvent,
            showResourceEventModal,
            resourceDateFormat,
            removeResource,
            store
        }
    }
}
</script>

<style scoped>
    /* these classes are needed because tailwind doesn't recognize vue's dynamically generated classes */
    .grid-col-start-1 {
        grid-column-start: 1;
    }

    .grid-col-start-2 {
        grid-column-start: 2;
    }

    .grid-col-start-3 {
        grid-column-start: 3;
    }

    .grid-col-start-4 {
        grid-column-start: 4;
    }

    .grid-col-start-5 {
        grid-column-start: 5;
    }

    .grid-col-start-6 {
        grid-column-start: 6;
    }

    .grid-col-start-7 {
        grid-column-start: 7;
    }

    .border-left {
        border-left-width: 1px;
    }
</style>