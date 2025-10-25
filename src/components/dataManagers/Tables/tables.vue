<template>
  <FwbCard>
    <div class="flex flex-row gap-5">
      <div class="grow" v-if="props.hasSearch">
        <fwb-input type="text" placeholder="Pesquisar..." class="mb-4" v-model="searchQuery">
          <template #prefix>
            <FontAwesomeIcon icon="fas fa-search" />
          </template>
        </fwb-input>
      </div>
      <div class="flex-none" v-if="props.hasReload">
        <fwb-button type="button" @click="handleReload" class="mb-4 cursor-pointer">
          <FontAwesomeIcon icon="fas fa-sync" />
          Recarregar
        </fwb-button>
      </div>
      <div class="flex-none" v-if="props.hasNew">
        <fwb-button type="button" color="green" @click="handleNewClick" class="mb-4 cursor-pointer">
          <FontAwesomeIcon icon="fas fa-plus" />
          Novo
        </fwb-button>
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
    <div class="flex justify-start mt-4">
      <p class="font-normal text-gray-700 dark:text-gray-400">Total: {{ props.total }}</p>
    </div>
    <div class="flex justify-center mt-4">
      <FwbPagination
        v-model="currentPage"
        :total-pages="totalPages"
      />
    </div>
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
  FwbPagination,
  FwbButton
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref, watch } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  hasSearch: {
    type: Boolean,
    required: false,
    default: false
  },
  hasNew: {
    type: Boolean,
    required: false,
    default: false
  },
  page: {
    type: Number,
    required: false,
    default: 1
  },
  totalPages: {
    type: Number,
    required: false,
    default: 1
  },
  hasReload: {
    type: Boolean,
    required: false,
    default: false
  },
  total: {
    type: Number,
    required: false,
    default: 0
  }
})

const currentPage = ref(props.page)
const totalPages = ref(props.totalPages)
const searchQuery = ref('')

const emit = defineEmits(['update:page', 'search', 'new', 'reload']);

const handleNewClick = () => {
  emit('new')
}

const handleReload = () => {
  emit('reload')
}

watch(() => currentPage.value, (newPage) => {
  emit('update:page', newPage)
})
watch(() => props.totalPages, (newTotalPages) => {
  totalPages.value = newTotalPages
})
watch(() => searchQuery.value, (newQuery) => {
  emit('search', newQuery)
})
</script>
