<template>
    <div class="flex flex-col">
        <!-- Edit and go back button -->
        <div v-show="showInfoEvent" class="flex mt-4">
            <button @click="toggleShowEdit" type="button" class="w-6 h-6">
                <img src="../../images/edit.png" alt="edit"></button>
            <button @click="toggleShowEventExportOn" class="w-6 h-6 ml-4" type="button">
                <img src="../../images/export.png" alt="export"></button>
        </div>
        <button @click="toggleShowInfo" v-show="showEditEvent || showEventExport" type="button" class="mt-4 w-6 h-6">
            <img src="../../images/returnButton.png" alt="back"></button>
        
        <!-- Event export -->
        <EventExportModal v-if="showEventExport" :event="eventObject"></EventExportModal>

        <!-- Event info -->
        <div v-show="showInfoEvent">
            <!-- location -->
            <div class="mt-4">
                <p class="font-semibold text-base">Location</p>
                <p> {{ eventObject.location }} </p>
            </div>

            <!-- starts -->
            <div class="mt-4">
                <p class="font-semibold text-base">Starts</p>
                <p> {{ new Intl.DateTimeFormat('it-IT', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
                minute: '2-digit', }).format(new Date(eventObject.startDate)) }}</p>
            </div>

            <!-- ends -->
            <div class="mt-4">
                <p class="font-semibold text-base">Ends</p>
                <p> {{ new Intl.DateTimeFormat('it-IT', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
                minute: '2-digit', }).format(new Date(eventObject.endDate)) }}</p>
            </div>

            <!-- frequency -->
            <div class="mt-4" v-show="!eventObject.pomodoroSettings">
                <p class="font-semibold text-base">Frequency</p>
                <p v-show="eventObject.frequency != 'none'"> {{ eventObject.frequency }} frequency {{ eventObject.repetitionNumber ? `repeating ${eventObject.repetitionNumber} times` :
                    `until ${new Date(eventObject.repetitionDate).toLocaleDateString
                    ('it-IT', {day: '2-digit', month: '2-digit', year: 'numeric'})}` }}</p>
                <p v-show="eventObject.frequency == 'none'">none</p>    
            </div>

            <!-- resources -->
            <div class="mt-4" v-show="!eventObject.pomodoroSettings">
                <p class="font-semibold text-base">Resources</p>
                <p>{{ resourcesUsernames }}</p>
            </div>

            <!-- pomodoro settings -->
            <div class="mt-4">
                <p class="font-semibold text-base">Pomodoro settings</p>
                <p>Study: {{ eventObject.pomodoroSettings.minStudy }} minutes</p>
                <p>Relax: {{ eventObject.pomodoroSettings.minRelax }} minutes</p>
                <p>Cycles: {{ eventObject.pomodoroSettings.cycles }}</p>
            </div>
        </div>

        <!-- Edit event form -->
        <form @submit.prevent="applyEdits" v-show="showEditEvent" class="flex flex-col">
            <!-- title -->
            <div class="mt-4">
                <p class="font-semibold text-base">Title</p>
                <input class="border border-third" type="text" maxlength="30" required v-model="editedEventTitle">
            </div>

            <!-- location -->
            <div class="mt-4">
                <p class="font-semibold text-base">Location</p>
                <input class="border border-third" type="text" maxlength="30" required v-model="editedEventLocation">
            </div>
            
            <div class="flex flex-col sm:flex-row">
                <!-- start date -->
                <div class="mt-4">
                    <p class="font-semibold text-base">Starts</p>
                    <DatePicker class="mt-px inline-block w-auto" v-model="editedEventStart" 
                    :format="formatDate" minutes-increment="5" required></DatePicker>
                </div>
                
                <!-- end date -->
                <div class="mt-4 sm:ml-4">
                    <p class="font-semibold text-base">Ends</p>
                    <DatePicker class="mt-px inline-block w-auto" v-model="editedEventEnd" 
                    :format="formatDate" minutes-increment="5" required></DatePicker>
                </div>
            </div>

            <!-- frequency of event -->
            <div class="mt-4">
                <!-- title -->
                <p class="font-semibold text-base">Event frequency</p>

                <!-- button-->
                <button @click="toggleFrequencyMenu" type="button" class="flex justify-center gap-x-1.5 rounded-md bg-secondary 
                px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
                    <span v-show="editedEventFrequency === 'none'">None</span>
                    <span v-show="editedEventFrequency === 'daily'">Daily</span>
                    <span v-show="editedEventFrequency === 'weekly'">Weekly</span>
                    <span v-show="editedEventFrequency === 'monthly'">Monthly</span>
                    <span v-show="editedEventFrequency === 'yearly'">Yearly</span>
                    <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd" />
                    </svg>
                </button>

                <!-- dropdown menu -->
                <div v-show="showFrequencyMenu" class="absolute mt-2 z-50 origin-top-left rounded-md 
                bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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

            <!-- event repetition -->
            <div class="mt-4" v-show="editedEventFrequency != 'none'">
                <p class="font-semibold text-base">Select number of repetitions or date until repetition</p>
                <!-- repetition number -->
                <input name="repNumber" id="repetition_number" min="0" class="mt-px" type="number" v-model="editedEventRepNumber" 
                    :disabled="isEditedRepNumberDisabled" :required="isRepNumberRequired" @input="toggleRepInputs('number')">
                <!-- repetition date -->
                <DatePicker name="repDate" class="inline-block w-auto mt-2 sm:ml-4" v-model="editedEventRepDate" 
                    :enable-time-picker="false" :disabled="isEditedRepDateDisabled" 
                    :format="formatDateNoTime" :required="isRepDateRequired" @update:model-value="toggleRepInputs('date')">
                </DatePicker>
            </div>

            <!-- color picker -->
            <div class="mt-4">
            <p class="font-semibold text-base">Event color</p>
            <input type="color" value="#3C4F76" v-model="editedEventColor">
            </div>

            <div v-show="showAddError" class="bg-red-400 text-white font-bold mt-2 
                inline px-2 text-center mx-auto" > {{ addErrorValue }}</div>

            <!-- buttons -->
            <div class="flex justify-evenly">
                <!-- apply button -->
                <button type="submit" class="w-full mt-4 rounded-md bg-green-700 px-3 py-2 text-md font-semibold 
                    text-white shadow-sm ring-1 ring-inset ring-gray-300">Apply</button>  
            </div>   
        </form>

        <div class="flex justify-evenly">
            <!-- delete button -->
            <button v-show="showInfoEvent" @click="deleteEventObject" type="button" class="w-full mt-4 rounded-md 
                bg-red-500 px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Delete</button>
            <!-- start pomodoro button -->
            <button v-show="showInfoEvent" @click="startPomodoro" type="button" class="w-full mt-4 rounded-md 
                bg-red-500 px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Start pomodoro</button> 
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { editEvent, deleteEvent, getResourcesFromIds } from '@/apis/calendar';
import { computed } from 'vue';
import { exportEventToICS } from './export-events';
import EventExportModal from './EventExport.vue';
import { useRouter } from 'vue-router';

export default {
    emits: ['updateAllCalendars', 'close'],
    components : {
        DatePicker,
        EventExportModal
    },
    props : {
        eventObject : Object
    },
    setup(props, { emit }) {
        const showEditEvent = ref(false)
        const showInfoEvent = ref(true)
        const editedEventTitle = ref()
        const editedEventLocation = ref()
        const editedEventColor = ref()
        const editedEventStart = ref()
        const editedEventEnd = ref()
        const toggleShowEdit = () => {
            editedEventFrequency.value = props.eventObject.frequency
            // set repetition number or date
            if (editedEventFrequency.value != 'none') {
                if (props.eventObject.repetitionNumber) {
                    editedEventRepNumber.value = props.eventObject.repetitionNumber
                    isEditedRepDateDisabled.value = true
                }
                else {
                    editedEventRepDate.value = props.eventObject.repetitionDate
                    isEditedRepNumberDisabled.value = true
                }
                    
            }
            editedEventTitle.value = props.eventObject.title
            editedEventLocation.value = props.eventObject.location
            editedEventStart.value = new Date(props.eventObject.startDate)
            editedEventEnd.value = new Date(props.eventObject.endDate)
            editedEventColor.value = props.eventObject.color

            showEditEvent.value = true
            showInfoEvent.value = false
        }
        /*const toggleEditEvent = () => {
            // if it's about to be toggled on update data inside
            if (!showEditEvent.value) {
                editedEventFrequency.value = props.eventObject.frequency
                // set repetition number or date
                if (editedEventFrequency.value != 'none') {
                    if (props.eventObject.repetitionNumber) {
                        editedEventRepNumber.value = props.eventObject.repetitionNumber
                        isEditedRepDateDisabled.value = true
                    }
                    else {
                        editedEventRepDate.value = props.eventObject.repetitionDate
                        isEditedRepNumberDisabled.value = true
                    }
                        
                }
                editedEventTitle.value = props.eventObject.title
                editedEventLocation.value = props.eventObject.location
                editedEventStart.value = new Date(props.eventObject.startDate)
                editedEventEnd.value = new Date(props.eventObject.endDate)
                editedEventColor.value = props.eventObject.color
            }
            showEditEvent.value = !showEditEvent.value
        }*/

        const toggleShowInfo = () => {
            if (showEditEvent.value) {
                showEditEvent.value = false
            }
            else if (showEventExport.value) {
                showEventExport.value = false
            }
            showInfoEvent.value = true

        }

        // frequency
        const editedEventFrequency = ref('none')
        const selectNoneFrequency = () => {
            editedEventFrequency.value = 'none'
            toggleFrequencyMenu()
        }
        const selectDailyFrequency = () => {
            editedEventFrequency.value = 'daily'
            toggleFrequencyMenu()
        }
        const selectWeeklyFrequency = () => {
            editedEventFrequency.value = 'weekly'
            toggleFrequencyMenu()
        }
        const selectMonthlyFrequency = () => {
            editedEventFrequency.value = 'monthly'
            toggleFrequencyMenu()
        }
        const selectYearlyFrequency = () => {
            editedEventFrequency.value = 'yearly'
            toggleFrequencyMenu()
        }
        const showFrequencyMenu = ref(false)
        const toggleFrequencyMenu = () => {
            showFrequencyMenu.value = !showFrequencyMenu.value
        }
        // repetition
        const editedEventRepNumber = ref()
        const editedEventRepDate = ref()
        const isEditedRepNumberDisabled = ref(false)
        const isEditedRepDateDisabled = ref(false)
        const isRepNumberRequired = computed(() => {
            if (editedEventFrequency.value == 'none')
                return false
            else
                return !(!!editedEventRepDate.value)
        })
        const isRepDateRequired = computed(() => {
            if (editedEventFrequency.value == 'none')
                return false
            else
                return !(!!editedEventRepNumber.value)
        })

        const toggleRepInputs = (activeField) => {
            if (activeField === 'number') {
                isEditedRepDateDisabled.value = !!editedEventRepNumber.value // Disable date input if number input has a value
                //isRepDateRequired.value = !(!!editedEventRepNumber.value)
            } else if (activeField === 'date') {
                isEditedRepNumberDisabled.value = !!editedEventRepDate.value // Disable number input if date input has a value
                //isRepNumberRequired.value = !(!!editedEventRepDate.value)
            }
        }

        const formatDateNoTime = (date) => {
            // format date to dd/mm/yyyy
            return date ? date.toLocaleDateString('it-IT') : '';
        }

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

        const deleteEventObject = async () => {
            await deleteEvent(props.eventObject._id)
            emit('updateAllCalendars')
            emit('close')
        }

        const addErrorValue = ref()
        const showAddError = ref()
        const applyEdits = async () => {
            if (editedEventEnd.value.getTime() <= editedEventStart.value.getTime()) {
                addErrorValue.value = "End date must be after start date"
                showAddError.value = true
            }
            else {
                // create updatedEvent object
                const updatedEvent = structuredClone(props.eventObject)
                if (updatedEvent.repetitionDate)
                    updatedEvent.repetitionDate = new Date(new Date(editedEventRepDate.value).setHours(23,59,59,999))
                updatedEvent.title = editedEventTitle.value
                updatedEvent.location = editedEventLocation.value
                updatedEvent.startDate = editedEventStart.value
                updatedEvent.endDate = editedEventEnd.value
                updatedEvent.frequency = editedEventFrequency.value
                updatedEvent.repetitionNumber = editedEventRepNumber.value
                updatedEvent.color = editedEventColor.value
                await editEvent(props.eventObject._id, updatedEvent)
                emit('updateAllCalendars')
                emit('close')
                showAddError.value = false
            }
        }

        // resources usernames
        const resourcesUsernames = ref()

        const showEventExport = ref(false)
        const toggleShowEventExportOn = () => {
            showInfoEvent.value = false
            showEventExport.value = true
        }
        const exportEvent = () => {
            exportEventToICS(props.eventObject)
            showEventExport.value = true
        }

        const router = useRouter();
        const startPomodoro = () => {
            router.push({
                name: 'pomodoro',
                query: {study: props.eventObject.pomodoroSettings.minStudy, 
                    relax: props.eventObject.pomodoroSettings.minRelax, 
                    cycles: props.eventObject.pomodoroSettings.cycles}
            })
        }

        onMounted(async () => {
            if (props.eventObject.resources && props.eventObject.resources.length > 0) {
                const resourcesObjects = await getResourcesFromIds(props.eventObject.resources)
                if (resourcesObjects.length > 0) {
                    resourcesUsernames.value = resourcesObjects.map(r => r.username).join(", ")
                }
                else 
                    resourcesUsernames.value = 'none'
            }
            else
                resourcesUsernames.value = 'none'
        })
        
        return {
            showEditEvent,
            editedEventTitle,
            editedEventColor,
            editedEventStart,
            editedEventEnd,
            selectNoneFrequency,
            selectDailyFrequency,
            selectWeeklyFrequency,
            selectMonthlyFrequency,
            selectYearlyFrequency,
            editedEventFrequency,
            showFrequencyMenu,
            toggleFrequencyMenu,
            editedEventRepNumber,
            editedEventRepDate,
            editedEventLocation,
            isEditedRepNumberDisabled,
            isEditedRepDateDisabled,
            toggleRepInputs,
            formatDate,
            formatDateNoTime,
            deleteEventObject,
            applyEdits,
            isRepNumberRequired,
            isRepDateRequired,
            showAddError,
            addErrorValue,
            resourcesUsernames,
            exportEvent,
            showEventExport,
            toggleShowEventExportOn,
            toggleShowInfo,
            toggleShowEdit,
            showInfoEvent,
            startPomodoro
        }
    }
}
</script>