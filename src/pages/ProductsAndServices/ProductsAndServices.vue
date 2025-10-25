<template>
  <div class="p-3">
    <Forms title="Produtos e Serviços" description="Cadastre e gerencie seus produtos e serviços aqui." icon="fas fa-box" >
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Informações básicas
        </p>
      </div>
      <div class="flex flex-row gap-5">
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Código:</p>
          <FwbInput type="text" placeholder="Digite o código do produto ou serviço" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
          <FwbInput type="text" placeholder="Digite o nome do produto ou serviço" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Valor:</p>
          <FwbInput type="text" placeholder="Digite o telefone do cliente" v-maska="'(##) #####-####'">
            <template #prefix>
              <span class="text-gray-500 dark:text-gray-400">R$</span>
            </template>
          </FwbInput>
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
        :columns="['Código', 'Nome', 'Descrição', 'Valor', 'Ações']"
        hasSearch
        class="w-full p-5 mt-4">
      <fwb-table-row v-if="products.length === 0">
        <td colspan="5" class="text-center py-4">
          Nenhum dado encontrado.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(product, index) in products" :key="product.id">
        <TableColumn isText :value="product.code" />
        <TableColumn isText :value="product.name" />
        <TableColumn isText :value="product.description" />
        <TableColumn isText :value="product.amount" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="onEdit(product)" v-on:line:delete="onEdit(product)" />
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

const products = ref([])

const onEdit = (msg) => {
  alert(`Edit event triggered! Message: ${msg}`)
}
</script>