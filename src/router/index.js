import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView'
import NotesView from '@/views/NotesView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/notes',
    name: 'notes',
    component: NotesView
  }
  /* rimuovi poi questo sotto
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
  }

  */
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
