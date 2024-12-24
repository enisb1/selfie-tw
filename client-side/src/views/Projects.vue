<template>
    <!-- side navbar -->
    <div class="fixed w-1/5 h-full border-t border-white bg-secondary">
        <div class="relative h-full w-full">
            <!-- first section -->
            <div class="absolute flex flex-col top-0 bottom-2/3 w-full border-b border-white text-white text-xl font-bold whitespace-nowrap">
                <div class="w-full h-1/4 pl-0 sm:pl-6 flex items-center justify-center sm:justify-normal"><button @click="toggleCreateProjectModal" class="flex justify-start items-center"><img src="@/images/create.png" alt="create" class="w-5 mr-0 sm:mr-3"><span class="hidden sm:block">Create</span></button></div>
                <div class="w-full h-1/4 pl-0 sm:pl-6 flex items-center justify-center sm:justify-normal">
                  <button @click="homePage" class="flex justify-start items-center">
                    <img src="@/images/home.png" alt="home" class="w-5 mr-0 sm:mr-3">
                    <span class="hidden sm:block">Home</span>
                  </button>
                </div>
                <div class="w-full h-1/4 pl-0 sm:pl-6 flex items-center justify-center sm:justify-normal"><button class="flex justify-start items-center"><img src="@/images/activity.png" alt="activity" class="w-5 mr-0 sm:mr-3"><span class="hidden sm:block">My activities</span></button></div>
                <div class="w-full h-1/4 pl-0 sm:pl-6 flex items-center justify-center sm:justify-normal">
                  <button class="flex justify-start items-center">
                    <img src="@/images/campana.png" alt="inbox" class="w-5 mr-0 sm:mr-3">
                      <span class="hidden sm:block">Inbox</span>
                  </button>
                </div>
            </div>  
        
            <!-- second section -->
            <div class="absolute top-1/3 bottom-0 w-full">
                <div class="text-white text-xl font-bold pl-6 py-4">Projects</div>
                <div class="w-5/6 w- h-full flex flex-col gap-2 text-white font-semibold pl-6">
                    <div @click="showProject" class="flex justify-start items-center">
                        <div class="w-5 h-5 rounded-md bg-red-500 mr-2 p-2"></div>
                        <div class="truncate">Titolo del progetto interfunzionale</div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
  
    <!-- home view -->
    <div v-show="inHome" class="fixed w-4/5 h-full right-0 flex flex-col items-center mt-16 space-y-8">
      <div v-for="project in projects" class="px-4 py-2 bg-white rounded-md border 
        border-third w-3/4 sm:w-1/2 cursor-pointer" @click="showProject(project)">
        {{ project.name }}
      </div>
    </div>
  
    <!-- project view -->
    <div v-if="inProject" class="fixed right-0 w-4/5 h-full bg-primary">
        <div class="relative h-1/6 w-full border-b-2 border-secondary">
            <div class="absolute top-1/4 text-secondary text-3xl font-bold pl-8 flex justify-start items-center">
                <div class="h-10 w-10 bg-red-500 rounded-xl mr-3"></div>
                {{ currentProject.name }}
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
            <div v-show="inOverview" class="px-10">
              <button @click="toggleAddActivityModal" class="flex items-center bg-white rounded-lg border border-third px-2 py-1 mt-4">
                <img src="../images/add.png" class="mr-2 h-3.5 w-3.5">
                <span>Add activity</span>
              </button>
  
              <!-- Todo -->
              <h2 class="font-bold text-2xl mt-6 text-secondary">To do</h2>
              <hr class="border-secondary border">
              <div>
                <div v-for="activity in todoActivities" :key="activity._id" class="mt-2 text-secondary font-semibold">
                  <div class="w-full flex items-center">
                    <!-- title -->
                    <div class="w-2/5">{{ activity.title }}</div>
                    <!-- deadline -->
                    <div class="w-1/5 border-l border-secondary">
                      <span class="ml-1">{{ new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat) }}</span>
                    </div>
                    <!-- milestone or not-->
                    <div class="w-1/5 border-l border-secondary">
                      <span class="ml-1">{{ activity.projectData.milestone? 'Milestone' : 'Normal' }}</span>
                    </div>
                    <!-- status -->
                    <div class="w-1/5 border-l border-secondary">
                      <div class="inline-block px-2 py-1 border-l border-secondary bg-secondary text-white 
                        ml-1 rounded-md">
                        {{ activity.projectData.status }}
                      </div>
                    </div>  
                  </div>
                  <hr class="border-gray-400 border mt-px">
                </div>
              </div>
  
              <!-- In progress -->
  
              <!-- Completed -->
            </div>
  
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
  
    <!-- CREATE PROJECT MODAL -->
    <Modal v-show="showCreateProjectModal" @close="toggleCreateProjectModal">
      <header>
          <div class="flex items-center justify-between flex-row font-bold">
              <p class="text-truncate text-lg">Create project</p>
              <button type="button" @click="toggleCreateProjectModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
              src="../images/x.png" alt="Croce"></button>
          </div>
          <hr class="border-black"/>
      </header>
  
      <form @submit.prevent="createNewProject">
        <div class="flex flex-col">
          <!-- name -->
          <div class="mt-4">
            <p class="font-semibold text-base">Name</p>
            <input class="border border-third" type="text" maxlength="30" required v-model="projectToCreateName">
          </div>
  
          <!-- description -->
          <!-- TODO: change to textbox for better input quality -->
          <div class="mt-4">
            <p class="font-semibold text-base">Description</p>
            <input class="border border-third" type="text" maxlength="30" required v-model="projectToCreateDescription">
          </div>
  
          <div class="flex flex-col sm:flex-row">
            <!-- start date -->
            <div class="mt-4">
              <p class="font-semibold text-base">Starts</p>
              <DatePicker class="mt-px inline-block w-auto" v-model="projectToCreateStart" 
                :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
            </div>
            
            <!-- end date -->
            <div class="mt-4 sm:ml-4">
              <p class="font-semibold text-base">Ends</p>
              <DatePicker class="mt-px inline-block w-auto" v-model="projectToCreateEnd" 
                :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
            </div>
          </div>
  
          <!-- invite users -->
          <div class="mt-4">
            <p class="font-semibold text-base">Invite users</p>
            <Multiselect  v-model="projectToCreateSelectedUsers" :options="selectableUsersOptions" optionLabel="username" 
            placeholder="Select users" label="username" :multiple="true"
            :close-on-select="false" :clear-on-select="false"
            :preserve-search="true" track-by="username" :preselect-first="true">
            </Multiselect>
          </div>
  
          <!-- final milestone name -->
          <div class="mt-4">
            <p class="font-semibold text-base">Final milestone name</p>
            <input class="border border-third" type="text" maxlength="30" required v-model="projectToCreateFinalMilestoneName">
          </div>
  
          <div v-show="showAddError" class="bg-red-400 text-white font-bold mt-2 
          inline px-2 text-center mx-auto" > {{ errorValue }}</div>
  
          <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
          text-white shadow-sm ring-1 ring-inset ring-gray-300">Create</button>
        </div>
      </form>
    </Modal>
  
    <!-- ADD ACTIVITY -->
    <Modal v-if="inAddActivityModal" @close="toggleAddActivityModal">
      <form @submit.prevent="addActivity">
        <div class="flex flex-col">
          <!-- title -->
          <div class="mt-4">
            <p class="font-semibold text-base">Title</p>
            <input class="border border-third" type="text" maxlength="20" required v-model="activityToAddTitle">
          </div>
  
          <!-- deadline -->
          <div class="mt-4">
            <p class="font-semibold text-base">Deadline</p>
            <DatePicker class="mt-px inline-block w-auto" v-model="activityToAddDeadline"
              :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
          </div>
  
          <!-- invite users -->
          <div class="mt-4">
            <p class="font-semibold text-base">Invite users</p>
            <Multiselect v-model="newActivitySelectedUsers" :options="projectUsers"
              optionLabel="username" placeholder="Select users" label="username" :multiple="true"
              :close-on-select="false" :clear-on-select="false"
              :preserve-search="true" track-by="username">
            </Multiselect>
          </div>
  
          <!-- milestone -->
          <div class="mt-4">
            <p class="font-semibold text-base">Milestone</p>
            <input type="checkbox" required v-model="activityToAddIsMilestone">
          </div>
  
          <div v-show="showAddActivityError" class="bg-red-400 text-white font-bold mt-2 
          inline px-2 text-center mx-auto" > {{ addActivityErrorValue }}</div>
  
          <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
              text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
        </div>
  
      </form>
    </Modal>
  </template>
  
  <script>
  import {onMounted, ref, computed } from 'vue'
  import Modal from '@/components/Modal.vue';
  import Multiselect from 'vue-multiselect';
  import { getAllUsers, getUsers } from '@/apis/users';
  import { useStore } from 'vuex';
  import { addActivityToProject, createProject, getProjectsByUser } from '@/apis/projects';
  import DatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import { getActivitiesByProject, postActivity, updateActivityProjectId } from '@/apis/calendar';
  
  export default {
    components: {
      Modal,
      Multiselect,
      DatePicker
    },
    setup(){
      const store = useStore()
  
      const projects = ref()
      const inHome = ref(true)
      const homePage = async () => {
        projects.value = await getProjectsByUser(store.state._id)
        console.log(projects.value)
        inHome.value = true
        inProject.value = false
      }
  
      // current project
      const inProject = ref(false)
      const currentProject = ref()
      const projectUsers = ref()
      const projectActivities = ref()
      const showProject = async (project) => {
        inProject.value = true
        inHome.value = false
        currentProject.value = project
        projectActivities.value = await getActivitiesByProject(project._id)
      }
  
      const todoActivities = computed(() => {
        if (projectActivities.value)
          return projectActivities.value.filter(activity => activity.status === 'activable' || 'waitingActivable')
        else
          return []
      })
  
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
  
      // project creation
      const projectToCreateName = ref()
      const projectToCreateDescription = ref()
      const projectToCreateFinalMilestoneName = ref()
      const projectToCreateStart = ref()
      const projectToCreateEnd = ref()
  
      const showCreateProjectModal = ref(false)
      const selectableUsersOptions = ref([])
      const projectToCreateSelectedUsers = ref([])
      const toggleCreateProjectModal = () => {
        if (!showCreateProjectModal.value) {
          projectToCreateName.value = ''
          projectToCreateDescription.value = ''
          projectToCreateSelectedUsers.value = []
          showAddError.value = false
          projectToCreateStart.value = null
          projectToCreateEnd.value = null
          projectToCreateFinalMilestoneName.value = ''
        }
        showCreateProjectModal.value = !showCreateProjectModal.value
      }
  
      const showAddError = ref(false)
      const errorValue = ref('')
      const createNewProject = async () => {
        //TODO: invite members instead of automatically adding them
        // (as already done for activities/events)
        if (projectToCreateEnd.value.getTime() <= projectToCreateStart.value.getTime()) {
          errorValue.value = "End date must be after start date"
          showAddError.value = true
        }
        else {
          const selectedUsersIds = projectToCreateSelectedUsers.value.map(user => user._id).concat(store.state._id)
          const milestoneActivityProjectData = {
            projectId: null,
            isMilestone: true,
            subActivities: null
          }
          const milestoneActivity = await postActivity(projectToCreateFinalMilestoneName.value,  
            projectToCreateEnd.value, selectedUsersIds, milestoneActivityProjectData)
          const createdProject = await createProject(projectToCreateName.value, projectToCreateDescription.value, 
          projectToCreateStart.value, projectToCreateEnd.value,
          store.state._id, selectedUsersIds, [milestoneActivity._id])
          await updateActivityProjectId(milestoneActivity._id, createdProject._id)
          showAddError.value = false
        }
      }
  
      // add activity
      const inAddActivityModal = ref(false)
      const toggleAddActivityModal = async () => {
        if (!inAddActivityModal.value) {
          activityToAddTitle.value = ''
          activityToAddDeadline.value = null
          newActivitySelectedUsers.value = []
          showAddActivityError.value = false
          projectUsers.value = await getUsers(currentProject.value.members)
        }
        inAddActivityModal.value = !inAddActivityModal.value
      }
      const activityToAddTitle = ref()
      const activityToAddDeadline = ref()
      const newActivitySelectedUsers = ref([])
      const activityToAddIsMilestone = ref(false)
  
      const addActivityErrorValue = ref()
      const showAddActivityError = ref()
      const addActivity = async () => {
        if (activityToAddDeadline.value.getTime() <= new Date(currentProject.value.start).getTime()
            || activityToAddDeadline.value.getTime() >= new Date(currentProject.value.end).getTime()) {
          addActivityErrorValue.value = "Deadline must be between project start and end date"
          showAddActivityError.value = true
        }
        else {
          const activityUsers = newActivitySelectedUsers.value.map(user => user._id).concat(store.state._id)
          //TODO: set correct status based on previous activity (if previous activity is done it means
          //it has output, hence the new activity can be activable, else it must be waitingActivable)
          //TODO: make creation of set of activities possible
          const projectData = {
            projectId: currentProject.value._id,
            isMilestone: activityToAddIsMilestone.value,
            subActivities: null,
            status: 'activable'
          }
          const createdActivity = await postActivity(activityToAddTitle.value, activityToAddDeadline.value, activityUsers, projectData)
          await addActivityToProject(currentProject.value._id, createdActivity._id)
          showAddActivityError.value = false
        }
      }
  
      const infoDateFormat = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // (12 hour format)
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
  
      onMounted(async () => {
        // initialize data
        selectableUsersOptions.value = await getAllUsers()
        projects.value = await getProjectsByUser(store.state._id)
      })
  
      return{
        inHome,
        homePage,
        inProject,
        showProject,
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
        filePage,
        toggleCreateProjectModal,
        showCreateProjectModal,
        selectableUsersOptions,
        projectToCreateSelectedUsers,
        projectToCreateSelectedUsers,
        projectToCreateName,
        projectToCreateDescription,
        createNewProject,
        projectToCreateFinalMilestoneName,
        formatDate,
        projectToCreateStart,
        projectToCreateEnd,
        startTime,
        showAddError,
        errorValue,
        projects,
        showProject,
        currentProject,
        inAddActivityModal,
        activityToAddTitle,
        activityToAddDeadline,
        newActivitySelectedUsers,
        projectUsers,
        toggleAddActivityModal,
        addActivity,
        showAddActivityError,
        addActivityErrorValue,
        activityToAddIsMilestone,
        todoActivities,
        infoDateFormat
      }
    }
  
  }
  </script>
  
  <!-- Multiselect CSS -->
  <style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
  
  <style>
  
  </style>