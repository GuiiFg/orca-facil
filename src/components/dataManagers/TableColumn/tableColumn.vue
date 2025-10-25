<template>
  <fwb-table-cell v-if="props.isText">{{ props.value }}</fwb-table-cell>
  <fwb-table-cell v-if="props.isMoney">{{ formatMoney(props.value) }}</fwb-table-cell>
  <fwb-table-cell v-if="props.isActions">
    <FontAwesomeIcon v-if="props.hasEdit" icon="fas fa-edit" class="ml-3 text-blue-400" style="cursor: pointer;" @click="handleEmit('line:edit')" />
    <FontAwesomeIcon v-if="props.hasDelete" icon="fas fa-trash" class="ml-3 text-red-400" style="cursor: pointer;" @click="handleEmit('line:delete')" />
  </fwb-table-cell>
</template>

<script setup>
import {
  FwbTableCell
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const emit = defineEmits(['custom-event']);

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
    type: String,
    required: false,
    default: ''
  }
})

const formatMoney = (value) => {
  if (!value) return ''
  const numberValue = parseFloat(value.replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
</script>
