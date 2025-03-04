<template>
<!--TODO: add bg-light and check if min-h-screen is needed (were previously contained in body) -->
  <div class="min-h-screen bg-primary">
    <nav v-if="store.state.isLoggedIn"  class="bg-secondary w-full z-50 relative">
      <div class="container mx-auto flex justify-between items-center p-4">
        <!-- App name (TODO: find a logo and add it) -->
        <a href="/"  class="text-white text-2xl font-bold">Selfie</a>
        
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
          <router-link class="text-white hover:text-accent" :to="{ name: 'notifications'}">Notifications Centre</router-link>
          <router-link class="text-white hover:text-accent" :to="{ name: 'chat'}">Chat</router-link>
          <a class="text-white hover:text-accent" href="/projects.html">Projects</a>
          <router-link class="text-white hover:text-accent" :to="{ name: 'pomodoro'}">Pomodoro</router-link>
          <router-link class="text-white hover:text-accent" :to="{ name: 'notes'}">Notes</router-link>
          <router-link class="text-white hover:text-accent" :to="{ name: 'settings'}">Settings</router-link>
        </div>
      </div>

      <!-- Responsive drop down Menu (for mobile) -->
      <div class="lg:hidden border-t border-black w-full" v-show="hamburgerMenuOpened">
        <ul class="pl-4 py-1 bg-secondary">
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" v-show="store.state.isAdmin"class="text-white hover:text-accent" :to="{ name: 'admin'}">Admin</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white hover:text-accent" :to="{ name: 'calendar'}">Calendar</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white hover:text-accent" :to="{ name: 'notifications'}">Notifications Centre</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white hover:text-accent" :to="{ name: 'chat'}">Chat</router-link></li>
          <li class="mb-2"><a class="text-white hover:text-accent" href="/projects.html">Projects</a></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white hover:text-accent" :to="{ name: 'pomodoro'}">Pomodoro</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white hover:text-accent" :to="{ name: 'notes'}">Notes</router-link></li>
          <li class="mb-2"><router-link @click="toggleHamburgerMenu" class="text-white hover:text-accent" :to="{ name: 'settings'}">Settings</router-link></li>
        </ul>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
import {ref} from 'vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
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

    return {
      hamburgerMenuOpened,
      toggleHamburgerMenu,
      store
    }
  }
}
</script>

<style></style>
