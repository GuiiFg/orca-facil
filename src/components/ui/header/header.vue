<template>
  <FwbNavbar class="bg-white border-b border-gray-200" style="position: relative; z-index: 50;">
    <div>
      <FwbHeading tag="h4">
        <FontAwesomeIcon v-if="sideBarActions.sidebarOpen" style="cursor: pointer;" icon="fas fa-times" @click="sideBarActions.toggle()"></FontAwesomeIcon>
        <FontAwesomeIcon v-else style="cursor: pointer;" icon="fas fa-bars" @click="sideBarActions.toggle()"></FontAwesomeIcon>
        <span>Orça Fácil</span>
      </FwbHeading>
    </div>
    <FwbNavbarCollapse>
      <FwbNavbarLink>
        <router-link :to="{ name: 'home' }">
          Início
        </router-link>
      </FwbNavbarLink>
      <FwbNavbarLink>
        <router-link :to="{ name: 'about' }">
          Sobre nós
        </router-link>
      </FwbNavbarLink>
      <FwbNavbarLink>
        <router-link :to="{ name: 'contact' }">
          Contato
        </router-link>
      </FwbNavbarLink>
    </FwbNavbarCollapse>
  </FwbNavbar>
</template>

<script setup>
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLink, FwbHeading } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { sideBarActions } from '../../../stores/ui/siderBar.js'
import { RouterLink } from 'vue-router'
</script>
