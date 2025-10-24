import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../pages/Home/HomeView.vue'
import AboutView from '../pages/About/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})