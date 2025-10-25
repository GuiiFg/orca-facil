import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../pages/Home/HomeView.vue'
import AboutView from '../pages/About/AboutView.vue'
import CustomerView from '../pages/Customer/Customer.vue'

const routes = [
  { path: '/', component: HomeView, name: 'home' },
  { path: '/about', component: AboutView, name: 'about' },
  { path: '/contact', component: AboutView, name: 'contact' },
  { path: '/customer', component: CustomerView, name: 'customer' },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})