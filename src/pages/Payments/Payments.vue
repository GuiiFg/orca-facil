<template>
  <div class="p-3">
    <Forms title="Meios de Pagamento" description="Cadastre e gerencie seus meios de pagamento." icon="fas fa-credit-card" >
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Informações básicas
        </p>
      </div>
      <div class="flex flex-row gap-5">
        <div class="md:w-1/3">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
          <FwbInput type="text" placeholder="Digite o nome do meio de pagamento" />
        </div>
      </div>
      <div class="flex flex-row gap-5 mt-4">
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Descrição:</p>
          <FwbTextarea placeholder="Digite a descrição do produto ou serviço" />
        </div>
      </div>
    </Forms>
    <Tables
        :columns="['Nome', 'Descrição', 'Ações']"
        hasSearch
        class="w-full p-5 mt-4">
      <fwb-table-row v-if="payments.length === 0">
        <td colspan="5" class="text-center py-4">
          Nenhum dado encontrado.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(payment, index) in payments" :key="payment.id">
        <TableColumn isText :value="payment.name" />
        <TableColumn isText :value="payment.description" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="onEdit(payment)" v-on:line:delete="onEdit(payment)" />
      </fwb-table-row>
    </Tables>
  </div>
</template>

<script setup>
import {FwbCard, FwbHeading, FwbInput, FwbTableRow, FwbTextarea} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'

import { ref } from 'vue'

const payments = ref([])

const onEdit = (msg) => {
  alert(`Edit event triggered! Message: ${msg}`)
}
</script>