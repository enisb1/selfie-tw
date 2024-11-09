<template>
   <div @click.self="noteViewDetails(note._id)" class="h-32 rounded-r-xl rounded-bl-xl border-4 bg-white border-third shadow-2xl overflow-hidden">
            <h5 :class="{'bg-fourth':note.format == 'normalNote'|| 'markdownNote', 'text-secondary':note.format == 'normalNote' || 'markdownNote', 'bg-secondary':note.format == 'Task', 'text-white':note.format == 'Task'}"  
                 class="p-1 h-1/4 m-1 font-medium flex items-center justify-between"> 
                 {{note.title}} 
                 <span class="flex justify-between items-center">
                     <button @click="deleteNote(note._id)" class="mx-1"><img class="w-4" src="@/images/deleteWhite.png" alt="deleteIcon"></button>
                     <button @click="duplicateNote(note._id)"><img class="w-4" src="@/images/duplicateWhite.png" alt="duplicateIcon"></button>
                 </span>
                 </h5>
            <p class="px-2 text-xs"> {{note.bodyNote}} </p>
    </div>
</template>

<script>




export default {
    props: ['note'],
    setup(props, {emit}){
        const deleteNote = (id) => {
            emit('delete-note', id)
        }
        const duplicateNote = (id) => {
            emit('duplicate-note', id)
        }
        const noteViewDetails = (id) => {
            emit('details-note', id)
        }

        

        return{
            deleteNote,
            duplicateNote,
            noteViewDetails
        }
        
        
    }

};
</script>

<style>

</style>