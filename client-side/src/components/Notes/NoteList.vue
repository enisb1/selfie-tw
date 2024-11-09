<template>
<div class="grid grid-cols-1 gap-8 mx-10 pb-20 py-2 lg:grid-cols-3 lg:py-24">
    <div v-for="note in notes" :key="note.id">
        <SingleNote :note="note" @delete-note="deleteNote" @duplicate-note="duplicateNote" @details-note="noteViewDetails"/>
        
        
    </div>
</div>
  
</template>

<script>
import SingleNote from '@/components/Notes/SingleNote.vue';





export default {
    props: ['notes'],
    components: {SingleNote},
    setup(props, {emit}) {
        console.log(props.notes)

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

        
    }}
        
</script>

<style>

</style>