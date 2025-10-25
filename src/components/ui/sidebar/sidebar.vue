<template>
  <div>
    <transition name="sidebar" appear>
      <FwbSidebar v-show="sideBarActions.sidebarOpen" class="w-64 h-screen bg-white border-r sidebar">
        <SidebarItem label="Fechar" icon="fas fa-times" :click="handleToggleSidebar"/>
        <SidebarItem label="Clientes" icon="fas fa-user" :click="handleGoToCustomer" />
      </FwbSidebar>
    </transition>
  </div>
</template>

<script setup>
import { FwbSidebar, FwbSidebarItem } from 'flowbite-vue'
import { sideBarActions } from '../../../stores/ui/siderBar.js'
import SidebarItem from '../sidebarItem/sidebarItem.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoToCustomer = () => {
  router.push({ name: 'customer' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleToggleSidebar = () => {
  sideBarActions.toggle()
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

/* opcional: garantir que a sidebar fique acima do conteúdo durante a animação */
.sidebar {
  z-index: 40;
}
</style>