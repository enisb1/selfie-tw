<template>
  <!--NoteEditor-->
    <div class="absolute bottom-0 h-full w-full bg-white mb-4">
        <div v-if="noteFormat == 'normalNote'" class="p-4 z-10">
            <button @click="toggleSave(noteBody,note._id)" class="w-4"><img src="@/images/returnButton.png" alt="returnButton"></button>
            <span class="fixed top-16 left-1/2 -translate-x-1/2 text-secondary text-center min-w-72"> 
                Author: {{ noteUser }} 
                Access: {{ noteSecurity }} 
            </span>
            
            <h1 class="font-bold text-2xl mt-8 mb-6"> {{ noteTitle }} </h1>
            <textarea v-model="noteBody" rows="12" cols="50" placeholder="Write your text here..." 
                        class="w-full"></textarea>

        </div>
        <div v-else-if="noteFormat == 'markdownNote'" class="p-4 z-10">
            <button @click="toggleSave(localNoteBody, note._id)" class="w-4"><img src="@/images/returnButton.png" alt="returnButton"></button>
            <span class="fixed top-16 left-1/2 -translate-x-1/2 text-secondary text-center min-w-72"> 
                Author: {{ noteUser }} 
                Access: {{ noteSecurity }} 
            </span>
            <h1 class="font-bold text-2xl mt-8 mb-6"> {{ noteTitle }} </h1>
            <textarea v-model="localNoteBody" rows="12" cols="50" placeholder="Write your text in markdown here..." 
                        class="w-full"></textarea>
            <div v-html="convertedMarkdown" class="fixed bottom-0 left-0 p-4 top-2/3 mt-4 w-full overflow-auto whitespace-normal"></div>
        </div>

        <div v-else class="p-4 z-10">
            <button @click="toggleEditorTask(note._id,taskBody)" class="w-4"><img src="@/images/returnButton.png" alt="returnButton"></button>
            <span class="fixed top-16 left-1/2 -translate-x-1/2 text-secondary text-center min-w-72"> 
                Author: {{ noteUser }} 
                Access: {{ noteSecurity }} 
            </span>
            <div class="relative mt-3">
                <input id="taskInput" class="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border
                                border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none 
                                focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" v-model="taskTitleInput">
                <label for="taskInput" class="absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all 
                                  transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs 
                                  peer-focus:text-slate-400 peer-focus:scale-90">
                        Write the task to add here...
                </label>
            </div>
            <button @click="addTaskBody(taskTitle,taskDone,note._id)" class="p-4 w-full my-4 bg-secondary text-white rounded-xl font-bold">Add task</button>
            <h1 class="font-bold text-2xl mt-6 mb-4  text-secondary overflow-hidden text-center md:text-start"> {{ noteTitle }} </h1>
            <div class="relative h-screen w-full">
            <div class="absolute w-full top-0 bottom-72 overflow-scroll">
                <div class="grid grid-cols-1 gap-2 py-2 lg:grid-cols-3">
                    <div v-for="(task, index) in taskBody" :key="task.id">
                        <SingleTask :task="task" @saveExpiration="saveExpiration(index, note._id, $event)" @deleteTask="deleteTask(index, note._id)"/>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    
</template>

<script>

import { ref, watch } from 'vue'
import { marked } from 'marked'
import SingleNote from '@/components/Notes/SingleNote.vue'
import SingleTask from '@/components/Notes/SingleTask.vue';
import { format } from 'date-fns'
import Modal from '@/components/Modal.vue';
import DatePicker from '@vuepic/vue-datepicker';

export default {
    props: ['note','noteFormat','noteTitle', 'noteBody', 'task','taskBody', 'noteUser', 'noteSecurity'],

    components: {
        SingleNote,
        SingleTask,
        Modal,
        DatePicker
    },

    setup(props, {emit}){
        const {note, noteFormat, noteTitle, noteBody, tasks, taskBody, noteUser, noteSecurity} = props

    

        const localNoteBody = ref(props.noteBody)
        const convertedMarkdown = ref(marked(noteBody)) 


        watch(() => localNoteBody.value, (newVal) => {
            convertedMarkdown.value = marked(newVal)
        })
    
        const toggleSave = (noteBody,id) => {  
            emit('save-note',noteBody,id)
        }

        const taskTitleInput = ref("")
        const addTaskBody = (taskTitle, taskdone, id) => {
            taskTitle = taskTitleInput.value
            if(taskTitle === "") return   
            taskBody.push({title: taskTitle, done: taskdone})
            //emit('add-task',taskTitle,taskdone, id)
            taskTitleInput.value = ""
        }

        
        const toggleEditorTask = (id, body) => {
            emit('add-tasknote', id, body)
        }

        const saveExpiration = (index,noteId,expirationTask) => {
            taskBody[index].expiration = expirationTask
            //emit('saveExpiration',index,noteId,expirationTask)
        }

        const deleteTask = async (index,noteId) => {
            taskBody.splice(index, 1);
            //emit('deleteTask',index,noteId)
        }
        
        /*watch(() => taskBody.value, (newVal) => {
            taskBody.value = newVal
            console.log(newVal)
        })*/

        return{
            toggleSave,
            noteBody,
            marked,
            noteTitle,
            noteBody,
            noteFormat,
            addTaskBody,
            toggleEditorTask,
            tasks,
            taskBody,
            taskTitleInput,
            convertedMarkdown,
            format,
            localNoteBody,
            saveExpiration,
            deleteTask,
            note,
            noteUser,
            noteSecurity
        }

    },



}
</script>

<style>

</style>