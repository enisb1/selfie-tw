<template>
  <!-- inserisci il bottone con menu per selezionare quale calendario mostrare, e il bottone lista -->
  <!-- sotto ai bottoni metti il component per il calendario, questo comprenderà sia il datepicker
    che il calendario sotto -->

  <!-- Buttons div, TODO: use button component instead of this -->
  <div class="flex mt-5 justify-center sm:justify-normal sm:ml-8">
    <!-- Show calendar button and dropdown menu -->
    <div class="relative text-left">
      <button @click="toggleShowCalendarMenu" type="button" class="flex justify-center gap-x-1.5 rounded-md bg-secondary 
      px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
        <span v-show="calendarToShow === 'daily'">Daily</span>
        <span v-show="calendarToShow === 'weekly'">Weekly</span>
        <span v-show="calendarToShow === 'monthly'">Monthly</span>
        <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd" />
        </svg>
      </button>

      <!--Dropdown menu-->
      <div v-show="showCalendarMenu" class="absolute mt-2 z-50 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div @click="showDailyCalendar"
          class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Daily</div>
        <div @click="showWeeklyCalendar"
          class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Weekly</div>
        <div @click="showMonthlyCalendar"
          class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Monthly</div>
      </div>
    </div>

    <div class="text-left ml-8">
      <button type="button" class="flex w-full justify-center gap-x-1.5 rounded-md 
      bg-secondary px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
        Calendar
        <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd" />
        </svg>
      </button>

      <!--Dropdown menu, show/hide(with hidden, that is the property display:none) based on menu state-->
      <div class="hidden absolute mt-2 z-50 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white"
          tabindex="-1">Calendar</a>
        <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white"
          tabindex="-1">List</a>
      </div>
    </div>

    <button @click="toggleAddEventModal" class="ml-8 text-white rounded-md bg-secondary shadow-lg ring-1 ring-black ring-opacity-5">ADD</button>
  </div>
  
  <!-- Add event modal -->
  <Modal v-show="showAddEventModal" @close="toggleAddEventModal">
    <form @submit.prevent="addEvent"> <!-- TODO: try to update events in calendar when submitting -->
      <div class="flex items-center justify-between flex-row">
        <p class="font-bold text-lg">Add event</p>
        <button type="button" @click="toggleAddEventModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
          src="../images/x.png" alt="Croce"></button>
      </div>
      <hr style="border-color: black"/>

      <div class="flex flex-col items-center">
        <!-- title -->
        <div class="mt-4">
          <p class="font-semibold text-base">Title</p>
          <input class="border border-third" type="text" maxlength="30" required v-model="eventToAddTitle">
        </div>
        
        <!-- start date -->
        <div class="mt-4">
          <p class="font-semibold text-base">Starts</p>
          <DatePicker class="mt-px inline-block w-auto" v-model="eventToAddStartDate" 
            :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
        </div>
        
        <!-- end date -->
        <div class="mt-4">
          <p class="font-semibold text-base">Ends</p>
          <DatePicker class="mt-px inline-block w-auto" v-model="eventToAddEndDate" 
            :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
        </div>

        <button type="submit" class="mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Aggiungi</button>
      </div>
    </form>
  </Modal>

  <div v-show="calendarToShow === 'daily'">
    <DailyCalendar />
  </div>

  <div v-show="calendarToShow === 'weekly'">
    <WeeklyCalendar />
  </div>

  <div v-show="calendarToShow === 'monthly'">
    <MonthlyCalendar />
  </div>
</template>

<script>
import DailyCalendar from '@/components/Calendar/Daily/DailyCalendar.vue'
import MonthlyCalendar from '@/components/Calendar/MonthlyCalendar.vue';
import WeeklyCalendar from '@/components/Calendar/WeeklyCalendar.vue';
import Modal from '@/components/Modal.vue';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { postEvent } from '@/apis/calendar';

import { ref } from 'vue';

export default {
  components: {
    DailyCalendar,
    WeeklyCalendar,
    MonthlyCalendar,
    Modal,
    DatePicker
  },
  setup() {
    // show calendar menu
    const showCalendarMenu = ref(false)
    const toggleShowCalendarMenu = () => {
      showCalendarMenu.value = !showCalendarMenu.value
    }

    // calendar to show
    const calendarToShow = ref('daily')
    const showDailyCalendar = () => {
      calendarToShow.value = 'daily'
      toggleShowCalendarMenu()
    }
    const showWeeklyCalendar = () => {
      calendarToShow.value = 'weekly'
      toggleShowCalendarMenu()
    }
    const showMonthlyCalendar = () => {
      calendarToShow.value = 'monthly'
      toggleShowCalendarMenu()
    }

    // add event modal
    const showAddEventModal = ref(false)
    const toggleAddEventModal = () => {
      showAddEventModal.value = !showAddEventModal.value
    }
    // add event modal data
    const eventToAddTitle = ref('');
    const eventToAddStartDate = ref()
    const eventToAddEndDate = ref()
    // format date in add event modal
    const formatDate = (date) => {
      if (!date) return '';
      return date.toLocaleString('it-IT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // (12 hour format)
      });
    }
    const startTime = ref({ hours: 12, minutes: 30 })
    // add event method
    const addEvent = () => {
      //TODO: check if endDate > startDate, if not -> error
      // post api
      postEvent(eventToAddTitle.value, eventToAddStartDate.value, eventToAddEndDate.value)
    }

    return {
      calendarToShow,
      showDailyCalendar,
      showWeeklyCalendar,
      showMonthlyCalendar,
      showCalendarMenu,
      toggleShowCalendarMenu,
      showAddEventModal,
      toggleAddEventModal,
      eventToAddStartDate,
      eventToAddEndDate,
      formatDate,
      startTime,
      addEvent,
      eventToAddTitle
    }
  }
}
</script>