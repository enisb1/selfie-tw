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
          {{ event.title }} (<span v-show="previewCalWeek">{{ new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short' }) }}&nbsp;</span>{{ new Date(event.startDate).getHours() }}.{{ new Date(event.startDate).getMinutes() }} - <span v-show="previewCalWeek">{{ new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short' }) }}</span> {{ new Date(event.endDate).getHours() }}.{{ new Date(event.endDate).getMinutes() }})
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
          {{ activity.title }} (deadline <span v-show="previewProjectsWeek">{{ new Date(activity.deadline).toLocaleDateString('en-US', { weekday: 'short' }) }}</span> {{ new Date(activity.deadline).getHours() }}.{{ new Date(activity.deadline).getMinutes().toString().padStart(2, '0') }} {{ activity.projectName }})
        </div>
      </div>
    </div>
    <!-- Pomodoro -->
    <div class="w-full bg-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center hover:bg-secondary">
      Pomodoro
    </div>
    <!-- Notes -->
    <div class="w-full bg-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg text-center hover:bg-secondary">
      Notes
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import {useStore} from "vuex";
import {onMounted, ref} from "vue";
import { getTodayEvents, getWeekEvents, getTodayActivities, getWeekActivities } from "@/apis/calendar";
import { getProjectDetails } from "@/apis/projects";

export default {
  setup(){
    const store = useStore()
    

    return {

    }

    const previewCalToday = ref(true)
    const previewCalWeek = ref(false)

    const calendarPreviewEvents = ref([])

    const toggleTodayCalPreview = async () => {
      previewCalToday.value = true
      previewCalWeek.value = false
      // show today's calendar
      const todaysEvents = await getTodayEvents(store.state._id)
      calendarPreviewEvents.value = todaysEvents.filter(e => new Date(e.endDate).getTime() > new Date().getTime())
      previewCalWeek.value = false
    }

    const toggleWeekCalPreview = async () => {
      previewCalToday.value = false
      previewCalWeek.value = true
      // show week's calendar
      const weekEvents = await getWeekEvents(store.state._id)
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

    onMounted(() => {
      toggleTodayCalPreview()
      toggleTodayProjectsPreview()
    })

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
      projectsPreviewActivities
    }
  }
}
</script>

<style>

</style>