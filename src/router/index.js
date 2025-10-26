import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from '../pages/Home/HomeView.vue'
import AboutView from '../pages/About/AboutView.vue'
import Contact from '../pages/Contact/Contact.vue'
import CustomerView from '../pages/Customer/Customer.vue'
import ProductsAndServices from '../pages/ProductsAndServices/ProductsAndServices.vue'
import Payments from '../pages/Payments/Payments.vue'
import Budget from '../pages/Budget/Budget.vue'

const routes = [
  { path: '/', component: HomeView, name: 'home' },
  { path: '/about', component: AboutView, name: 'about' },
  { path: '/contact', component: Contact, name: 'contact' },
  { path: '/customer', component: CustomerView, name: 'customer' },
  { path: '/products', component: ProductsAndServices, name: 'products' },
  { path: '/payments', component: Payments, name: 'payments' },
  { path: '/budget', component: Budget, name: 'budget' }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})