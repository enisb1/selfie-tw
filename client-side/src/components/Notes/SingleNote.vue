<template>
   <div class="h-32 rounded-r-xl rounded-bl-xl border-4 bg-white border-third shadow-2xl overflow-hidden">
            <h5 @click.self="openNote(note._id)" :class="{'bg-fourth':note.format == 'normalNote'|| 'markdownNote', 'text-secondary':note.format == 'normalNote' || 'markdownNote', 'bg-secondary':note.format == 'Task', 'text-white':note.format == 'Task'}"  
                 class="p-1 h-1/4 m-1 font-medium flex items-center justify-between"> 
                 {{note.title}}
                 <span class="flex justify-between items-center">
                    <button @click="deleteNoteView(note._id)" class="mx-1"><img class="w-4" src="@/images/deleteWhite.png" alt="deleteIcon"></button>
                    <button @click="duplicateNote(note._id)"><img class="w-4" src="@/images/duplicateWhite.png" alt="duplicateIcon"></button>
                 </span>
                 </h5>
            <p v-if="note.format === 'normalNote'" class="px-2 text-xs"> {{note.bodyNote}} </p>
            <div v-if="note.format === 'markdownNote'" v-html="marked(note.bodyNote)" class="px-2 text-xs"></div>
            <div v-if="note.format === 'Task'" class="px-2 text-xs">
                <ul>
                    <li class="flex py-1" v-for="(task, index) in note.bodyTask" :key="index"> 
                         <label class="flex items-center cursor-pointer relative">
                                <input defaultChecked type="checkbox" value="privateAccess" class="peer h-5 w-5 cursor-pointer transition-all 
                                       appearance-none rounded bg-slate-100 shadow hover:shadow-md border
                                       border-slate-300 checked:bg-secondary checked:border-secondary" 
                                       id="check-custom-style" v-model="task.done" disabled/>
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2
                                             transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" 
                                     fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                                          0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                          clip-rule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <div class="px-1"> {{ task.title }} </div>
                    </li>
                </ul>
            </div>
            
    </div>
</template>

<script> 



import { ref } from 'vue';
import { marked } from 'marked';

export default {
    props: ['note'],

    components:{
        
    },

    setup(props, {emit}){


        const deleteNoteView = (id) => {
            emit('delete-note', id)
        }
        const duplicateNote = (id) => {
            emit('duplicate-note', id)
        }
        const openNote = (id) => {
            emit('open-note', id)
        }


        return{
            deleteNoteView,
            duplicateNote,
            openNote,
            marked
        }
        
        
    }

};
</script>

<style>

</style>