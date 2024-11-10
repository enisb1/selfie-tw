<template>
    <div class="flex flex-col">
        <!-- Modify and go back button -->
        <button @click="toggleEditActivity" v-show="!showEditActivity" type="button" class="mt-4 w-6 h-6"><img src="../../images/edit.png" alt="edit"></button>
        <!-- TODO: add go back button -->
        <button @click="toggleEditActivity" v-show="showEditActivity" type="button" class="mt-4 w-6 h-6"><img src="../../images/returnButton.png" alt="edit"></button>

        <!-- Activity info-->
        <div v-show="!showEditActivity" class="flex flex-col">
            <!-- deadline -->
            <div class="mt-4">
                <p class="font-semibold text-base">Deadline</p>
                <p> {{ new Intl.DateTimeFormat('it-IT', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
                minute: '2-digit', }).format(new Date(activityObject.deadline)) }}</p>
            </div>
        </div>

        <!-- Edit activity -->
        <div v-show="showEditActivity" class="flex flex-col">
            <div class="mt-4">
                <p class="font-semibold text-base">Title</p>
                <input class="border border-third" type="text" maxlength="50" required v-model="editedActivityTitle">
            </div>

            <div class="mt-4">
                <p class="font-semibold text-base">Deadline</p>
                <DatePicker class="mt-px inline-block w-auto" v-model="editedActivityDeadline"
                    :format="formatDate" minutes-increment="5" required></DatePicker>
            </div>
        </div>

        <!-- buttons -->
        <div class="flex flex-row justify-evenly">
            <button v-show="showEditActivity" type="submit" class="w-1/3 mt-4 rounded-md bg-green-700 px-3 py-2 text-md font-semibold 
            text-white shadow-sm ring-1 ring-inset ring-gray-300">Apply</button>
            <!-- done button -->
            <button v-show="!showEditActivity" @click="deleteScheduleObject" type="submit" class="w-1/3 mt-4 rounded-md bg-green-700 px-3 py-2 text-md font-semibold 
            text-white shadow-sm ring-1 ring-inset ring-gray-300">Done</button> 
            <!-- delete button -->
            <button @click="deleteScheduleObject" type="submit" class="w-1/3 mt-4 rounded-md bg-red-500 px-3 py-2 text-md font-semibold 
            text-white shadow-sm ring-1 ring-inset ring-gray-300">Delete</button> 
        </div>
    </div>
</template>

<script>
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';

export default {
    components : {
        DatePicker
    },
    props : {
        activityObject : Object
    },
    setup(props) {
        // edit activity
        const showEditActivity = ref(false)
        const editedActivityTitle = ref()
        const editedActivityDeadline = ref()
        const toggleEditActivity = () => {
            // if it's about to be toggled on update data inside
            if (!showEditActivity.value) {
                editedActivityTitle.value = props.activityObject.title
                editedActivityDeadline.value = new Date(props.activityObject.deadline)
            }
            showEditActivity.value = !showEditActivity.value
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

        return {
            showEditActivity,
            toggleEditActivity,
            editedActivityTitle,
            editedActivityDeadline,
            formatDate
        }
    }
}
</script>