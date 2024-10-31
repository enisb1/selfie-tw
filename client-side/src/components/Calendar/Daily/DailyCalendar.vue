<template>
    <!-- Daily date picker -->
    <div class="text-center sm:text-left">
        <DatePicker class="inline-block mt-3 sm:ml-8 w-auto" v-model="selectedDate" :enable-time-picker="false"
        :format="formatDate"></DatePicker>
    </div>
        
    <!-- Daily calendar, part of the style is in daily-calendar.css -->
    <div id="daily_calendar" class="grid mt-4">
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

        <div id="daily_events_container">
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

export default {
    components: {
        DatePicker
    },
    setup() {
        const selectedDate = ref(new Date());   // default date = current date
        watch(selectedDate, () => {
            updateEvents();
        })
        
        // events
        const events = ref();
        const updateEvents = async () => {
            // fetch selected date's events and set them to events
            const startDate = new Date(selectedDate.value);
            const endDate = new Date(selectedDate.value);
            events.value = await getEventsInRange(startDate, endDate);
        }
        // watch for updates to events and render them
        watch(events, (newEvents) => {
            renderEvents(newEvents, selectedDate.value);
        });
        
        // format date
        const formatDate = (date) => {
            // format date to dd/mm/yyyy
            return date ? date.toLocaleDateString('it-IT') : '';
        }
        
        // lifecycle hooks
        onMounted(() => {
            updateEvents();
        })

        return {
            selectedDate,
            formatDate,
            events,
            updateEvents
        }
    }
}
</script>

<style scoped>
    #daily_calendar {
        grid-template-columns: 4rem auto;
        grid-template-rows: auto;
        grid-template-areas: "timeslots_container main";
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