<template>

    <div class="flex flex-col items-center mt-24">
        <div class="flex flex-col px-4 py-2 bg-white rounded-md border border-third w-3/4 sm:w-1/2 min-h-40">
            <p class="mt-4 font-semibold">Username</p>
            <p> {{ username }}</p>

            <p class="mt-4 font-semibold">Email</p>
            <p> {{ email }}</p>

            <div class="mt-4" v-if="unavailableStart">
                <p class="font-semibold text-base">Unavailable start</p>
                <p> {{ unavailableStart.toLocaleDateString("it-IT", formatDate) }}</p>  
            </div>

            <div class="mt-4" v-if="unavailableEnd">
                <p class="font-semibold text-base">Unavailable end</p>
                <p> {{ unavailableEnd.toLocaleDateString("it-IT", formatDate) }}</p>  
            </div>

            <div class="mt-4" v-if="unavailableFrequency != 'none'">
                <p class="font-semibold text-base">Unavailable frequency</p>
                <p> {{ unavailableFrequency }} </p>  
            </div>
        </div>

        <button @click="toggleUnavailableModal" class="mt-4 rounded-md bg-secondary 
      px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Set unavailability</button>
    </div>

    <Modal v-show="showUnavailableModal" @close="toggleUnavailableModal">
        <header>
            <div class="flex items-center justify-between flex-row">
                <p class="font-bold">Set unavailability</p>
                <button type="button" @click="toggleUnavailableModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
                src="../images/x.png" alt="Croce"></button>
            </div>
            <hr style="border-color: black"/>
        </header>

        <form @submit.prevent="setUnavailability" class="flex flex-col items-center">
            <div class="flex flex-col sm:flex-row">
                <!-- start date -->
                <div class="mt-4">
                    <p class="font-semibold text-base">Start</p>
                    <DatePicker class="mt-px inline-block w-auto" v-model="unavailableStartToSet" 
                    :format="formatDate" minutes-increment="5" required></DatePicker>
                </div>
                
                <!-- end date -->
                <div class="mt-4 sm:ml-4">
                    <p class="font-semibold text-base">End</p>
                    <DatePicker class="mt-px inline-block w-auto" v-model="unavailableEndToSet" 
                    :format="formatDate" minutes-increment="5" required></DatePicker>
                </div>
            </div>
            
            <!-- frequency dropdown -->
            <!-- title -->
            <p class="font-semibold text-base mt-4">Frequency</p>
            <div>
                <!-- button-->
                <button @click="toggleFrequencyMenu" type="button" class="flex justify-center gap-x-1.5 rounded-md bg-secondary 
                px-3 py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">
                    <span v-show="unavailableFrequencyToSet === 'none'">None</span>
                    <span v-show="unavailableFrequencyToSet === 'daily'">Daily</span>
                    <span v-show="unavailableFrequencyToSet === 'weekly'">Weekly</span>
                    <span v-show="unavailableFrequencyToSet === 'monthly'">Monthly</span>
                    <span v-show="unavailableFrequencyToSet === 'yearly'">Yearly</span>
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
            <div class="mt-4" v-show="unavailableFrequencyToSet != 'none'">
                <p class="font-semibold text-base">Select number of repetitions or date until repetition</p>
                <input id="repetition_number" min="0" type="number" v-model="unavailableRepNumberToSet" 
                :disabled="isRepNumberDisabled" @input="toggleRepInputs('number')" :required="isRepNumberRequired">
                <!-- repetition date -->
                <DatePicker name="repDate" class="inline-block w-auto mt-2 sm:ml-4" v-model="unavailableRepDateToSet" 
                            :format="formatDateNoTime" :enable-time-picker="false" :disabled="isRepDateDisabled" 
                            :required="isRepDateRequired" @update:model-value="toggleRepInputs('date')">
                </DatePicker>
            </div>

            <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 
                    py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Done</button>
        </form>
    </Modal>

</template>

<script>
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import Modal from '@/components/Modal.vue';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    components : {
        DatePicker,
        Modal
    },
    setup() {
        const store = useStore()

        const username = ref()
        const email = ref()
        const unavailableStart = computed(() => store.state.unavailableStart)
        const unavailableEnd = computed(() => store.state.unavailableEnd)
        const unavailableFrequency = computed(() => store.state.unavailableFrequency)
        const unavailableRepNumber = computed(() => store.state.unavailableRepNumber)
        const unavailableRepDate = computed(() => store.state.unavailableRepDate)
        
        const updateUserData = () => {
            username.value = store.state.username
            email.value = store.state.email
        }

        const unavailableStartToSet = ref()
        const unavailableEndToSet = ref()
        
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

        const showUnavailableModal = ref(false)
        const toggleUnavailableModal = () => {
            if (!showUnavailableModal.value) {
                unavailableStartToSet.value = null
                unavailableEndToSet.value = null
                unavailableFrequencyToSet.value = 'none'
                unavailableRepNumberToSet.value = null
                unavailableRepDateToSet.value = null
            }
            showUnavailableModal.value = !showUnavailableModal.value
        }
        const unavailableFrequencyToSet = ref('none')
        const showFrequencyMenu = ref()
        const toggleFrequencyMenu = () => {
            showFrequencyMenu.value = !showFrequencyMenu.value
        }
        const selectNoneFrequency = () => {
            unavailableFrequencyToSet.value = 'none'
            toggleFrequencyMenu()
        }
        const selectDailyFrequency = () => {
            unavailableFrequencyToSet.value = 'daily'
            toggleFrequencyMenu()
        }
        const selectWeeklyFrequency = () => {
            unavailableFrequencyToSet.value = 'weekly'
            toggleFrequencyMenu()
        }
        const selectMonthlyFrequency = () => {
            unavailableFrequencyToSet.value = 'monthly'
            toggleFrequencyMenu()
        }
        const selectYearlyFrequency = () => {
            unavailableFrequencyToSet.value = 'yearly'
            toggleFrequencyMenu()
        }

        // disable number frequency when date is used and viceversa
        const unavailableRepNumberToSet = ref()
        const unavailableRepDateToSet = ref()
        const isRepDateDisabled = ref(false)
        const isRepNumberDisabled = ref(false)
        const isRepNumberRequired = computed(() => {
            if (unavailableFrequencyToSet.value == 'none')
                return false
            else
                return !(!!unavailableRepDateToSet.value)
        })
        const isRepDateRequired = computed(() => {
            if (unavailableFrequencyToSet.value == 'none')
                return false
            else
                return !(!!unavailableRepNumberToSet.value)
        })
        const formatDateNoTime = (date) => {
            // format date to dd/mm/yyyy
            return date ? date.toLocaleDateString('it-IT') : '';
        }

        const toggleRepInputs = (activeField) => {
            if (activeField === 'number') {
                isRepDateDisabled.value = !!unavailableRepNumberToSet.value // Disable date input if number input has a value
                //isRepDateRequired.value = !(!!editedEventRepNumber.value)
            } else if (activeField === 'date') {
                isRepNumberDisabled.value = !!unavailableRepDateToSet.value // Disable number input if date input has a value
                //isRepNumberRequired.value = !(!!editedEventRepDate.value)
            }
        }

        const setUnavailability = () => {
            // modify db
            // modify store
            toggleUnavailableModal()
        }

        onMounted(() => {
            updateUserData()
        })

        return {
            unavailableStartToSet,
            unavailableEndToSet,
            formatDate,
            showFrequencyMenu,
            toggleFrequencyMenu,
            unavailableFrequencyToSet,
            selectNoneFrequency,
            selectDailyFrequency,
            selectWeeklyFrequency,
            selectMonthlyFrequency,
            selectYearlyFrequency,
            unavailableRepNumberToSet,
            unavailableRepDateToSet,
            isRepDateDisabled,
            isRepNumberDisabled,
            isRepNumberRequired,
            isRepDateRequired,
            formatDateNoTime,
            toggleRepInputs,
            username,
            email,
            showUnavailableModal,
            unavailableStart,
            unavailableEnd,
            unavailableFrequency,
            unavailableRepNumber,
            unavailableRepDate,
            toggleUnavailableModal,
            setUnavailability
        }
    }
}
</script>