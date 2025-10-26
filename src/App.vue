<template>
  <div class="body_content" style="max-height: 100vh; overflow: hidden;">
    <Header />
    <Sidebar />
    <div class="view_port_content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import Header from './components/ui/header/header.vue'
  import Sidebar from './components/ui/sidebar/sidebar.vue'
</script>

<style scoped>
.view_port_content {
  max-height: calc(100vh - 72px);
  transition: margin-left 0.3s ease;
  overflow-y: auto;
}
</style>
