<template>
  <div class="bg-white dark:bg-gray-900 flex justify-between items-center" style="position: relative; z-index: 50; padding: 20px; max-height: 72px;">
    <div>
      <FwbHeading tag="h4">
        <FontAwesomeIcon v-if="sideBarActions.sidebarOpen" style="cursor: pointer;" icon="fas fa-times" @click="sideBarActions.toggle()"></FontAwesomeIcon>
        <FontAwesomeIcon v-else style="cursor: pointer;" icon="fas fa-bars" @click="sideBarActions.toggle()"></FontAwesomeIcon>
        <span class="ml-5 select-none">Orça Fácil</span>
      </FwbHeading>
    </div>
    <div class="hidden md:flex space-x-8 font-normal text-gray-700 dark:text-gray-400 font-semibold">
      <router-link :to="{ name: 'home' }">
        Início
      </router-link>
      <router-link :to="{ name: 'about' }">
        Sobre nós
      </router-link>
      <router-link :to="{ name: 'contact' }">
        Contato
      </router-link>
      <!-- <FwbNavbarLink>
        <router-link :to="{ name: 'home' }">
          Início
        </router-link>
      </FwbNavbarLink>
      <FwbNavbarLink>
        <router-link :to="{ name: 'about' }">
          Sobre nós
        </router-link>
      </FwbNavbarLink> -->
    </div>
    <!-- <div>
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
    </FwbNavbarCollapse> -->
  </div>
</template>

<script setup>
import { FwbNavbar, FwbNavbarCollapse, FwbNavbarLink, FwbHeading } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { sideBarActions } from '../../../stores/ui/siderBar.js'
import { RouterLink } from 'vue-router'
</script>
