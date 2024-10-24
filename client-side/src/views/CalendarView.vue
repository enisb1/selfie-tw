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
      <div v-show="showCalendarMenu" class="absolute mt-2 z-50 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
      <div class="mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white"
          tabindex="-1">Calendar</a>
        <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white"
          tabindex="-1">List</a>
      </div>
    </div>
  </div>

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
import DailyCalendar from '@/components/Calendar/DailyCalendar.vue'
import MonthlyCalendar from '@/components/Calendar/MonthlyCalendar.vue';
import WeeklyCalendar from '@/components/Calendar/WeeklyCalendar.vue';
import { ref } from 'vue';

export default {
  components: {
    DailyCalendar,
    WeeklyCalendar,
    MonthlyCalendar
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

    return {
      calendarToShow,
      showDailyCalendar,
      showWeeklyCalendar,
      showMonthlyCalendar,
      showCalendarMenu,
      toggleShowCalendarMenu
    }
  }
}
</script>