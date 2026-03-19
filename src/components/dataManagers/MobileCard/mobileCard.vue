<template>
  <div class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <!-- Header: title + actions -->
    <div class="flex justify-between items-start">
      <div class="min-w-0 flex-1">
        <p class="font-semibold text-gray-900 dark:text-white truncate">{{ props.title }}</p>
        <p v-if="props.subtitle" class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{{ props.subtitle }}</p>
      </div>
      <div class="flex gap-2 ml-2 flex-shrink-0" v-if="props.hasEdit || props.hasDelete">
        <button v-if="props.hasEdit" class="text-blue-500 hover:text-blue-600 transition p-1" @click="emit('edit')">
          <FontAwesomeIcon icon="fas fa-edit" />
        </button>
        <button v-if="props.hasDelete" class="text-red-500 hover:text-red-600 transition p-1" @click="emit('delete')">
          <FontAwesomeIcon icon="fas fa-trash" />
        </button>
      </div>
      <div class="ml-2 flex-shrink-0" v-if="$slots.badge">
        <slot name="badge" />
      </div>
    </div>
    <!-- Fields grid -->
    <div v-if="$slots.default" class="grid gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700" :class="gridClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: false,
    default: ''
  },
  hasEdit: {
    type: Boolean,
    required: false,
    default: false
  },
  hasDelete: {
    type: Boolean,
    required: false,
    default: false
  },
  cols: {
    type: Number,
    required: false,
    default: 3
  }
})

const emit = defineEmits(['edit', 'delete'])

const gridClass = computed(() => {
  switch (props.cols) {
    case 1: return 'grid-cols-1'
    case 2: return 'grid-cols-2'
    case 4: return 'grid-cols-4'
    default: return 'grid-cols-3'
  }
})
</script>
