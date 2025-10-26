<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4">
        <FontAwesomeIcon icon="fas fa-file-invoice-dollar" /> Orçamento [NUM:BUDGET]
      </FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Detalhes do orçamento.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FwbHeading } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>