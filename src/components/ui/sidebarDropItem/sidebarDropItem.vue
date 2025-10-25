<template>
  <FwbSidebarDropdownItem style="cursor: pointer;">
    <template v-if="props.icon" #icon>
      <FontAwesomeIcon :icon="props.icon" />
    </template>
    <template #trigger>{{ props.label }}</template>
    <template #default>
      <slot />
    </template>
  </FwbSidebarDropdownItem>
</template>

<script setup>
import { FwbSidebarItem,FwbSidebarDropdownItem } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  }
})
</script>
