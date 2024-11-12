<template>
    <div class="flex flex-col">
        <!-- Edit and go back button -->
        <button @click="toggleEditEvent" v-show="!showEditEvent" type="button" class="mt-4 w-6 h-6">
            <img src="../../images/edit.png" alt="edit"></button>
        <button @click="toggleEditEvent" v-show="showEditEvent" type="button" class="mt-4 w-6 h-6">
            <img src="../../images/returnButton.png" alt="back"></button>

        <!-- Event info -->
        <div v-show="!showEditEvent">
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
            <div class="mt-4">
                <p class="font-semibold text-base">Frequency </p>
                <p v-show="eventObject.frequency != 'none'"> {{ eventObject.frequency }} frequency {{ eventObject.repetitionNumber ? `repeating ${eventObject.repetitionNumber} times` :
                    `until ${new Date(eventObject.repetitionDate).toLocaleDateString
                    ('it-IT', {day: '2-digit', month: '2-digit', year: 'numeric'})}` }}</p>
                <p v-show="eventObject.frequency == 'none'">none</p>    
            </div>
        </div>

        <!-- Edit event form -->
        <form @submit.prevent="applyEdits" v-show="showEditEvent">
            <!-- title -->
            <div class="mt-4">
                <p class="font-semibold text-base">Title</p>
                <input class="border border-third" type="text" maxlength="30" required v-model="editedEventTitle">
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

            <!-- buttons -->
            <div class="flex justify-evenly">
                <!-- apply button -->
                <button type="submit" class="w-full mt-4 rounded-md bg-green-700 px-3 py-2 text-md font-semibold 
                    text-white shadow-sm ring-1 ring-inset ring-gray-300">Apply</button>  
            </div>   
        </form>

        <div class="flex justify-evenly">
            <!-- delete button -->
            <button v-show="!showEditEvent" @click="deleteEventObject" type="button" class="w-full mt-4 rounded-md 
                bg-red-500 px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Delete</button> 
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { deleteEvent } from '@/apis/calendar';
import { editEvent } from '@/apis/calendar';
import { computed } from 'vue';

export default {
    emits: ['updateAllCalendars', 'close'],
    components : {
        DatePicker
    },
    props : {
        eventObject : Object
    },
    setup(props, { emit }) {
        const showEditEvent = ref(false)
        const editedEventTitle = ref()
        const editedEventColor = ref()
        const editedEventStart = ref()
        const editedEventEnd = ref()
        const toggleEditEvent = () => {
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
                editedEventStart.value = new Date(props.eventObject.startDate)
                editedEventEnd.value = new Date(props.eventObject.endDate)
                editedEventColor.value = props.eventObject.color
            }
            showEditEvent.value = !showEditEvent.value
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

        const applyEdits = async () => {
            // create updatedEvent object
            const updatedEvent = structuredClone(props.eventObject)
            if (updatedEvent.repetitionDate)
                updatedEvent.repetitionDate = new Date(new Date(editedEventRepDate.value).setHours(23,59,59,999))
            updatedEvent.title = editedEventTitle.value
            updatedEvent.startDate = editedEventStart.value
            updatedEvent.endDate = editedEventEnd.value
            updatedEvent.frequency = editedEventFrequency.value
            updatedEvent.repetitionNumber = editedEventRepNumber.value
            updatedEvent.color = editedEventColor.value
            await editEvent(props.eventObject._id, updatedEvent)
            emit('updateAllCalendars')
            emit('close')
        }
        
        return {
            showEditEvent,
            editedEventTitle,
            editedEventColor,
            editedEventStart,
            editedEventEnd,
            toggleEditEvent,
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
            isEditedRepNumberDisabled,
            isEditedRepDateDisabled,
            toggleRepInputs,
            formatDate,
            formatDateNoTime,
            deleteEventObject,
            applyEdits,
            isRepNumberRequired,
            isRepDateRequired
        }
    }
}
</script>