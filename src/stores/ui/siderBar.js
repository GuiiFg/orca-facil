import { reactive } from 'vue'

export const sideBarActions = reactive({
  sidebarOpen: false,
  open() { this.sidebarOpen = true },
  close() { this.sidebarOpen = false },
  toggle() { this.sidebarOpen = !this.sidebarOpen }
})
