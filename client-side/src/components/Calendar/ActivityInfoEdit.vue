<template>
    <div class="flex flex-col">
        <!-- Modify and go back button (note: cannot edit activity if it's DONE)-->
        <button @click="toggleEditActivity" v-show="!activityObject.isDone && !showEditActivity && !activityObject.expiringTask && !activityObject.projectData" type="button" 
             class="mt-4 w-6 h-6"><img src="../../images/edit.png" alt="edit"></button>
        <button @click="toggleEditActivity" v-show="!activityObject.isDone && showEditActivity && !activityObject.expiringTask" type="button" 
            class="mt-4 w-6 h-6"><img src="../../images/returnButton.png" alt="edit"></button>

        <!-- Activity info-->
        <div v-show="!showEditActivity" class="flex flex-col">
            <p v-show="activityObject.projectData">Project activities are modifiable only in the Projects Management view</p>

            <!-- deadline -->
            <div class="mt-4">
                <p class="font-semibold text-base">Deadline</p>
                <p> {{ new Intl.DateTimeFormat('it-IT', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
                minute: '2-digit', }).format(new Date(activityObject.deadline)) }}</p>
            </div>

            <!-- is done -->
            <div class="mt-4">
                <p class="font-semibold text-base">Done</p>
                <p> {{ activityObject.isDone? 'yes' : 'no' }}</p>
            </div>

            <!-- name of composite activity if available-->
            <div class="mt-4" v-if="activityObject.compositeActivity">
                <p class="font-semibold text-base">Composite Activity Name</p>
                <p> {{ activityObject.compositeActivity.groupName }}</p>
            </div>

            <!-- participants -->
            <div class="mt-4">
                <p class="font-semibold text-base">Participants</p>
                <p>{{ participants.join(', ') }}</p>
            </div>
        </div>

        <!-- Edit activity form -->
        <form @submit.prevent="applyEdits" v-show="showEditActivity">
            <div class="flex flex-col">
                <div class="mt-4">
                    <p class="font-semibold text-base">Title</p>
                    <input class="border border-third" type="text" maxlength="20" required v-model="editedActivityTitle">
                </div>

                <div class="mt-4">
                    <p class="font-semibold text-base">Deadline</p>
                    <DatePicker class="mt-px inline-block w-auto" v-model="editedActivityDeadline"
                        :format="formatDate" minutes-increment="5" required teleport></DatePicker>
                </div>

                <div class="bg-red-400 text-white font-bold mt-2 
                 inline px-2 text-center mx-auto self-center">{{ activityEditError }}</div>
            </div>
            
            <div class="flex justify-evenly">
                <!-- done button -->
                <button v-show="!activityObject.isDone" @click="setActivityDone" type="button" class="min-w-1/3 mt-4 rounded-md bg-green-700 px-3 py-2 text-md font-semibold 
                    text-white shadow-sm ring-1 ring-inset ring-gray-300">Done</button> 
                <button v-show="showEditActivity" type="submit" class="min-w-1/3 mt-4 rounded-md bg-green-700 px-3 
                    py-2 text-md font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300">Apply</button>
            </div>
        </form>

        <!-- buttons -->
        <div class="flex flex-row justify-evenly" v-show="!showEditActivity">
            <!-- delete button -->
            <button @click="deleteActivityObject" v-show="!activityObject.projectData" type="button" class="w-1/3 mt-4 rounded-md bg-red-500 px-3 py-2 text-md font-semibold 
                 text-white shadow-sm ring-1 ring-inset ring-gray-300">Delete</button>
            <!-- delete for you button -->
            <!-- delete composite -->
            <button v-if="activityObject.compositeActivity" @click="deleteCompositeActivity()" type="button" class="w-1/3 mt-4 rounded-md bg-red-500 px-3 py-2 text-md font-semibold 
                text-white shadow-sm ring-1 ring-inset ring-gray-300">Delete composite</button> 
        </div>
    </div>
</template>

<script>
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { onMounted, ref } from 'vue';
import { editActivity, deleteActivitiesByGroup, deleteActivity } from '@/apis/calendar';
import { getUsers } from '@/apis/users';
import { useStore } from 'vuex';

export default {
    emits: ['updateAllCalendars', 'close'],
    components : {
        DatePicker
    },
    props : {
        activityObject : Object
    },
    setup(props, {emit}) {
        const store = useStore()
        // edit activity
        const showEditActivity = ref(false)
        const editedActivityTitle = ref()
        const participants = ref(['You'])
        const editedActivityDeadline = ref()
        const activityEditError = ref('')
        const toggleEditActivity = () => {
            // if it's about to be toggled on update data inside
            if (!showEditActivity.value) {
                editedActivityTitle.value = props.activityObject.title
                editedActivityDeadline.value = new Date(props.activityObject.deadline)
                activityEditError.value = ''
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

        const deleteActivityObject = async () => {
            await deleteActivity(props.activityObject._id)
            emit('updateAllCalendars')
            emit('close')
        }

        const applyEdits = async () => {
            if (new Date(editedActivityDeadline.value) < new Date()) {
                activityEditError.value = 'Deadline cannot be in the past'
            }
            else {
                // create updatedActivity object
                const updatedActivity = structuredClone(props.activityObject)
                updatedActivity.title = editedActivityTitle.value
                updatedActivity.deadline = editedActivityDeadline.value
                await editActivity(props.activityObject._id, updatedActivity)
                emit('updateAllCalendars')
                emit('close')
            }
        }

        const setActivityDone = async () => {
            const updatedActivity = structuredClone(props.activityObject)
            updatedActivity.isDone = true
            await editActivity(props.activityObject._id, updatedActivity)
            emit('updateAllCalendars')
            emit('close')
        }

        const deleteCompositeActivity = async () => {
            await deleteActivitiesByGroup(props.activityObject.compositeActivity.groupName, 
                props.activityObject.compositeActivity.groupId)
            emit('updateAllCalendars')
            emit('close')
        }

        const deleteUserFromActivity = async () => {
            // create updatedActivity object
            const updatedActivity = structuredClone(props.activityObject)
            updatedActivity.users = updatedActivity.users.filter(u => u._id != store.state._id)
            await editActivity(props.activityObject._id, updatedActivity)
            emit('updateAllCalendars')
            emit('close')
        }

        onMounted(async () => {
            const remainingUsers = props.activityObject.users.filter(u => u != store.state._id)
            if (remainingUsers.length > 0) {
                const participatingUsers = await getUsers(remainingUsers)
                participants.value = participants.value.concat(participatingUsers.map(u => u.username))
            }
        })

        return {
            showEditActivity,
            toggleEditActivity,
            editedActivityTitle,
            editedActivityDeadline,
            formatDate,
            deleteActivityObject,
            applyEdits,
            setActivityDone,
            deleteCompositeActivity,
            participants,
            deleteUserFromActivity,
            activityEditError
        }
    }
}
</script>