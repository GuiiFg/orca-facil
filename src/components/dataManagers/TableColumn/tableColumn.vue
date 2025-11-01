<template>
  <fwb-table-cell v-if="props.isText">{{ props.value ? props.value : 'N/D' }}</fwb-table-cell>
  <fwb-table-cell v-if="props.isMoney">{{ formatMoney(props.value) }}</fwb-table-cell>
  <fwb-table-cell v-if="props.isPercent">{{ formatPercent(props.value) }}</fwb-table-cell>
  <fwb-table-cell v-if="props.isActions">
    <FontAwesomeIcon v-if="props.hasEdit" icon="fas fa-edit" class="ml-3 text-blue-400" style="cursor: pointer;" @click="handleEmit('line:edit')" />
    <FontAwesomeIcon v-if="props.hasDelete" icon="fas fa-trash" class="ml-3 text-red-400" style="cursor: pointer;" @click="handleEmit('line:delete')" />
  </fwb-table-cell>
  <fwb-table-cell v-if="props.isCustom">
    <slot></slot>
  </fwb-table-cell>
</template>

<script setup>
import {
  FwbTableCell
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['line:edit', 'line:delete']);

const handleEmit = (eventName) => {
  emit(eventName);
}

const props = defineProps({
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
  isActions: {
    type: Boolean,
    required: false,
    default: false
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
  value: {
    type: [String, Number],
    required: false,
    default: ''
  },
  isCustom: {
    type: Boolean,
    required: false,
    default: false
  }
})

const formatMoney = (value) => {
  if (value === null || value === undefined) value = '0'
  let stringValue = value.toString()
  const numberValue = parseFloat(stringValue.replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const formatPercent = (value) => {
  if (value === null || value === undefined) value = '0'
  let stringValue = value.toString()
  const dividedValue = parseFloat(stringValue.replace(/[^0-9.-]+/g,"")) / 100
  stringValue = dividedValue.toString()
  const numberValue = parseFloat(stringValue.replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 });
}
</script>
