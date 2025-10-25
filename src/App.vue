<template>
  <div class="body_content">
    <Header />
    <Sidebar />
    <RouterView />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import Header from './components/ui/header/header.vue'
  import Sidebar from './components/ui/sidebar/sidebar.vue'
</script>
