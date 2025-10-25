<template>
  <FwbHeading v-if="hasHeader" tag="h4"><FontAwesomeIcon :icon="props.icon" /> {{ props.title }}</FwbHeading>
  <div v-if="hasHeader">
    <p class="font-normal text-gray-700 dark:text-gray-400">
      {{ props.description }}
    </p>
  </div>
  <fwb-card class="w-full p-5 mt-4">
    <slot />
    <div class="flex justify-between mt-4">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" @click="handleEmit('form:save')">
        <FontAwesomeIcon icon="fas fa-save" /> Salvar
      </button>
      <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer" @click="handleEmit('form:clear')">
        <FontAwesomeIcon icon="fas fa-eraser" /> Limpar
      </button>
    </div>
  </fwb-card>
</template>

<script setup>
import { FwbCard, FwbHeading } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['form:save', 'form:clear']);

const handleEmit = (eventName) => {
  emit(eventName);
}

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Formulário'
  },
  description: {
    type: String,
    required: false,
    default: 'Preencha o formulário abaixo'
  },
  icon: {
    type: String,
    required: false,
    default: 'fas fa-file-alt'
  },
  hasHeader: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>