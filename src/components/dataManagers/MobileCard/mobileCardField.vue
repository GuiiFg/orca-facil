<template>
  <div>
    <p class="text-xs text-gray-400 dark:text-gray-500">{{ props.label }}</p>
    <p class="text-sm font-medium" :class="valueColorClass">
      <template v-if="props.isText">{{ props.value || 'N/D' }}</template>
      <template v-else-if="props.isMoney">{{ formatMoney(props.value) }}</template>
      <template v-else-if="props.isPercent">{{ formatPercent(props.value) }}</template>
      <template v-else-if="props.isCustom"><slot /></template>
      <template v-else>{{ props.value || 'N/D' }}</template>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: false,
    default: ''
  },
  isText: {
    type: Boolean,
    required: false,
    default: false
  },
  isMoney: {
    type: Boolean,
    required: false,
    default: false
  },
  isPercent: {
    type: Boolean,
    required: false,
    default: false
  },
  isCustom: {
    type: Boolean,
    required: false,
    default: false
  },
  color: {
    type: String,
    required: false,
    default: ''
  }
})

import { computed } from 'vue'

const valueColorClass = computed(() => {
  switch (props.color) {
    case 'blue': return 'text-blue-600 dark:text-blue-400'
    case 'green': return 'text-green-600 dark:text-green-400'
    case 'red': return 'text-red-500 dark:text-red-400'
    case 'yellow': return 'text-yellow-500 dark:text-yellow-400'
    case 'purple': return 'text-purple-600 dark:text-purple-400'
    case 'bold': return 'text-gray-900 dark:text-white font-bold'
    default: return 'text-gray-900 dark:text-white'
  }
})

const formatMoney = (value) => {
  if (value === null || value === undefined) value = '0'
  const numberValue = parseFloat(value.toString().replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatPercent = (value) => {
  if (value === null || value === undefined) value = '0'
  const dividedValue = parseFloat(value.toString().replace(/[^0-9.-]+/g,"")) / 100
  const numberValue = parseFloat(dividedValue.toString().replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 })
}
</script>
