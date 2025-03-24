<template>
<!--TODO: add bg-light and check if min-h-screen is needed (were previously contained in body) -->
  <div class="min-h-screen bg-primary">
    <nav v-if="store.state.isLoggedIn"  class="bg-secondary w-full z-50 relative">
      <div class="container mx-auto flex justify-between items-center p-4">
        <!-- App name (TODO: find a logo and add it) -->
        <router-link :to="{ name: 'home'}" class="text-white text-2xl font-bold">Selfie</router-link>
        
        <!-- Hamburger Menu (for mobile) -->
        <div class="block lg:hidden">
          <button class="text-white focus:outline-none" @click="toggleHamburgerMenu">
            <svg class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"></path>
            </svg>
          </button>
        </div>
        
        <!-- Menu Links TODO: update remaining 'a' elements -->
        <div  class="hidden lg:flex space-x-6">
          <router-link v-show="store.state.isAdmin" class="text-white " :to="{ name: 'admin'}">Admin</router-link>
          <router-link class="text-white " :to="{ name: 'calendar'}">Calendar</router-link>
          <router-link class="text-white " :to="{ name: 'notifications'}">Notifications Centre</router-link>
          <router-link class="text-white " :to="{ name: 'chat'}">Chat</router-link>
          <a class="text-white " href="/projects.html">Projects</a>
          <router-link class="text-white " :to="{ name: 'pomodoro'}">Pomodoro</router-link>
          <router-link class="text-white " :to="{ name: 'notes'}">Notes</router-link>
          <router-link class="text-white " :to="{ name: 'settings'}">Settings</router-link>
          <button @click="triggerModal" class="text-green-900 bg-green-300 border-4 border-green-900 rounded-full pl-2 pr-2 font-bold">Time Machine</button>
        </div>
      </div>

      <!-- Responsive drop down Menu (for mobile) -->
      <div class="lg:hidden border-t border-black w-full" v-show="hamburgerMenuOpened">
        <ul class="pl-4 py-1 bg-secondary">
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" v-show="store.state.isAdmin" class="text-white " :to="{ name: 'admin'}">Admin</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white " :to="{ name: 'calendar'}">Calendar</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white " :to="{ name: 'notifications'}">Notifications Centre</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white " :to="{ name: 'chat'}">Chat</router-link></li>
          <li class="mb-2"><a class="text-white " href="/projects.html">Projects</a></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white " :to="{ name: 'pomodoro'}">Pomodoro</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white " :to="{ name: 'notes'}">Notes</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white " :to="{ name: 'settings'}">Settings</router-link></li>
          <li @click="triggerModal" class="text-green-900 bg-green-300 border-4 border-green-900 rounded-full pl-2 pr-2 font-bold">Time Machine</li>
        </ul>
      </div>
    </nav>

    <router-view/>

    <Modal v-if="showModal" @close="triggerModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

        <h1 class="text-xl font-semibold text-gray-800">Current Date</h1>
        <h1 class="text-lg text-gray-600 mt-1">{{ formatDate(currentDate) }}</h1>

        <div class="mt-4">
          <DatePicker
              class="mt-2 w-full border border-gray-300 rounded-lg p-2"
              v-model="dateSelector"
              :format="formatDate"
              minutes-increment="1">
          </DatePicker>
        </div>

        <div class="mt-6 flex justify-between gap-4">
          <button
              @click="setNewDate(dateSelector)"
              class="w-full bg-green-600 text-green-900 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
            Set new date
          </button>

          <button
              @click="rollBackDate"
              class="w-full bg-gray-300 text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-400 transition">
            Reset real date
          </button>
        </div>
    </Modal>


  </div>
</template>

<script>
import {ref} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import Modal from "@/components/Modal.vue";
import DatePicker from "@vuepic/vue-datepicker";
import {getServerTime, rollBackTime, setNewGlobalTime} from "@/apis/time";
import {rollBackClientTime, setClientGlobalTime} from "../script/timeMachine";
import eventBus from "../script/eventBus";

export default {
  components: {DatePicker, Modal},
  setup() {
    // hamburger menu
    const hamburgerMenuOpened = ref(false)
    const toggleHamburgerMenu = () => {
      hamburgerMenuOpened.value = !hamburgerMenuOpened.value
    }
    const store = useStore()
    const router = useRouter();
    let stateString = sessionStorage.getItem('state')
    if (stateString) {
      store.replaceState(JSON.parse(stateString))
    }

    if (!store.state.isLoggedIn) {
      router.push("/login")
    }else{
      store.commit('connect')
    }

    const checkTime = async () => {
      const serverTime = new Date(await getServerTime())
      if (Math.abs(serverTime - new Date()) > 30000) {
        setClientGlobalTime(serverTime)
      }
    }

    checkTime()

    const formatDate = (date) => {
      if (!date) return '';
      return date.toLocaleString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }

    const currentDate = ref(new Date())
    setInterval(async () => {
      currentDate.value = new Date()
    }, 1000)

    const setNewDate = (date) => {
      setNewGlobalTime(date)
      setClientGlobalTime(new Date(date))
      eventBus.emit('reloadPageInfo');
    }

    const rollBackDate = () => {
      rollBackTime()
      rollBackClientTime()
      eventBus.emit('reloadPageInfo');
    }

    const dateSelector = ref(new Date())

    const showModal = ref(false)
    const triggerModal = () => {
      showModal.value = !showModal.value
    }

    return {
      hamburgerMenuOpened,
      toggleHamburgerMenu,
      store,
      formatDate,
      currentDate,
      dateSelector,
      setNewDate,
      rollBackDate,
      showModal,
      triggerModal
    }
  }
}
</script>

<style></style>
