<template>
<div class="grid grid-cols-1 gap-2 py-2 lg:grid-cols-3">
    <div v-for="task in tasks" :key="task.id">
        <SingleTask :task="task" />
        
        
    </div>
</div>
  
</template>

<script>
import SingleTask from '@/components/Notes/SingleTask.vue';





export default {
    props: ['tasks'],
    components: {SingleTask},
    setup(props) {
        console.log(props.tasks)

        
    }}
        
</script>

<style>

</style>