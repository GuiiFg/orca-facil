<template>
  <div>
    <!-- Mobile backdrop -->
    <div v-if="sideBarActions.sidebarOpen" class="sidebar-backdrop" @click="sideBarActions.toggle()"></div>
    <transition name="sidebar" appear>
      <FwbSidebar v-show="sideBarActions.sidebarOpen" class="w-64 h-screen bg-white border-r sidebar side-bar-entry-header">
        <SidebarItem label="Início" icon="fas fa-house" :click="handleGoToHome" />
        <SidebarItem label="Orçamentos" icon="fas fa-file-invoice-dollar" :click="handleGoToBudget" />
        <SidebarItem label="Clientes" icon="fas fa-user" :click="handleGoToCustomer" />
        <SidebarItem label="Produtos e Serviços" icon="fas fa-box" :click="handleGoToProductsAndServices" />
        <SidebarItem label="Meios de Pagamento" icon="fas fa-credit-card" :click="handleGoToPayments" />
        <SidebarItem label="Configurações" icon="fas fa-cog" :click="handleGoToSettings" />
      </FwbSidebar>
    </transition>
  </div>
</template>

<script setup>
import { FwbSidebar } from 'flowbite-vue'
import { sideBarActions } from '../../../stores/ui/siderBar.js'
import SidebarItem from '../sidebarItem/sidebarItem.vue'
import SidebarDropItem from '../sidebarDropItem/sidebarDropItem.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoToCustomer = () => {
  router.push({ name: 'customer' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleGoToProductsAndServices = () => {
  router.push({ name: 'products' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleGoToPayments = () => {
  router.push({ name: 'payments' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleGoToHome = () => {
  router.push({ name: 'home' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleGoToBudget = () => {
  router.push({ name: 'budget' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleGoToSettings = () => {
  router.push({ name: 'settings' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}
</script>

<style scoped>
.body_content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

/* animação de slide da sidebar */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 240ms ease, opacity 240ms ease;
}
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.sidebar-enter-to,
.sidebar-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.sidebar {
  z-index: 10;
}

.side-bar-entry-header {
  padding-top: 70px;
}

/* Mobile backdrop - only visible on small screens */
.sidebar-backdrop {
  display: none;
}

@media (max-width: 767px) {
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 9;
  }

  .sidebar {
    position: fixed !important;
    z-index: 10;
  }
}
</style>