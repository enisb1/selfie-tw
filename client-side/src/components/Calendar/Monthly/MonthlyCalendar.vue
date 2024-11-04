<template>
    <!-- Monthly date picker -->
    <div class="text-center sm:text-left">
        <DatePicker class="inline-block mt-3 sm:ml-8 w-auto" v-model="monthSelected" month-picker :enable-time-picker="false"></DatePicker>
    </div>
    
    <!-- Calendar view -->
    <div v-show="view==='calendar'" class="mt-6">
        <!-- Header -->
        <div class="grid grid-cols-7">
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Monday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">M</div>
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Tuesday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">T</div>
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Wednesday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">W</div>
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Thursday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">T</div>
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Friday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">F</div>
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Saturday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">S</div>
            <div class="hidden sm:block max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">Sunday</div>
            <div class="block sm:hidden max-h-8 text-center bg-secondary text-white font-semibold border-t border-black">S</div>
        </div>

        <div id="monthly_calendar_container" class="grid grid-cols-7">
            <div v-for="(date, index) in daysArray" :key="index" :class="getDynamicDayClass(date, index)" class="text-white border-b border-black border-r text-center border-r">
                <div class="bg-secondary"> {{ date.getDate() }}</div>

                <div v-for="event in eventsForDay[index+1]" :style="{backgroundColor: event.color}" class="mt-2 opacity-75 hover:opacity-100 truncate">
                    <p> {{ event.title }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- List view -->
    <div v-show="view==='list'" class="flex flex-col items-center mx-auto w-3/4 text-white py-5">
        <div v-for="[day, events] in Object.entries(filteredEvents)" class="flex flex-row mt-4 justify-between items-start w-full bg-white bg-opacity-50 p-4 rounded-lg">
            <div class="bg-secondary px-4 rounded-xl py-2 font-semibold"> {{ day }} {{ months[new Date(events[0].startDate).getMonth()] }}</div>
            <div class="flew flex-col w-1/2">
                <div v-for="(event, indexEvent) in events" :class="{'mt-4': indexEvent>0}" :style="{backgroundColor: event.color}" class="opacity-75 hover:opacity-100 w-full truncate px-4 rounded-xl py-2">
                        {{ event.title }} 
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'
import { watch } from 'vue'
import { updateEventsObject } from './update-events-month.js'
import { getEventsInRange } from '@/apis/calendar.js'
import { computed } from 'vue'

export default {
    props : {
        view: String
    },
    components : {
        DatePicker
    },
    setup() {
        // object containing field month and field year
        const monthSelected = ref({"month": new Date().getMonth(), "year": new Date().getFullYear()});
        watch(monthSelected, () => {
            if (monthSelected.value) {
               updateDays()
               updateEvents() 
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
        const eventsForDay = ref({})
        const updateEvents = async () => {
            // first and last days of the month, use this for event find
            const startDate = new Date(firstDayOfMonth.value)
            const endDate = new Date(new Date(lastDayOfMonth.value).setHours(23,59,59,999))
            const events = await getEventsInRange(startDate, endDate)
            eventsForDay.value = updateEventsObject(events, startDate, endDate)
        }

        // filtered events is a computed property from events that doens't contain empty events arrays
        // needed for list view
        const filteredEvents = computed(() => {
            return Object.fromEntries(Object.entries(eventsForDay.value).filter(([day, events]) => events && events.length > 0))
        })

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
            updateEvents()
        })
        
        return {
            monthSelected,
            daysArray,
            getDynamicDayClass,
            eventsForDay,
            updateEvents,
            months,
            filteredEvents
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