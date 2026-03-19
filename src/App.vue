<template>
  <div class="body_content safe-area-top">
    <Header />
    <Sidebar />
    <div class="view_port_content bg-gray-50 dark:bg-gray-800">
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
.body_content {
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

.view_port_content {
  flex: 1;
  min-height: 0;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
}
</style>
