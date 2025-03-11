<template>
<div class="flex justify-between items-center">
  <div class="w-2/3 inline-flex items-center">
  <label
    class="relative flex cursor-pointer items-center rounded-full p-3"
    for="ripple-on"
    data-ripple-dark="true"
  >
    <input
      id="ripple-on"
      type="checkbox"
      class="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-secondary/30 
      shadow hover:shadow-md transition-all before:absolute before:top-2/4 before:left-2/4 before:block 
      before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full 
      before:bg-secondary/40 before:opacity-0 before:transition-opacity checked:border-secondary/80 checked:bg-secondary
      checked:before:bg-secondary/40 hover:before:opacity-10"
      v-model="task.done"  

    />
    <span class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </span>
  </label>
  <label class="w-3/4 cursor-pointer text-slate-600 text-sm" for="ripple-on">
      <h3 class="font-semibold text-lg text-secondary truncate"> {{ task.title }} </h3>
  </label>
  </div>
  <span v-if="task.expiration !== undefined" class="text-slate-700 text-sm">{{ formatISODate(task.expiration) }}</span>
  <div class="flex items-center">
      <img @click="deleteTask" src="@/images/deletesecondary.png" alt="delete" class="w-3 mr-4">
      <img @click="openExiparation" src="@/images/schedule.png" alt="schedule" class="w-3">
  </div>
<Modal @click.self="openExiparation" v-show="exiparationVisible">
            <div class="h-full w-full
                        md:flex md:justify-between md:items-center">
                <div class="w-auto font-bold text-secondary text-center mb-4">Select expiration date:</div>
                <div><DatePicker class="relative left-1/2 -translate-x-1/2 mt-px inline-block w-auto mb-4"  v-model="expirationTask" :format="formatDate" minutes-increment="5" :start-time="startTime"></DatePicker></div>
                <div><button @click="saveExpiration(expirationTask)" class="relative left-1/2 -translate-x-1/2 p-2 rounded-2xl text-white bg-secondary font-bold">Save expiration</button></div>
            </div>
        </Modal>
</div>
</template>

<script>

import {ref, watch} from 'vue';
import Modal from '@/components/Modal.vue';
import DatePicker from '@vuepic/vue-datepicker';

export default {
    props: ['task'],

    components: {
      Modal,
      DatePicker
    },

    

    setup(props, {emit}){

      const expirationTask = ref(props.task.expiration)
      
      const exiparationVisible = ref(false)
        const openExiparation = () => {
            exiparationVisible.value = !exiparationVisible.value
        }

      const saveExpiration = (expirationTask) => {
        if (!expirationTask)
          props.task.expiration = undefined
        else
          props.task.expiration = expirationTask
        emit('saveExpiration',expirationTask)
        exiparationVisible.value = false
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
      const startTime = ref({ hours: 12, minutes: 30 })

      function formatISODate(isoDateString) {
        const date = new Date(isoDateString);

        // Aggiungere un'ora
        date.setUTCHours(date.getUTCHours() + 1);

        // Giorno
        const day = date.getUTCDate();

        // Mese (in formato abbreviato)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getUTCMonth()];

        // Anno
        const year = date.getUTCFullYear();

        return `${day} ${month} ${year}`;
     }

     watch(() => props.task.expiration, (newVal) => {
      expirationTask.value = newVal;
    });

    const deleteTask = () => {
        emit('deleteTask', props.task) 
      }
   
  

        
      return{
        openExiparation,
        exiparationVisible,
        saveExpiration,
        formatISODate,
        expirationTask,
        formatDate,
        startTime,
        deleteTask
      }
    }

};
</script>

<style>

</style>