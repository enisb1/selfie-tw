<template>
  <!-- inserisci il bottone con menu per selezionare quale calendario mostrare, e il bottone lista -->
  <!-- sotto ai bottoni metti il component per il calendario, questo comprenderà sia il datepicker
    che il calendario sotto -->

  <!--NavBar-->
  <div class="grid grid-flow-col auto-cols-auto bg-secondary rounded-3xl w-10/12 shadow-xl max-w-lg sm:ml-8 mx-auto mt-5">
      <button :class="{ 'text-secondary bg-white rounded-3xl ': inYoursCalendar, 'text-white': !inYoursCalendar }" 
        @click="toggleInYoursCalendar" class="p-2 font-bold flex justify-center items-center">Yours</button>
      <button :class="{ 'text-secondary bg-white rounded-3xl': inResourcesCalendar, 'text-white': !inResourcesCalendar }"
          @click="toggleInResourcesCalendar" class="p-2 font-bold">Resources</button>
  </div>

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
        <div @click="showCalendar('daily')"
          class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Daily</div>
        <div @click="showCalendar('weekly')"
          class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Weekly</div>
        <div @click="showCalendar('monthly')"
          class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Monthly</div>
      </div>
    </div>

    <button v-show="!inResourcesCalendar" @click="toggleView" :class="{'bg-white': view==='calendar', 'bg-secondary': view==='list'}" class="relative ml-6 w-11 rounded-full border border-third">
      <img v-show="view === 'calendar'"  class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/list_black.png" alt="calendar is shown">
      <img v-show="view === 'list'"  class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/list_white.png" alt="list is shown">
    </button>
    
    <button v-show="!inResourcesCalendar" @click="toggleAddModal" class="relative ml-6 bg-white w-11 rounded-full border border-third">
            <img class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/add.png" alt="Add">
    </button>
  </div>
  
  <!-- Add event modal -->
  <Modal v-show="showAddEventModal" @close="toggleAddModal">
    <header>
      <div class="flex items-center justify-between flex-row">
        <div class="flex items-center justify-between flex-row">
          <button :class="{ 'bg-secondary text-white': inAddEvent, 'text-third': !inAddEvent }"
            @click="selectAddEvent" class="p-2 px-3 font-bold rounded-xl">Add Event</button>
          <button :class="{ 'bg-secondary text-white': inAddActivity, 'text-third': !inAddActivity }"
            @click="selectAddActivity" class="p-2 px-3 font-bold rounded-xl">Add Activity</button>
          <button :class="{ 'bg-secondary text-white': inImportEvent, 'text-third': !inImportEvent }"
            @click="selectInImportEvent" class="p-2 px-3 font-bold rounded-xl">Import event</button>
        </div>
        <button type="button" @click="toggleAddModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
          src="../images/x.png" alt="Croce"></button>
      </div>
      <hr style="border-color: black"/>
    </header>

    <!-- ADD EVENT FORM -->
    <form @submit.prevent="addEvent" v-show="inAddEvent" class="flex flex-col">
      <!-- title -->
      <div class="mt-4">
        <p class="font-semibold text-base">Title</p>
        <input class="border border-third" type="text" maxlength="30" required v-model="eventToAddTitle">
      </div>

      <!-- location -->
      <div class="mt-4">
        <p class="font-semibold text-base">Location</p>
        <input class="border border-third" type="text" maxlength="30" v-model="eventToAddLocation">
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
          <span v-show="eventToAddFrequency === 'none'">None</span>
          <span v-show="eventToAddFrequency === 'daily'">Daily</span>
          <span v-show="eventToAddFrequency === 'weekly'">Weekly</span>
          <span v-show="eventToAddFrequency === 'monthly'">Monthly</span>
          <span v-show="eventToAddFrequency === 'yearly'">Yearly</span>
          <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd" />
          </svg>
        </button>

        <!-- dropdown menu -->
        <div v-show="showFrequencyMenu" class="absolute mt-2 z-50 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div @click="selectFrequency('none')"
            class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">None</div>
          <div @click="selectFrequency('daily')"
            class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Daily</div>
          <div @click="selectFrequency('weekly')"
            class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Weekly</div>
          <div @click="selectFrequency('monthly')"
            class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Monthly</div>
          <div @click="selectFrequency('yearly')"
            class="block px-4 py-2 text-md text-gray-700 hover:bg-secondary hover:text-white" tabindex="-1">Yearly</div>
        </div>
      </div>

      <!-- Event repetition -->
      <div class="mt-4" v-show="eventToAddFrequency != 'none'">
        <p class="font-semibold text-base">Select number of repetitions or date until repetition</p>
        <input id="repetition_number" min="0" type="number" v-model="eventToAddRepetitionNumber" 
          :disabled="isRepetitionNumberDisabled" @input="toggleRepInputs('number')" :required="isRepNumberRequired">
        <!-- repetition date -->
        <DatePicker name="repDate" class="inline-block w-auto mt-2 sm:ml-4" v-model="eventToAddRepetitionDate" 
                    :format="formatDateNoTime" :enable-time-picker="false" :disabled="isRepetitionDateDisabled" 
                    :required="isRepDateRequired" @update:model-value="toggleRepInputs('date')">
        </DatePicker>
      </div>

      <!-- invite users -->
      <div class="mt-4">
        <p class="font-semibold text-base">Invite users</p>
        <Multiselect v-model="newEventSelectedUsers" :options="usersOptions"
          optionLabel="username" placeholder="Select users" label="username" :multiple="true"
          :close-on-select="false" :clear-on-select="false"
          :preserve-search="true" track-by="username" :preselect-first="true">
        </Multiselect>
      </div>

      <!-- color picker -->
      <div class="mt-4">
        <p class="font-semibold text-base">Event color</p>
        <input type="color" value="#3C4F76" v-model="selectedColor">
      </div>

      <!-- notifications -->
      <div class="flex mt-4">
        <div>
          <input type="checkbox" v-model="notify15Before" class="mr-2"/>
          <label class="mr-2">15 minutes before</label>
        </div>
        <div>
          <input type="checkbox" v-model="notify30Before" class="mr-2"/>
          <label class="mr-2">30 minutes before</label>
        </div>
        <div>
          <input type="checkbox" v-model="notify1HourBefore" class="mr-2"/>
          <label class="mr-2">1 hour before</label>
        </div>
        <div>
          <input type="checkbox" v-model="notify1DayBefore" class="mr-2"/>
          <label class="mr-2">1 day before</label>
        </div>
      </div>

      <div v-show="showAddError" class="bg-red-400 text-white font-bold mt-2 
        inline px-2 text-center mx-auto" > {{ addErrorValue }}</div>
        
      <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
        text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
    </form>

    <!-- ADD ACTIVITY FORM -->
    <form @submit.prevent="addActivity" v-show="inAddActivity">
      <div class="flex flex-col">
        <!-- is group activity -->
        <div class="mt-4">
          <p class="font-semibold text-base">Group activity</p>
          <input class="border border-third" type="checkbox" v-model="isCompositeActivity">
        </div>

        <div class="mt-4" :class="{ 'hidden': !isCompositeActivity }">
          <p class="font-semibold text-base">Group activity title</p>
          <input class="border border-third" type="text" maxlength="20" :required="isCompositeActivity" v-model="compositeActivityTitle">
        </div>

        <!-- title -->
        <div class="mt-4">
          <p class="font-semibold text-base">{{ isCompositeActivity? 'Subactivity title' : 'Title' }}</p>
          <input class="border border-third" type="text" maxlength="20" :required="!isCompositeActivity" v-model="activityToAddTitle">
        </div>

        <!-- deadline -->
        <div class="mt-4">
          <p class="font-semibold text-base">{{ isCompositeActivity? 'Subactivity deadline' : 'Deadline' }}</p>
          <DatePicker class="mt-px inline-block w-auto" v-model="activityToAddDeadline"
            :format="formatDate" minutes-increment="5" :start-time="startTime" :required="!isCompositeActivity"></DatePicker>
        </div>
        
        <div class="flex mt-4" :class="{ 'hidden': !isCompositeActivity }">
          <button type="button" @click="addSubact()" class="bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Add subactivity</button>
          <button type="button" @click="clearSubact()" class="ml-2 bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Clear</button>
        </div>

        <!-- list of subactivities added -->
        <div class="flex flex-col">
          <div v-for="(subact, index) in subactivitiesToAdd" :key="index" class="mt-4">
            <p><span class="font-semibold mt-4">Added:</span> {{ subact.title }}</p>
            <p><span class="font-semibold mt-4">Deadline:</span> {{ new Date(subact.deadline).toLocaleDateString('it-IT', infoDateFormat) }}</p>
          </div>
        </div>

        <!-- invite users -->
        <div class="mt-4">
          <p class="font-semibold text-base">Invite users</p>
          <Multiselect v-model="newActivitySelectedUsers" :options="usersOptions"
            optionLabel="username" placeholder="Select users" label="username" :multiple="true"
            :close-on-select="false" :clear-on-select="false"
            :preserve-search="true" track-by="username" :preselect-first="true">
          </Multiselect>
        </div>

        <div class="bg-red-400 text-white font-bold mt-2 
          inline px-2 text-center mx-auto">{{ activityToAddError }}</div>
      </div>

      <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
    </form>

    <div v-show="inImportEvent" class="mt-4">
      <input type="file" accept=".ics" @change="importEvent">
    </div>
  </Modal>

  <div v-show="calendarToShow === 'daily'">
    <DailyCalendar ref="dailyCalendarRef" :view="view" @updateAllCalendars="updateAllCalendars"
      :showResourcesCalendar="inResourcesCalendar"/>
  </div>
  <div v-show="calendarToShow === 'weekly'">
    <WeeklyCalendar ref="weeklyCalendarRef" :view="view" @updateAllCalendars="updateAllCalendars"
      :showResourcesCalendar="inResourcesCalendar"/>
  </div>
  <div v-show="calendarToShow === 'monthly'">
    <MonthlyCalendar ref="monthlyCalendarRef" :view="view" @updateAllCalendars="updateAllCalendars"
      :showResourcesCalendar="inResourcesCalendar"/>
  </div>
</template>

<script>
import DailyCalendar from '@/components/Calendar/Daily/DailyCalendar.vue'
import MonthlyCalendar from '@/components/Calendar/Monthly/MonthlyCalendar.vue';
import WeeklyCalendar from '@/components/Calendar/Weekly/WeeklyCalendar.vue';
import Modal from '@/components/Modal.vue';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { getResources, postEvent, getEventsByResource } from '@/apis/calendar';
import { getCurrentInstance, onMounted, nextTick } from 'vue';
import { postActivity } from '@/apis/calendar';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Multiselect from 'vue-multiselect';
import { getAllUsers } from '@/apis/users';
import { getUnavailableRepeatedDates } from '@/components/Calendar/repeated-dates';
import { getEventsFromIcsString } from '@/components/Calendar/import-events';
import { getAllEventsInstances } from '@/components/Calendar/repeated-events';
import { postSubacts } from '@/apis/calendar';

export default {
  components: {
    DailyCalendar,
    WeeklyCalendar,
    MonthlyCalendar,
    Modal,
    DatePicker,
    Multiselect
  },
  setup() {
    // useStore
    const store = useStore()
    
    // fetch all users and all resources and put in usersOptions
    const usersOptions = ref([])
    const updateUsersOptions = async () => {
      usersOptions.value = []
      const users = await getAllUsers()
      const resources = await getResources()
      usersOptions.value = usersOptions.value.concat(users)
      .concat(resources).filter(obj => obj._id != store.state._id)
    }
    const newEventSelectedUsers = ref()

    // show calendar menu
    const showCalendarMenu = ref(false)
    const toggleShowCalendarMenu = () => {
      showCalendarMenu.value = !showCalendarMenu.value
    }

    // calendar to show
    const calendarToShow = ref('daily')
    const showCalendar = (calendarType) => {
      calendarToShow.value = calendarType
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
      eventToAddTitle.value = ''
      eventToAddLocation.value = ''
      eventToAddStartDate.value = null
      eventToAddEndDate.value = null
      eventToAddFrequency.value = 'none'
      eventToAddRepetitionDate.value = null
      eventToAddRepetitionNumber.value = null
      isRepetitionDateDisabled.value = false
      isRepetitionNumberDisabled.value = false
      newEventSelectedUsers.value = []
      selectedColor.value = '#3c4f76'
      showAddModal.value = !showAddModal.value
      activityToAddTitle.value = ''
      activityToAddDeadline.value = null
      newActivitySelectedUsers.value = []
      inAddActivity.value = false
      inAddEvent.value = true
      notify15Before.value = false
      notify30Before.value = false
      notify1HourBefore.value = false
      notify1DayBefore.value = false
      isCompositeActivity.value = false
      compositeActivityTitle.value = ''
      subactivitiesToAdd.value = []
      updateUsersOptions()
    }
    // add event modal data
    const eventToAddTitle = ref('')
    const eventToAddLocation = ref()
    const eventToAddStartDate = ref()
    const eventToAddEndDate = ref()
    const notify15Before = ref(false)
    const notify30Before = ref(false)
    const notify1HourBefore = ref(false)
    const notify1DayBefore = ref(false)
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
    const addErrorValue = ref()
    const showAddError = ref()
    const addEvent = async () => {
      // don't proceed if end date not > start date
      if (eventToAddEndDate.value.getTime() <= eventToAddStartDate.value.getTime()) {
        addErrorValue.value = "End date must be after start date"
        showAddError.value = true
      }
      else { // proceed
        // set repetition date to end of day (otherwise it would be current time)
        if (eventToAddRepetitionDate.value)
          eventToAddRepetitionDate.value = new Date(eventToAddRepetitionDate.value.setHours(23,59,59,999))

        // process selectedUsers to get users and resources
        const users = newEventSelectedUsers.value.filter(obj => obj.firstName) // fetch only users
        // send invite to users
        for (const user of users) {
          const repeatedDatesArray = await getUnavailableRepeatedDates(user._id)
          let sendInvite = true
          for (const [unavailableStart, unavailableEnd] of repeatedDatesArray) {
            if (eventToAddStartDate.value.getTime() >= unavailableStart.getTime() && eventToAddStartDate.value.getTime() <= unavailableEnd.getTime()
              || eventToAddEndDate.value.getTime() >= unavailableStart.getTime() && eventToAddEndDate.value.getTime() <= unavailableEnd.getTime()
              || eventToAddStartDate.value.getTime() >= unavailableStart.getTime() && eventToAddEndDate.value.getTime() <= unavailableEnd.getTime()){
              sendInvite = false
              break
            }
          }
          if (sendInvite) {
            // TODO: send invite to user
          }
        }
        // calculate available and not available resources
        const resources = newEventSelectedUsers.value.filter(obj => !obj.firstName)
        const availableResources = []
        const notAvailableResources = []
        const eventToAddStartTime = eventToAddStartDate.value.getTime()
        const eventToAddEndTime = eventToAddEndDate.value.getTime()
        for (const resource of resources) {
          const eventsUsingResource = await getEventsByResource(resource._id)
          const allEventsInstances = getAllEventsInstances(eventsUsingResource)
          let isAvailable = true
          for (const eventInstance of allEventsInstances) {
            const eventInstanceStartTime = new Date(eventInstance.startDate).getTime()
            const eventInstanceEndTime = new Date(eventInstance.endDate).getTime()
            if (eventToAddStartTime >= eventInstanceStartTime && eventToAddStartTime <= eventInstanceEndTime
              || eventToAddEndTime >= eventInstanceStartTime && eventToAddEndTime <= eventInstanceEndTime
              || eventToAddStartTime <= eventInstanceStartTime && eventToAddEndTime >= eventInstanceEndTime){
              isAvailable = false
              break
            }
          }
          if (isAvailable)
            availableResources.push(resource)
          else
            notAvailableResources.push(resource)
        }
        await postEvent(eventToAddTitle.value, eventToAddLocation.value, eventToAddStartDate.value, eventToAddEndDate.value, 
        eventToAddFrequency.value, eventToAddRepetitionNumber.value,
        eventToAddRepetitionDate.value, selectedColor.value, [store.state._id], availableResources.map(r => r._id),
        notify15Before.value, notify30Before.value, notify1HourBefore.value, notify1DayBefore.value)
        updateAllCalendars()
        toggleAddModal();
        showAddError.value = false
        // signal the user which resources have not been added
        if (resources.length > availableResources.length) {
          const difference = resources.filter(r => availableResources.every(obj => obj._id!=r._id)).map(r => r.username)
          alert("The following resources are taken: "+ difference.join(", ")) // TODO: can try to system notify instead
        }
      }
    }

    const updateAllCalendars = () => {
      // Wait for DOM and reactive updates to complete (prop for resources events needs to be set)
      nextTick(() => {
        proxy.$refs.dailyCalendarRef.updateCalendar()
        proxy.$refs.weeklyCalendarRef.updateCalendar()
        proxy.$refs.monthlyCalendarRef.updateCalendar()
      });
    }

    // event to add color
    const selectedColor = ref('#3c4f76')

    // event frequency
    const eventToAddFrequency = ref('none')
    const showFrequencyMenu = ref(false)
    const toggleFrequencyMenu = () => {
      showFrequencyMenu.value = !showFrequencyMenu.value
    }
    const selectFrequency = (frequency) => {
      eventToAddFrequency.value = frequency
      toggleFrequencyMenu()
    }
    // disable number frequency when date is used and viceversa
    const eventToAddRepetitionNumber = ref()
    const eventToAddRepetitionDate = ref()
    const isRepetitionDateDisabled = ref(false)
    const isRepetitionNumberDisabled = ref(false)
    const isRepNumberRequired = computed(() => {
        if (eventToAddFrequency.value == 'none')
            return false
        else
            return !(!!eventToAddRepetitionDate.value)
    })
    const isRepDateRequired = computed(() => {
        if (eventToAddFrequency.value == 'none')
            return false
        else
            return !(!!eventToAddRepetitionNumber.value)
    })
    const formatDateNoTime = (date) => {
        // format date to dd/mm/yyyy
        return date ? date.toLocaleDateString('it-IT') : '';
    }

    const toggleRepInputs = (activeField) => {
        if (activeField === 'number') {
            isRepetitionDateDisabled.value = !!eventToAddRepetitionNumber.value // disable if number input has a value
        } else if (activeField === 'date') {
            isRepetitionNumberDisabled.value = !!eventToAddRepetitionDate.value // disable if date input has a value
        }
    }

    // add activity
    const inAddActivity = ref(false)
    const inAddEvent = ref(true)
    const inImportEvent = ref(false)
    const selectAddEvent = () => {
      inAddActivity.value = false
      inAddEvent.value = true
      inImportEvent.value = false
    }
    const selectAddActivity = () => {
      inAddActivity.value = true
      inAddEvent.value = false
      inImportEvent.value = false
    }
    const selectInImportEvent = () => {
      inImportEvent.value = true
      inAddEvent.value = false
      inAddActivity.value = false
    }
    const activityToAddTitle = ref('')
    const activityToAddDeadline = ref()

    const newActivitySelectedUsers = ref()

    const addActivity = async () => {
      // newActivitySelectedUsers contains the users to invite
      // TODO: invite them!
      if (!isCompositeActivity.value) {
        if (activityToAddDeadline.value.getTime() <= new Date().getTime())
          activityToAddError.value = "Deadline must be greater than current date"
        else {
          await postActivity(activityToAddTitle.value, activityToAddDeadline.value, [store.state._id])
          updateAllCalendars()
          toggleAddModal()
        }
      }
      else if (subactivitiesToAdd.value.length <= 0) {
        activityToAddError.value = "At least one subactivity is required"
      }
      else {
        //TODO: in postSubacts metti solo l'user corrente come partecipante e INVITA ALTRI UTENTI alla compositeActivity
        await postSubacts(compositeActivityTitle.value, subactivitiesToAdd.value, newActivitySelectedUsers.value.concat([store.state._id]))
        updateAllCalendars()
        toggleAddModal()
      }
    }

    // resources
    const inYoursCalendar = ref(true)
    const inResourcesCalendar = ref(false)
    const toggleInYoursCalendar = () => {
      inResourcesCalendar.value = false
      inYoursCalendar.value = true
      updateAllCalendars()
    }
    const toggleInResourcesCalendar = () => {
      inYoursCalendar.value = false
      inResourcesCalendar.value = true
      view.value = 'calendar'
      updateAllCalendars()
    }

    const importEvent = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const icsContent = await file.text();
        const events = await getEventsFromIcsString(icsContent)
        for (const event of events) {
          await postEvent(event.title, event.location, event.startDate, event.endDate, event.frequency, 
            event.repetitionNumber, event.repetitionDate, '#3c4f76', event.users, [], false, false, false, false)
        }
      }
    };

    onMounted(() => {
      updateUsersOptions()
    })

    // Group activity
    const isCompositeActivity = ref(false)
    const compositeActivityTitle = ref('')
    const subactivitiesToAdd = ref([])

    const addSubact = () => {
      if (activityToAddTitle.value && activityToAddDeadline.value) {
        if (activityToAddDeadline.value.getTime() <= new Date().getTime())
          activityToAddError.value = "Deadline must be greater than current date"
        else {
          subactivitiesToAdd.value.push({ title: activityToAddTitle.value, deadline: activityToAddDeadline.value })
          activityToAddTitle.value = ''
          activityToAddDeadline.value = null
          activityToAddError.value = ""
        }
      }
      else {
        activityToAddError.value = "Title and deadline are required"
      }
    }

    const clearSubact = () => {
      subactivitiesToAdd.value = []
    }

    const activityToAddError = ref('')

    const infoDateFormat = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // (12 hour format)
    }

    return {
      calendarToShow,
      showCalendar,
      showCalendarMenu,
      toggleShowCalendarMenu,
      showAddEventModal: showAddModal,
      toggleAddModal,
      eventToAddStartDate,
      eventToAddLocation,
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
      eventToAddFrequency,
      eventToAddRepetitionNumber,
      eventToAddRepetitionDate,
      isRepetitionDateDisabled,
      isRepetitionNumberDisabled,
      toggleRepInputs,
      inAddActivity,
      inAddEvent,
      selectAddActivity,
      selectAddEvent,
      activityToAddTitle,
      activityToAddDeadline,
      addActivity,
      updateAllCalendars,
      isRepNumberRequired,
      isRepDateRequired,
      formatDateNoTime,
      showAddError,
      addErrorValue,
      newEventSelectedUsers,
      usersOptions,
      inYoursCalendar,
      inResourcesCalendar,
      toggleInYoursCalendar,
      toggleInResourcesCalendar,
      notify15Before,
      notify30Before,
      notify1HourBefore,
      notify1DayBefore,
      inImportEvent,
      selectInImportEvent,
      importEvent,
      newActivitySelectedUsers,
      selectFrequency,
      isCompositeActivity,
      compositeActivityTitle,
      subactivitiesToAdd,
      activityToAddError,
      addSubact,
      clearSubact,
      infoDateFormat
    }
  }
}
</script>

<!-- Multiselect CSS -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="css">
  .multiselect__tag {
    color: white;
    background-color: #383f51;
  }
  .multiselect__tag:hover {
    background-color: black;
  }

  .multiselect__option--highlight {
    background-color: #383f51;
    color: rgb(255, 255, 255);
    font-size: 0.9rem;
    height: 1rem;
  }
</style>