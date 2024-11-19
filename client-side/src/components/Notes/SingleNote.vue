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
            <div v-if="note.format === 'Task'" class="px-2 text-xs">{{ note.bodyTask }}</div>
            
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