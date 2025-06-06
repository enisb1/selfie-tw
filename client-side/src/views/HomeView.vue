<template>
  <!-- Heading -->
  <div class="flex items-center justify-center mt-10 mb-10">
    <h1 class="text-4xl font-bold text-secondary">Dashboard</h1>
  </div>

  <!-- Buttons Section -->
  <div class="flex gap-6 w-full justify-center px-10 flex-col sm:flex-row items-start">
    <!-- Calendar -->
    <div class="w-full bg-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center hover:bg-secondary">
      <a href="/calendar">Calendar</a>
      <div class="w-full p-1 bg-third mt-2">Upcoming events</div>
      <div class="flex w-full justify-around">
        <button class="w-full p-1" :class="{'bg-third': previewCalToday}" @click="toggleTodayCalPreview">Today</button>
        <button class="w-full p-1" :class="{'bg-third': previewCalWeek}" @click="toggleWeekCalPreview">Week</button>
      </div>
      <div class="mt-2 flex flex-col">
        <div v-for="event in calendarPreviewEvents" class="bg-third text-white p-2 rounded-md shadow-md w-full truncate mt-2">
          {{ event.title }} (<span v-show="previewCalWeek || new Date(event.startDate).getDay() < new Date().getDay()">{{ new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short' }) }}&nbsp;</span>{{ new Date(event.startDate).getHours().toString().padStart(2, '0') }}.{{ new Date(event.startDate).getMinutes().toString().padStart(2, '0') }} - <span v-show="previewCalWeek || new Date(event.endDate).getDay() > new Date().getDay()">{{ new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'short' }) }}</span> {{ new Date(event.endDate).getHours().toString().padStart(2, '0') }}.{{ new Date(event.endDate).getMinutes().toString().padStart(2, '0') }})
        </div>
      </div>
    </div>
    <!-- Projects -->
    <div class="w-full bg-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center hover:bg-secondary">
      <a href="/projects.html">Projects</a>
      <div class="w-full p-1 bg-third mt-2">Expiring activities</div>
      <div class="flex w-full justify-around">
        <button class="w-full p-1" :class="{'bg-third': previewProjectsToday}" @click="toggleTodayProjectsPreview">Today</button>
        <button class="w-full p-1" :class="{'bg-third': previewProjectsWeek}" @click="toggleWeekProjectsPreview">Week</button>
      </div>
      <div class="mt-2 flex flex-col">
        <div v-for="activity in projectsPreviewActivities" class="bg-third text-white p-2 rounded-md shadow-md w-full truncate mt-2">
          {{ activity.title }} (deadline <span v-show="previewProjectsWeek">{{ new Date(activity.deadline).toLocaleDateString('en-US', { weekday: 'short' }) }}</span> {{ new Date(activity.deadline).getHours().toString().padStart(2, '0') }}.{{ new Date(activity.deadline).getMinutes().toString().padStart(2, '0') }} {{ activity.projectName }})
        </div>
      </div>
    </div>
    <!-- Pomodoro -->
    <div class="w-full bg-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center hover:bg-secondary">
      <a href="/pomodoro">Pomodoro</a>
      <div class="w-full p-1 bg-third mt-2">Last settings</div>
      <div class="mt-2 flex" v-if="workTime && relaxTime && numCycle">
        <div class="bg-third text-white p-2 rounded-md shadow-md w-full truncate mt-2">
          Study: {{ workTime/60 }} minutes <br>
          Relax: {{ relaxTime/60 }} minutes <br>
          Cycle: {{ numCycle }}
        </div>
      </div>
    </div>
    <!-- Notes -->
    <div class="w-full bg-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center hover:bg-secondary">
      <a href="/notes">Notes</a>
      <div class="w-full p-1 bg-third mt-2">Last modified</div>
      <div class="flex w-full justify-around">
        <button class="w-full p-1" :class="{'bg-third': previewNote}" @click="toggleNotePreview">Note</button>
        <button class="w-full p-1" :class="{'bg-third': previewTask}" @click="toggleTaskPreview">Task</button>
      </div>
      <div class="mt-2 flex">
        <div v-show="previewNote" class="bg-third text-white p-2 rounded-md shadow-md w-full truncate mt-2">
          {{ lastNote.title? lastNote.title : 'No notes found' }} <br>
        </div>
        <div v-show="previewTask" class="bg-third text-white p-2 rounded-md shadow-md w-full truncate mt-2">
          {{ lastTask.title? lastTask.title : 'No tasks found' }} <br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {onMounted, onUnmounted, ref} from "vue";
import eventBus from "../../script/eventBus";
import { getTodayEvents, getWeekEvents, getTodayActivities, getWeekActivities, getEvents} from "@/apis/calendar";
import { getProjectDetails } from "@/apis/projects";
import { getNoteUser, getUserSelectNote } from "@/apis/note";
import { getSettingsPomUser } from "@/apis/pomodoro";
import { getAllEventsInstances } from "@/components/Calendar/repeated-events";

export default {
  setup(){
    const store = useStore()

    const previewCalToday = ref(true)
    const previewCalWeek = ref(false)

    const calendarPreviewEvents = ref([])

    const toggleTodayCalPreview = async () => {
      previewCalToday.value = true
      previewCalWeek.value = false
      // show today's calendar
      const eventsFromDB = await getEvents(store.state._id)
      const allEventsInstances = getAllEventsInstances(eventsFromDB)  // get all instances, including those of repeating events
      const startDate = new Date(new Date().setHours(0,0,0,0));
      const endDate = new Date(new Date().setHours(23, 59, 59, 999));
      // filter all events instances getting only those that concern the selected day
      const todaysEvents = allEventsInstances.filter(e => {
          const eventEndDate = new Date(e.endDate)
          const eventStartDate = new Date(e.startDate)
          return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
          || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
          || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
      })
      calendarPreviewEvents.value = todaysEvents.filter(e => new Date(e.endDate).getTime() > new Date().getTime())
      previewCalWeek.value = false
    }

    function getWeekRange() {
      const today = new Date();

      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day; // difference to previous Monday

      const startDate = new Date(today);
      startDate.setDate(today.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    }

    const toggleWeekCalPreview = async () => {
      previewCalToday.value = false
      previewCalWeek.value = true
      // show week's calendar
      const eventsFromDB = await getEvents(store.state._id)
      const allEventsInstances = getAllEventsInstances(eventsFromDB)  // get all instances, including those of repeating events
      const { startDate, endDate } = getWeekRange();
      const weekEvents = allEventsInstances.filter(e => {
          const eventEndDate = new Date(e.endDate)
          const eventStartDate = new Date(e.startDate)
          return (eventEndDate.getTime() >= startDate.getTime() && eventEndDate.getTime() <= endDate.getTime()) 
          || (eventStartDate.getTime() >= startDate.getTime() && eventStartDate.getTime() <= endDate.getTime())
          || (eventStartDate.getTime() <= startDate.getTime() && eventEndDate.getTime() >= endDate.getTime())
      })
      calendarPreviewEvents.value = weekEvents.filter(e => new Date(e.endDate).getTime() > new Date().getTime())
      previewCalWeek.value = true
    }

    const previewProjectsToday = ref(true)
    const previewProjectsWeek = ref(false)

    const projectsPreviewActivities = ref([])

    const toggleTodayProjectsPreview = async () => {
      previewProjectsToday.value = true
      previewProjectsWeek.value = false
      // show activities ending today
      const todaysActivities = await getTodayActivities(store.state._id)
      const activitiesWithProjectNames = await Promise.all(todaysActivities.filter(e => new Date(e.deadline).getTime() > new Date().getTime()).filter(e => e.projectData).map(async activity => {
        const projectDetails = await getProjectDetails(activity.projectData.projectId);
        return { ...activity, projectName: projectDetails.name };
      }));
      projectsPreviewActivities.value = activitiesWithProjectNames;
      previewProjectsToday.value = true;
    }

    const toggleWeekProjectsPreview = async () => {
      previewProjectsToday.value = false
      previewProjectsWeek.value = true
      // show activities ending this week
      const weekActivities = await getWeekActivities(store.state._id)
      const activitiesWithProjectNames = await Promise.all(weekActivities.filter(e => new Date(e.deadline).getTime() > new Date().getTime()).filter(e => e.projectData).map(async activity => {
        const projectDetails = await getProjectDetails(activity.projectData.projectId);
        return { ...activity, projectName: projectDetails.name };
      }));
      projectsPreviewActivities.value = activitiesWithProjectNames;
      previewProjectsWeek.value = true;
    }

    ///////////////////////////////////////////////////////////
    const previewNote = ref(true)
    const previewTask = ref(false)
    const noteTask = ref()
    const notes = ref()
    const tasks = ref()
    const publicNotes = ref()
    const selectNotes = ref()
    const username = store.state.username
    const lastNote = ref([])
    const lastTask = ref([])

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

    const toggleNotePreview = async () => {
      previewNote.value = true
      previewTask.value = false
    
      const fetchNotes = await getNoteUser(username, 'privateAccess');
      noteTask.value = fetchNotes;
                
      const fetchNotesPublicNotes = await getNoteUser('', 'publicAccess');
      publicNotes.value = fetchNotesPublicNotes;
                
      const fetchNotesSelectNotes = await getUserSelectNote(username, 'selectAccess');
      selectNotes.value = fetchNotesSelectNotes;
                
      noteTask.value = [...fetchNotes, ...fetchNotesPublicNotes, ...fetchNotesSelectNotes];

      notes.value = noteTask.value.filter(note => note.type === "Note")
      if (notes.value.length > 0) {
        notes.value.sort((a, b) => new Date(formatDate(b.updatedAt)) - new Date(formatDate(a.updatedAt)))
        lastNote.value.title = notes.value[0].title
        lastNote.value.body = notes.value[0].bodyNote
      }
    }

    const toggleTaskPreview = async () => {
      previewNote.value = false
      previewTask.value = true
      
      const fetchNotes = await getNoteUser(username, 'privateAccess');
      noteTask.value = fetchNotes;
                
      const fetchNotesPublicNotes = await getNoteUser('', 'publicAccess');
      publicNotes.value = fetchNotesPublicNotes;
                
      const fetchNotesSelectNotes = await getUserSelectNote(username, 'selectAccess');
      selectNotes.value = fetchNotesSelectNotes;
                
      noteTask.value = [...fetchNotes, ...fetchNotesPublicNotes, ...fetchNotesSelectNotes];

      tasks.value = noteTask.value.filter(task => task.type === "Task")
      if (tasks.value.length > 0) {
        tasks.value.sort((a, b) => new Date(formatDate(b.updatedAt)) - new Date(formatDate(a.updatedAt)))
        lastTask.value.title = tasks.value[0].title
        lastTask.value.body = tasks.value[0].bodyTask 
      }
    }

    ///////////////////////////////////////////////////////
    const settingsPom = ref()
    const workTime = ref()
    const relaxTime = ref()
    const numCycle = ref()
    const togglePomPreview = async () => {
      settingsPom.value = await getSettingsPomUser(username)
      if (settingsPom.value.length > 0) {
        settingsPom.value.sort((a, b) => new Date(formatDate(b.updatedAt)) - new Date(formatDate(a.updatedAt)))
        workTime.value = settingsPom.value[0].workTime
        relaxTime.value = settingsPom.value[0].relaxTime
        numCycle.value = settingsPom.value[0].cycleNum
      }
    }

    const reloadPageInfo = () => {
      toggleTodayCalPreview()
      toggleTodayProjectsPreview()
      toggleNotePreview()
      togglePomPreview()
    }


    onMounted(() => {
      reloadPageInfo();
      eventBus.on('reloadPageInfo', reloadPageInfo);
    })

    onUnmounted(() => {
      eventBus.off('reloadPageInfo', reloadPageInfo);
    });

    return {
      previewCalToday,
      previewCalWeek,
      toggleTodayCalPreview,
      toggleWeekCalPreview,
      calendarPreviewEvents,
      toggleTodayProjectsPreview,
      toggleWeekProjectsPreview,
      previewProjectsToday,
      previewProjectsWeek,
      projectsPreviewActivities,
      previewNote,
      previewTask,
      toggleNotePreview,
      toggleTaskPreview,
      username,
      noteTask,
      notes,
      tasks,
      publicNotes,
      selectNotes,
      formatDate,
      lastNote,
      lastTask,
      settingsPom,
      togglePomPreview,
      workTime,
      relaxTime,
      numCycle
    }
  }
}
</script>

<style>

</style>