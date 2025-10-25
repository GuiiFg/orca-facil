<template>
  <FwbNavbar class="bg-white border-b border-gray-200">
    <div><FwbHeading tag="h4"><FontAwesomeIcon style="cursor: pointer;" icon="fas fa-bars" @click="sideBarActions.toggle()"></FontAwesomeIcon> Orça Fácil</FwbHeading></div>
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
