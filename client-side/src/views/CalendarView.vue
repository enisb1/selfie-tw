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

    <button @click="toggleView" :class="{'bg-white': view==='calendar', 'bg-secondary': view==='list'}" class="relative ml-6 w-11 rounded-full border border-third">
      <img v-show="view === 'calendar'"  class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/list_black.png" alt="calendar is shown">
      <img v-show="view === 'list'"  class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/list_white.png" alt="list is shown">
    </button>
    
    <button @click="toggleAddEventModal" class="relative ml-6 bg-white w-11 rounded-full border border-third">
            <img class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/add.png" alt="Add">
    </button>
  </div>
  
  <!-- Add event modal -->
  <Modal v-show="showAddEventModal" @close="toggleAddEventModal">
    <header>
      <div class="flex items-center justify-between flex-row">
        <div class="flex items-center justify-between flex-row">
          <button :class="{ 'bg-secondary text-white': inAddEvent, 'text-third': inAddActivity }"
            @click="selectAddEvent()" class="p-2 px-3 font-bold rounded-xl">Add Event</button>
          <button :class="{ 'bg-secondary text-white': inAddActivity, 'text-third': inAddEvent }"
            @click="selectAddActivity()" class="p-2 px-3 mr-10 font-bold rounded-xl">Add Activity</button>
        </div>
        <button type="button" @click="toggleAddEventModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
          src="../images/x.png" alt="Croce"></button>
      </div>
      <hr style="border-color: black"/>
    </header>

    <!-- ADD EVENT FORM -->
    <form @submit.prevent="addEvent" v-show="inAddEvent">
      <div class="flex flex-col">
        <!-- title -->
        <div class="mt-4">
          <p class="font-semibold text-base">Title</p>
          <input class="border border-third" type="text" maxlength="30" required v-model="eventToAddTitle">
        </div>
        
        <div class="flex flex-col sm:flex-row">
          <!-- start date -->
          <div class="mt-4">
            <p class="font-semibold text-base">Starts</p>
            <DatePicker class="mt-px inline-block w-auto" v-model="eventToAddStartDate" 
              :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
          </div>
          
          <!-- end date -->
          <div class="mt-4 sm:ml-4">
            <p class="font-semibold text-base">Ends</p>
            <DatePicker class="mt-px inline-block w-auto" v-model="eventToAddEndDate" 
              :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
          </div>
        </div>

        <!-- frequency of event -->
        <div class="mt-4">
          <!-- title -->
          <p class="font-semibold text-base">Event frequency</p>

          <!-- button-->
          <button @click="toggleFrequencyMenu" type="button" class="flex justify-center gap-x-1.5 rounded-md bg-secondary 
          px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
            <span v-show="frequencySelected === 'none'">None</span>
            <span v-show="frequencySelected === 'daily'">Daily</span>
            <span v-show="frequencySelected === 'weekly'">Weekly</span>
            <span v-show="frequencySelected === 'monthly'">Monthly</span>
            <span v-show="frequencySelected === 'yearly'">Yearly</span>
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <!-- dropdown menu -->
          <div v-show="showFrequencyMenu" class="absolute mt-2 z-50 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div @click="selectNoneFrequency()"
              class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">None</div>
            <div @click="selectDailyFrequency()"
              class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Daily</div>
            <div @click="selectWeeklyFrequency()"
              class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Weekly</div>
            <div @click="selectMonthlyFrequency()"
              class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Monthly</div>
            <div @click="selectYearlyFrequency()"
              class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Yearly</div>
          </div>
        </div>

        <!-- Event repetition -->
        <div class="mt-4">
          <!-- Title -->
          <p class="font-semibold text-base">Select number of repetitions or date until repetition (excluded)</p>
          <input id="repetition_number" type="number" v-model="frequencyNumber" :disabled="isFrequencyNumberDisabled" @input="toggleInputs('number')">
          <input id="repetition_date" type="date" class="block mt-2" v-model="frequencyDate" :disabled="isFrequencyDateDisabled" @input="toggleInputs('date')">
        </div>

        <!-- color picker -->
        <div class="mt-4">
          <p class="font-semibold text-base">Event color</p>
          <input type="color" value="#3C4F76" v-model="selectedColor">
        </div>

        <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
      </div>
    </form>

    <!-- ADD ACTIVITY FORM -->
    <form @submit.prevent="addActivity" v-show="inAddActivity">
      <div class="flex flex-col">
        <!-- title -->
        <div class="mt-4">
          <p class="font-semibold text-base">Title</p>
          <input class="border border-third" type="text" maxlength="50" required v-model="activityToAddTitle">
        </div>

        <!-- deadline -->
        <div class="mt-4">
          <p class="font-semibold text-base">Deadline</p>
          <DatePicker class="mt-px inline-block w-auto" v-model="activityToAddDeadline"
            :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
        </div>
      </div>

      <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
    </form>
  </Modal>

  <div v-if="calendarToShow === 'daily'">
    <DailyCalendar ref="dailyCalendarRef" :view="view"/>
  </div>
  <div v-else-if="calendarToShow === 'weekly'">
    <WeeklyCalendar ref="weeklyCalendarRef" :view="view"/> <!-- TODO: add view prop-->
  </div>
  <div v-else="calendarToShow === 'monthly'">
    <MonthlyCalendar ref="monthlyCalendarRef" :view="view"/>
  </div>
</template>

<script>
import DailyCalendar from '@/components/Calendar/Daily/DailyCalendar.vue'
import MonthlyCalendar from '@/components/Calendar/Monthly/MonthlyCalendar.vue';
import WeeklyCalendar from '@/components/Calendar/Weekly/WeeklyCalendar.vue';
import Modal from '@/components/Modal.vue';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { postEvent } from '@/apis/calendar';
import { getCurrentInstance } from 'vue';
import { postActivity } from '@/apis/calendar';
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

    // view to show (calendar or list)
    const view = ref('calendar')
    const toggleView = () => {
      if (view.value === 'calendar')
        view.value = 'list'
      else
        view.value = 'calendar'
    }

    // add event modal
    const showAddModal = ref(false)
    const toggleAddModal = () => {
      // reset form when closing it
      eventToAddTitle.value = ''
      eventToAddStartDate.value = null
      eventToAddEndDate.value = null
      eventToAddFrequency.value = 'none'
      eventToAddRepetitionDate.value = null
      eventToAddRepetitionNumber.value = null
      isRepetitionDateDisabled.value = false
      isRepetitionNumberDisabled.value = false
      selectedColor.value = '#3c4f76'
      showAddModal.value = !showAddModal.value
      activityToAddTitle.value = ''
      activityToAddDeadline.value = null
      inAddActivity.value = false
      inAddEvent.value = true
    }
    // add event modal data
    const eventToAddTitle = ref('')
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
    // current instance is needed to access refs
    const { proxy } = getCurrentInstance();
    const addEvent = async () => {
      //TODO: check if endDate > startDate, if not -> error -> signal error and do not submit
      await postEvent(eventToAddTitle.value, eventToAddStartDate.value, eventToAddEndDate.value, 
      eventToAddFrequency.value, eventToAddRepetitionNumber.value,
      eventToAddRepetitionDate.value, selectedColor.value) 
      proxy.$refs.dailyCalendarRef.updateEvents()
      proxy.$refs.weeklyCalendarRef.updateEvents()
      proxy.$refs.monthlyCalendarRef.updateEvents()
      toggleAddModal();
    }

    // event to add color
    const selectedColor = ref('#3c4f76')

    // event frequency
    const eventToAddFrequency = ref('none')
    const showFrequencyMenu = ref(false)
    const toggleFrequencyMenu = () => {
      showFrequencyMenu.value = !showFrequencyMenu.value
    }
    const selectNoneFrequency = () => {
      eventToAddFrequency.value = 'none'
      toggleFrequencyMenu()
    }
    const selectDailyFrequency = () => {
      eventToAddFrequency.value = 'daily'
      toggleFrequencyMenu()
    }
    const selectWeeklyFrequency = () => {
      eventToAddFrequency.value = 'weekly'
      toggleFrequencyMenu()
    }
    const selectMonthlyFrequency = () => {
      eventToAddFrequency.value = 'monthly'
      toggleFrequencyMenu()
    }
    const selectYearlyFrequency = () => {
      eventToAddFrequency.value = 'yearly'
      toggleFrequencyMenu()
    }
    // disable number frequency when date is used and viceversa
    const eventToAddRepetitionNumber = ref();
    const eventToAddRepetitionDate = ref();
    const isRepetitionDateDisabled = ref(false);
    const isRepetitionNumberDisabled = ref(false);

    const toggleInputs = (activeField) => {
      if (activeField === 'number') {
        isRepetitionDateDisabled.value = !!eventToAddRepetitionNumber.value; // Disable date input if number input has a value
        if (!eventToAddRepetitionNumber.value) eventToAddRepetitionDate.value = ''; // Clear date input if number input is cleared
      } else if (activeField === 'date') {
        isRepetitionNumberDisabled.value = !!eventToAddRepetitionDate.value; // Disable number input if date input has a value
        if (!eventToAddRepetitionDate.value) eventToAddRepetitionNumber.value = ''; // Clear number input if date input is cleared
      }
    };

    // add activity
    const inAddActivity = ref(false)
    const inAddEvent = ref(true)
    const selectAddEvent = () => {
      inAddActivity.value = false
      inAddEvent.value = true
    }
    const selectAddActivity = () => {
      inAddActivity.value = true
      inAddEvent.value = false
    }
    const activityToAddTitle = ref('')
    const activityToAddDeadline = ref()

    const addActivity = async () => {
      // TODO: check if await is necessary if you don't need anything back
      await postActivity(activityToAddTitle.value, activityToAddDeadline.value)
      proxy.$refs.dailyCalendarRef.updateEvents()
      proxy.$refs.weeklyCalendarRef.updateEvents()
      proxy.$refs.monthlyCalendarRef.updateEvents()
      toggleAddModal()
    }

    return {
      calendarToShow,
      showDailyCalendar,
      showWeeklyCalendar,
      showMonthlyCalendar,
      showCalendarMenu,
      toggleShowCalendarMenu,
      showAddEventModal: showAddModal,
      toggleAddEventModal: toggleAddModal,
      eventToAddStartDate,
      eventToAddEndDate,
      formatDate,
      startTime,
      addEvent,
      eventToAddTitle,
      view,
      toggleView,
      selectedColor,
      showFrequencyMenu,
      toggleFrequencyMenu,
      frequencySelected: eventToAddFrequency,
      selectNoneFrequency,
      selectDailyFrequency,
      selectWeeklyFrequency,
      selectMonthlyFrequency,
      selectYearlyFrequency,
      frequencyNumber: eventToAddRepetitionNumber,
      frequencyDate: eventToAddRepetitionDate,
      isFrequencyDateDisabled: isRepetitionDateDisabled,
      isFrequencyNumberDisabled: isRepetitionNumberDisabled,
      toggleInputs,
      inAddActivity,
      inAddEvent,
      selectAddActivity,
      selectAddEvent,
      activityToAddTitle,
      activityToAddDeadline,
      addActivity
    }
  }
}
</script>