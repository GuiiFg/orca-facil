<template>
  <div class="bg-white dark:bg-gray-900">
    <transition name="sidebar" appear>
      <FwbSidebar v-show="sideBarActions.sidebarOpen" class="w-64 h-screen bg-white border-r sidebar side-bar-entry-header">
        <SidebarItem label="Início" icon="fas fa-house" :click="handleGoToHome" />
        <SidebarItem label="Orçamentos" icon="fas fa-file-invoice-dollar" :click="handleGoToHome" />
        <SidebarItem label="Clientes" icon="fas fa-user" :click="handleGoToCustomer" />
        <!-- <SidebarDropItem label="Relacionamentos" icon="fas fa-users">
          <SidebarItem label="Clientes" :click="handleGoToCustomer" className="pl-10"/>
        </SidebarDropItem> -->
        <SidebarItem label="Produtos e Serviços" icon="fas fa-box" :click="handleGoToProductsAndServices" />
        <SidebarItem label="Meios de Pagamento" icon="fas fa-credit-card" :click="handleGoToPayments" />
        <SidebarItem label="Configurações" icon="fas fa-cog" :click="handleGoToHome" />
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
  z-index: 10; /* reduzido para ficar abaixo do header (header z-index: 50) */
}

.side-bar-entry-header {
  padding-top: 70px;
}
</style>