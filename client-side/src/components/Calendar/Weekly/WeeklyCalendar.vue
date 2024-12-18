<template>
    <!-- Weekly date picker -->
    <div class="text-center sm:text-left">
        <DatePicker class="inline-block mt-3 sm:ml-8 w-auto" v-model="weekSelected" week-picker :enable-time-picker="false"
        :format="formatWeek"></DatePicker>
    </div>

    <!-- Calendar view -->
    <div id="weekly_calendar_container" class="grid overflow-x-scroll" v-show="view === 'calendar'">
        <div id="week_calendar_header" class="mt-6">
            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Monday</div>
                <div>{{ new Date(headerWeekDays[0]).getDate() }}</div>
            </div>
            
            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Tuesday</div>
                <div>{{ new Date(headerWeekDays[1]).getDate() }}</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Wednesday</div>
                <div>{{ new Date(headerWeekDays[2]).getDate() }}</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Thursday</div>
                <div>{{ new Date(headerWeekDays[3]).getDate() }}</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Friday</div>
                <div>{{ new Date(headerWeekDays[4]).getDate() }}</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Saturday</div>
                <div>{{ new Date(headerWeekDays[5]).getDate() }}</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Sunday</div>
                <div>{{ new Date(headerWeekDays[6]).getDate() }}</div>
            </div>
        </div>

        <div id="timeslots_container" class="text-left">
            <div class="timeslot bg-secondary min-h-16 text-white">
                00:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                01:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                02:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                03:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                04:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                05:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                06:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                07:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                08:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                09:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                10:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                11:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                12:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                13:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                14:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                15:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                16:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                17:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                18:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                19:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                20:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                21:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                22:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                23:00
            </div>
        </div>

        <div id="weekly_events_container">
        </div>
    </div>

    <!-- List view -->
    <div v-show="view === 'list'" class="flex flex-col items-center mx-auto w-3/4 text-white py-5">
        <div v-for="[day, activities] in activitiesForDay" class="flex flex-row mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="bg px-4 rounded-xl py-2 font-bold" :style="{backgroundColor: 'crimson'}"> 
                {{ new Date(day).getDate() }} {{ months[new Date(day).getMonth()] }}
            </div>
            <div class="flew flex-col w-1/2">
                <div v-for="(activity, indexActivity) in activities" @click="toggleScheduleInfoOn(activity)" 
                    :class="{'line-through': activity.isDone,'mt-4': indexActivity>0}" 
                    :style="{backgroundColor: 'crimson'}" class="w-full 
                    font-bold truncate px-4 rounded-xl py-2 cursor-pointer">
                        {{ `DEADLINE: '${activity.title}'` }} 
                </div>
            </div>
        </div>
        <div v-for="[day, events] in eventsForDay" class="flex flex-row mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold"> {{ new Date(day).getDate() }} {{ months[new Date(day).getMonth()] }}</div>
            <div class="flew flex-col w-1/2">
                <div v-for="(event, indexEvent) in events" @click="toggleScheduleInfoOn(event)" :class="{'mt-4': indexEvent>0}" 
                    :data-event-id="event._id" :style="{backgroundColor: event.color}" class="event w-full 
                    opacity-75 truncate px-4 rounded-xl py-2 cursor-pointer">
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
                <p class="text-truncate text-lg"> '{{ scheduleObject.title }}'</p>
                <button type="button" @click="toggleScheduleInfoOff"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
                src="../../../images/x.png" alt="Croce"></button>
            </div>
            <hr style="border-color: black"/>
        </header>

        <!-- Event Modal -->
        <div v-if="scheduleObject.startDate && showScheduleInfo">
            <EventInfoEdit :eventObject="scheduleObject" @updateAllCalendars="$emit('updateAllCalendars')" 
                @close="toggleScheduleInfoOff"></EventInfoEdit>
        </div>
        <!-- Activity Modal-->
        <div v-else-if="scheduleObject.deadline && showScheduleInfo">
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
import { onBeforeUnmount, ref } from 'vue';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { renderCalendar } from './render-calendar-week';
import { updateEventsForDay } from './update-events-weekly';
import { getActivitiesInRange, getEvents, getResourcesEvents, removeResourceFromEvent } from '@/apis/calendar.js';
import { getAllEventsInstances } from '../repeated-events';
import { updateActivitiesForDay } from './update-activities-weekly';
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

        const getStartOfWeek = (date) => {
            const startOfWeek = new Date(date);
            const dayOfWeek = startOfWeek.getDay();
            const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);
            return startOfWeek
        }

        const getEndOfWeek = (date) => {
            const startOfWeek = getStartOfWeek(date)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return endOfWeek
        }

        // initialize weekSelected with an array containing 1st and 2nd day of the week
        const weekSelected = ref([getStartOfWeek(new Date()), getEndOfWeek(new Date())])
        watch(weekSelected, () => {
            // update events to show and days header only if selected week is not null
            if (weekSelected.value) {
                updateCalendar()
                updateHeaderWeekDays()
            }
        })

        const headerWeekDays = ref([])
        // updated only if selected week is not null
        const updateHeaderWeekDays = () => {
            for (let i = 0; i<7; i++) {
                headerWeekDays.value[i] = new Date(weekSelected.value[0].getTime() + i* 24 * 60 * 60 * 1000)
            }
        }

        // events
        const events = ref()
        // TODO: remove this if not needed as reactive but only as variable in updateEvents
        const activitiesForDay = ref()
        // eventsForDay is an array containing [date, events] (in which events is an array of events
        // for the paired day)
        const eventsForDay = ref([])
        const updateCalendar = async () => {
            if (!props.showResourcesCalendar) {
                // fetch events from db and calculate all the events instances, including the one
            // that repeat themselves, filter for selected week and render
            const eventsFromDB = await getEvents(store.state._id)
            const allEventsInstances = getAllEventsInstances(eventsFromDB)  // get all instances, including those of repeating events
            const startDate = new Date(new Date(weekSelected.value[0]).setHours(0,0,0,0))
            const endDate = new Date(new Date(weekSelected.value[1]).setHours(23, 59, 59, 999))
            events.value = allEventsInstances.filter(e => {
                const eventEndDate = new Date(e.endDate)
                const eventStartDate = new Date(e.startDate)
                return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
                || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
                || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
            })

            // fetch activities
            const activities = await getActivitiesInRange(startDate, endDate, store.state._id)

            // render calendar view
            renderCalendar(events.value, activities, false)
            // update activitiesForDay object for list view
            activitiesForDay.value = updateActivitiesForDay(activities)
            // update eventsForDay object for list view
            eventsForDay.value = updateEventsForDay(events.value, startDate, endDate)
            }
            else {
                const resourcesEvents = await getResourcesEvents()
                const startDate = new Date(new Date(weekSelected.value[0]).setHours(0,0,0,0))
                const endDate = new Date(new Date(weekSelected.value[1]).setHours(23, 59, 59, 999))
                events.value = resourcesEvents.filter(e => {
                    const eventEndDate = new Date(e.endDate)
                    const eventStartDate = new Date(e.startDate)
                    return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
                    || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
                    || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
                })
                renderCalendar(events.value, null, true)
            }
        }
        const resourceEvent = ref()
        const showResourceEventModal = ref(false)
        const toggleResourceEventInfoOnFromEvent = (event) => {
            resourceEvent.value = event.detail
            showResourceEventModal.value = true
        }
        const toggleResourceEventInfoOff = () => {
            showResourceEventModal.value = false
        }
        const removeResource = async () => {
            await removeResourceFromEvent(resourceEvent.value.resourceId, resourceEvent.value.eventId)
            updateCalendar()
            toggleResourceEventInfoOff()
        }
        const resourceDateFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // (12 hour format)
        }
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

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
                    });
                });
            });
        }

        // format week (input = date selected within the week)
        const formatWeek = (date) => {
            if (!date) return '';
      
            const startOfWeek = getStartOfWeek(date);
            const endOfWeek = getEndOfWeek(date);

            // format weekly as "day month - day month"
            return `${startOfWeek.getDate()} ${months[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${months[endOfWeek.getMonth()]}`;
        }

        // schedule modal
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
        // show info or modify
        const showScheduleInfo = ref(true)
        // edit activity
        const showEditActivity = ref(false)
        const toggleEditActivity = () => {
            showEditActivity.value = !showEditActivity.value
        }

        // lifecycle hooks
        onMounted(() => {
            updateCalendar()
            updateHeaderWeekDays()

            // initialize MutationObserver to detect changes in the DOM
            const observer = new MutationObserver(() => {
                addHoverOnEventBoxes(); // reapply hover listener on event boxes whenever DOM changes
            });
            // observe the body (where event boxes are added)
            observer.observe(document.body, { childList: true, subtree: true });

            // listen to schedule boxes click event
            window.addEventListener('showScheduleInfoWeekly', toggleScheduleInfoOnFromEvent);
            window.addEventListener('showResourceEventWeekly', toggleResourceEventInfoOnFromEvent);
        })

        onBeforeUnmount(() => {
            // remove event listener when component is destroyed to not make them stack
            window.removeEventListener('showScheduleInfoWeekly', toggleScheduleInfoOnFromEvent);
        })

        return {
            weekSelected,
            formatWeek,
            updateCalendar,
            eventsForDay,
            months,
            headerWeekDays,
            activitiesForDay,
            showScheduleModal,
            toggleScheduleInfoOff,
            scheduleObject,
            toggleScheduleInfoOn,
            showScheduleInfo,
            showEditActivity,
            toggleEditActivity,
            resourceEvent,
            showResourceEventModal,
            toggleResourceEventInfoOnFromEvent,
            toggleResourceEventInfoOff,
            resourceDateFormat,
            removeResource,
            store
        }
    }
}
</script>

<style scoped>
    #weekly_calendar_container {
        grid-template-columns: 4rem auto;
        grid-template-rows:auto;
        grid-template-areas:
        ". header"
        "timeslots-container main";
    }

    .week_header_day {
        border-left: 0.1rem solid black;
        border-top: 0.1rem solid black;
    }

    #week_calendar_header {
        grid-area: header;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    #timeslots_container {
        grid-area: timeslots-container;
    }

    .timeslot::after {
        content: '';
        position: absolute;
        left: 0px;
        width: 100%;
        height: 0.1rem;
        background: black;
    }

    #weekly_events_container {
        grid-area: main;
        display: grid;
        white-space: nowrap;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(288, 1fr);
        position: relative; /*devo settare una position perché i figli con position absolute si allacciano al
                            padre più prossimo che ha la position settata a qualcosa diverso da static(default)*/
        /* vertical lines */
        background: repeating-linear-gradient(
        to right,
        transparent 0%,
        transparent 14.1%,
        gray 14.3%
    );
    }
</style>