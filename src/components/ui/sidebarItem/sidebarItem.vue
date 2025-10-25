<template>
  <FwbSidebarItem :link="props.link" @click="handleClick" :class="props.className" style="cursor: pointer;">
    <template v-if="props.icon" #icon>
      <FontAwesomeIcon :icon="props.icon" />
    </template>
    <template #default>{{ props.label }}</template>
  </FwbSidebarItem>
</template>

<script setup>
import { FwbSidebarItem } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  click: {
    type: Function,
    required: false
  },
  link: {
    type: String,
    required: false,
    default: '#'
  },
  icon: {
    type: String,
    required: false
  },
  className: {
    type: String,
    required: false
  }
})

const handleClick = () => {
  if (props.click) {
    props.click()
  }
}
</script>
