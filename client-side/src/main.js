import { createApp } from 'vue'
import App from '@/App.vue'
import router from './router'
import "@/styles/output.css"
import { store } from './store/store.js'

createApp(App).use(router).use(store).mount('#app')