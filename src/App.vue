<template>
<!--TODO: add bg-light and check if min-h-screen is needed (were previously contained in body) -->
  <div class="min-h-screen bg-primary">
    <nav class="bg-secondary w-full p-4">
      <div class="container mx-auto flex justify-between items-center">
        <!-- App name (TODO: find a logo and add it) -->
        <a href="#" class="text-white text-2xl font-bold">Selfie</a>
        
        <!-- Hamburger Menu (for mobile) -->
        <div class="block lg:hidden">
          <button class="text-white focus:outline-none" @click="toggleHamburgerMenu">
            <svg class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"></path>
            </svg>
          </button>
        </div>
        
        <!-- Menu Links TODO: update remaining 'a' elements -->
        <div class="hidden lg:flex space-x-6">
          <router-link class="text-white hover:text-accent" :to="{ name: 'calendar'}">Calendar</router-link>
          <a href="#" class="text-white hover:text-accent">Centro Notifiche</a>
          <a href="#" class="text-white hover:text-accent">Chat</a>
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
import { ref } from 'vue'

export default {
  setup() {
    // hamburger menu
    const hamburgerMenuOpened = ref(false)
    const toggleHamburgerMenu = () => {
      hamburgerMenuOpened.value = !hamburgerMenuOpened.value
    }

    return {
      hamburgerMenuOpened,
      toggleHamburgerMenu
    }
  }
}
</script>

<!--add styles defined in tailwind config and remove these ones-->
<style>
  .bg-main { background-color: #383f51; }
  .bg-light { background-color: #dddbf1; }
  .text-main { color: #383f51; }
  .text-secondary { color: #3c4f76; }
  .border-main { border-color: #383f51; }
  .border-secondary { border-color: #3c4f76; }
  .bg-accent { background-color: #d1beb0; }
  .text-accent { color: #ab9f9d; }
</style>
