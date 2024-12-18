<template>
<!--TODO: add bg-light and check if min-h-screen is needed (were previously contained in body) -->
  <div class="min-h-screen bg-primary">
    <nav v-if="store.state.isLoggedIn"  class="bg-secondary w-full p-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- App name (TODO: find a logo and add it) -->
        <a href="#"  class="text-white text-2xl font-bold">Selfie</a>
        
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
          <router-link v-show="store.state.isAdmin"class="text-white hover:text-accent" :to="{ name: 'admin'}">Admin</router-link>
          <router-link class="text-white hover:text-accent" :to="{ name: 'calendar'}">Calendar</router-link>
          <router-link class="text-white hover:text-accent" :to="{ name: 'notifications'}">Centro Notifiche </router-link>
          <router-link class="text-white hover:text-accent" :to="{ name: 'chat'}">Chat</router-link>
          <a href="#" class="text-white hover:text-accent">Progetti</a>
          <a href="#" class="text-white hover:text-accent">Pomodoro</a>
          <router-link class="text-white hover:text-accent" :to="{ name: 'notes'}">Note</router-link>
          <a href="#" class="text-white hover:text-accent">Impostazioni</a>
        </div>
      </div>

      <!-- Responsive drop down Menu (for mobile) -->
      <div class="lg:hidden" v-show="hamburgerMenuOpened">
        <ul class="p-4 bg-secondary">
          <li class="mb-2"><a href="#" class="text-white block">Calendario</a></li>
          <li class="mb-2"><a href="#" class="text-white block">Centro Notifiche</a></li>
          <li class="mb-2"><a href="#" class="text-white block">Chat</a></li>
          <li class="mb-2"><a href="#" class="text-white block">Progetti</a></li>
          <li class="mb-2"><a href="#" class="text-white block">Pomodoro</a></li>
          <li class="mb-2"><a href="#" class="text-white block">Note</a></li>
          <li><a href="#" class="text-white block">Impostazioni</a></li>
        </ul>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
import {computed, onMounted, ref, triggerRef} from 'vue'
import {useStore} from "vuex";
import router from "@/router";

export default {
  methods: {triggerRef},
  setup: function () {
    // hamburger menu
    const hamburgerMenuOpened = ref(false)
    const toggleHamburgerMenu = () => {
      hamburgerMenuOpened.value = !hamburgerMenuOpened.value
    }
    const store = useStore()
    let stateString = sessionStorage.getItem('state')
    if (stateString) {
      store.replaceState(JSON.parse(stateString))
    }

    if (!store.state.isLoggedIn) {
      router.push("/login")
    }

    return {
      hamburgerMenuOpened,
      toggleHamburgerMenu,
      store
    }
  }
}
</script>

<style></style>
