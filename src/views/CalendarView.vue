<template>
    <!-- inserisci il bottone con menu per selezionare quale calendario mostrare, e il bottone lista -->
    <!-- sotto ai bottoni metti il component per il calendario, questo comprenderà sia il datepicker
     che il calendario sotto -->

    <!-- Buttons div, TODO: use button component instead of this -->
    <div class="flex mt-5 justify-center sm:justify-normal sm:ml-8">
        <div class="text-left">
            <div>
              <button type="button" class="flex w-full justify-center gap-x-1.5 rounded-md bg-secondary 
              px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
                Daily
                <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          
            <!--Dropdown menu, show/hide(with hidden, that is the property display:none) based on menu state-->
            <div class="mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Daily</a>
                <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Weekly</a>
                <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Monthly</a>
            </div>
        </div>
    
        <div class="text-left ml-8">
            <div>
              <button type="button" class="flex w-full justify-center gap-x-1.5 rounded-md 
              bg-secondary px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
                Calendar
                <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          
            <!--Dropdown menu, show/hide(with hidden, that is the property display:none) based on menu state-->
            <div class="mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Calendar</a>
                <a href="#" class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">List</a>
            </div>
        </div>
    </div>

    <!--
    <DailyCalendar/>
    <WeeklyCalendar/>
-->
    <MonthlyCalendar/>
</template>

<script>
import DailyCalendar from '@/components/Calendar/DailyCalendar.vue'
import MonthlyCalendar from '@/components/Calendar/MonthlyCalendar.vue';
import WeeklyCalendar from '@/components/Calendar/WeeklyCalendar.vue';

export default {
    components: {
        DailyCalendar,
        WeeklyCalendar,
        MonthlyCalendar
    },
    setup() {
        
    },
}
</script>