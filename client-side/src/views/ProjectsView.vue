<template>
<div>
  <!-- side navbar -->
  <div class="fixed w-1/5 h-full border-t border-white bg-secondary">
      <div class="relative h-full w-full">

          <!-- first section -->
          <div class="absolute flex flex-col top-0 bottom-2/3 w-full border-b border-white text-white text-xl font-bold whitespace-nowrap">
              <div class="w-full h-1/4 pl-6 flex items-center"><button class="flex justify-start items-center"><img src="@/images/create.png" alt="create" class="w-5 mr-3">Create</button></div>
              <div class="w-full h-1/4 pl-6 flex items-center"><button @click="homePage" class="flex justify-start items-center"><img src="@/images/home.png" alt="home" class="w-5 mr-3">Home</button></div>
              <div class="w-full h-1/4 pl-6 flex items-center"><button class="flex justify-start items-center"><img src="@/images/activity.png" alt="activity" class="w-5 mr-3">My activities</button></div>
              <div class="w-full h-1/4 pl-6 flex items-center"><button class="flex justify-start items-center"><img src="@/images/campana.png" alt="inbox" class="w-5 mr-3">Inbox</button></div>
          </div>  
      
          <!-- second section -->
          <div class="absolute top-1/3 bottom-0 w-full">
              <div class="text-white text-xl font-bold pl-6 py-4">Projects</div>
              <div class="w-5/6 w- h-full flex flex-col gap-2 text-white font-semibold pl-6">
                  <div @click="projectPage" class="flex justify-start items-center">
                      <div class="w-5 h-5 rounded-md bg-red-500 mr-2 p-2"></div>
                      <div class="truncate">Titolo del progetto interfunzionale</div>
                  </div>  
              </div>
          </div>
      </div>
  </div>

  <!-- home view -->
  <div v-show="inHome" class="fixed w-4/5 h-full right-0">HOME</div>

  <!-- project view -->
  <div v-show="inProject" class="fixed right-0 w-4/5 h-full bg-white">
       <div class="relative h-1/6 w-full border-b-2 border-secondary">
           <div class="absolute top-1/4 text-secondary text-3xl font-bold pl-8 flex justify-start items-center">
               <div class="h-10 w-10 bg-red-500 rounded-xl mr-3"></div>
               Titolo del progetto interfunzionale
               <div><button class="ml-2"><img src="@/images/down_arrow.png" alt="downarrow" class="w-4"></button></div>
               <div class="text-sm ml-2"><button class="flex justify-start items-center pt-2"><div class="w-3 h-3 rounded-full bg-secondary mr-2"></div>Set state</button></div>
           </div>

           <!-- subnavbar project view -->
           <div class="absolute bottom-0 flex pl-10 text-secondary font-semibold">
               <div class="px-4" :class="{'border-b-4 border-secondary': inOverview, 'border-0': !inOverview}"><button @click="overviewPage" class="flex justify-start items-center"><img src="@/images/overview.png" alt="overview" class="w-5 mr-1">Overview</button></div> 
               <div class="px-4" :class="{'border-b-4 border-secondary': inList, 'border-0': !inList}"><button @click="listPage" class="flex justify-start items-center"><img src="@/images/list.png" alt="list" class="w-5 mr-1">List</button></div> 
               <div class="px-4" :class="{'border-b-4 border-secondary': inGantt, 'border-0': !inGantt}"><button @click="ganttPage" class="flex justify-start items-center"><img src="@/images/gantt.png" alt="gantt" class="w-5 mr-1">Gantt</button></div> 
               <div class="px-4" :class="{'border-b-4 border-secondary': inDashboard, 'border-0': !inDashboard}"><button @click="dashboardPage" class="flex justify-start items-center"><img src="@/images/dashboard.png" alt="dashboard" class="w-5 mr-1">Dashboard</button></div> 
               <div class="px-4" :class="{'border-b-4 border-secondary': inMessage, 'border-0': !inMessage}"><button @click="messagePage" class="flex justify-start items-center"><img src="@/images/message.png" alt="message" class="w-5 mr-1">Message</button></div> 
               <div class="px-4" :class="{'border-b-4 border-secondary': inFile, 'border-0': !inFile}"><button @click="filePage" class="flex justify-start items-center"><img src="@/images/file.png" alt="file" class="w-5 mr-1">File</button></div> 
           </div>
       </div>

       <div class="relative h-5/6 w-full">

           <!-- overview page -->
           <div v-show="inOverview">OVERVIEW PAGE</div>

           <!-- list page -->
           <div v-show="inList">LIST PAGE</div>

           <!-- gantt page -->
           <div v-show="inGantt">GANTT PAGE</div>

           <!-- dashboard page -->
           <div v-show="inDashboard">DASHBOARD PAGE</div>

           <!-- message page -->
           <div v-show="inMessage">MESSAGE PAGE</div>

           <!-- file page -->
           <div v-show="inFile">FILE PAGE</div>
       </div> 
  </div> 



</div>
</template>



<script>
import {ref} from 'vue'

export default {

  setup(){

    const inHome = ref(true)
    const homePage = () => {
      inHome.value = true
      inProject.value = false
    }

    const inProject = ref(false)
    const projectPage = () => {
      inProject.value = true
      inHome.value = false
    }

    const inOverview = ref(true)
    const overviewPage = () => {
      inOverview.value = true
      inList.value = false
      inGantt.value = false
      inDashboard.value = false
      inMessage.value = false
      inFile.value = false  
    }

    const inList = ref(false)
    const listPage = () => {
      inList.value = true  
      inOverview.value = false
      inGantt.value = false
      inDashboard.value = false
      inMessage.value = false
      inFile.value = false
    }

    const inGantt = ref(false)
    const ganttPage = () => {
      inGantt.value = true
      inOverview.value = false
      inList.value = false
      inDashboard.value = false
      inMessage.value = false
      inFile.value = false  
    }

    const inDashboard = ref(false)
    const dashboardPage = () => {
      inDashboard.value = true
      inOverview.value = false
      inList.value = false
      inGantt.value = false
      inMessage.value = false
      inFile.value = false  
    }

    const inMessage = ref(false)
    const messagePage = () => {
      inMessage.value = true
      inOverview.value = false
      inList.value = false
      inGantt.value = false
      inDashboard.value = false
      inFile.value = false  
    }

    const inFile = ref(false)
    const filePage = () => {
      inFile.value = true
      inOverview.value = false
      inList.value = false
      inGantt.value = false
      inDashboard.value = false
      inMessage.value = false 
    }


    return{
      inHome,
      homePage,
      inProject,
      projectPage,
      inOverview,
      overviewPage,
      inList,
      listPage,
      inGantt,
      ganttPage,
      inDashboard,
      dashboardPage,
      inMessage,
      messagePage,
      inFile,
      filePage
    }
  }

}
</script>

<style>

</style>