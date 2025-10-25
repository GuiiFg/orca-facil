<template>
  <FwbCard>
    <div v-if="props.hasSearch" class="flex flex-row gap-5">
      <div class="grow">
        <fwb-input type="text" placeholder="Pesquisar..." class="mb-4" >
          <template #prefix>
            <FontAwesomeIcon icon="fas fa-search" />
          </template>
        </fwb-input>
      </div>
    </div>
    <fwb-table hoverable>
      <fwb-table-head>
        <fwb-table-head-cell v-for="( column, index ) in props.columns" :key="index">
          {{ column }}
        </fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body>
        <slot />
      </fwb-table-body>
    </fwb-table>
  </FwbCard>
</template>

<script setup>
import {
  FwbTable,
  FwbTableBody,
  FwbTableHead,
  FwbTableHeadCell,
  FwbCard,
  FwbInput,
  FwbButton
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  hasSearch: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>
