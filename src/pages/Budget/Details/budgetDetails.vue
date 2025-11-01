<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4">
        <FontAwesomeIcon icon="fas fa-file-invoice-dollar" /> Orçamento <span v-if="budget">{{ budget.code }}</span>
      </FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Detalhes do orçamento.
        </p>
      </div>
    </div>
    <FwbAccordion flushed>
      <FwbAccordionPanel show>
        <FwbAccordionHeader>
          <div class="flex justify-start items-start">
            <div class="content-start">
              <FontAwesomeIcon icon="fas fa-chart-simple" /> Valores
            </div>
          </div>
        </FwbAccordionHeader>
        <FwbAccordionContent>
          <div>teste</div>
        </FwbAccordionContent>
      </FwbAccordionPanel>
      <FwbAccordionPanel>
        <FwbAccordionHeader>
          <div class="flex justify-start items-start">
            <div class="content-start">
              <FontAwesomeIcon icon="fas fa-user" /> Cliente
            </div>
          </div>
        </FwbAccordionHeader>
        <FwbAccordionContent>
          <div v-if="!customer">
            <FwbButton>Selecionar cliente</FwbButton>
          </div>
          <div v-else>
            <div class="flex flex-row gap-5">
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
                <FwbInput type="text" disabled v-model="customer.name" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Sobrenome:</p>
                <FwbInput type="text" disabled v-model="customer.surname" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Celular:</p>
                <FwbInput type="text" disabled v-model="customer.cellphone" />
              </div>
            </div>
            <div class="flex flex-row gap-5 mt-4">
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Email:</p>
                <FwbInput type="text" disabled v-model="customer.email" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Cpf/Cnpj:</p>
                <FwbInput type="text" disabled v-model="customer.document" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Telefone:</p>
                <FwbInput type="text" disabled v-model="customer.zipcode" />
              </div>
            </div>
            <div class="flex flex-row gap-5 mt-4">
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Cep:</p>
                <FwbInput type="text" disabled v-model="customer.state" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Estado:</p>
                <FwbInput type="text" disabled v-model="customer.document" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Município:</p>
                <FwbInput type="text" disabled v-model="customer.city" />
              </div>
            </div>
            <div class="flex flex-row gap-5 mt-4">
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Bairro:</p>
                <FwbInput type="text" disabled v-model="customer.district" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Rua:</p>
                <FwbInput type="text" disabled v-model="customer.street" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Número:</p>
                <FwbInput type="text" disabled v-model="customer.number" />
              </div>
            </div>
          </div>
        </FwbAccordionContent>
      </FwbAccordionPanel>
      <FwbAccordionPanel>
        <FwbAccordionHeader>
          <div class="flex justify-start items-start">
            <div class="content-start">
              <FontAwesomeIcon icon="fas fa-credit-card" /> Meio de Pagamento
            </div>
          </div>
        </FwbAccordionHeader>
        <FwbAccordionContent>
          <div v-if="!payment">
            <FwbButton>Selecionar meio de pagamento</FwbButton>
          </div>
          <div v-else>
            <div class="flex flex-row gap-5">
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
                <FwbInput type="text" disabled v-model="payment.name" />
              </div>
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Descrição:</p>
                <FwbInput type="text" disabled v-model="payment.description" />
              </div>
            </div>
          </div>
        </FwbAccordionContent>
      </FwbAccordionPanel>
    </FwbAccordion>
    <Tables
      class="w-full p-5 mt-4"
      hasSearch
      hasNew
      hasReload
      v-on:search="handleSearch"
      v-on:new="showBudgetItemModal = true"
      :columns="['Código', 'Nome', 'Quantidade', 'Desconto', 'Preço Unitário', 'Preço Total', 'Custo Unitário', 'Custo Total', 'Ações']">
      <fwb-table-row v-if="budgetItems.length === 0">
        <td colspan="8" class="text-center py-4">
          Nenhum produto ou serviço adicionado ao orçamento.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(item, index) in budgetItems" :key="item.id">
        <TableColumn isText :value="item.product_code" />
        <TableColumn isText :value="item.product_name" />
        <TableColumn isText :value="item.quantity" />
        <TableColumn isText :value="item.discount" />
        <TableColumn isMoney :value="item.unit_price" />
        <TableColumn isMoney :value="item.total_price" />
        <TableColumn isMoney :value="item.unit_cost" />
        <TableColumn isMoney :value="(item.unit_price * item.quantity) * (1 - (item.discount / 100))" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="handleEditItem(item.id)" v-on:line:delete="handleDeleteItem(item.id)" />
      </fwb-table-row>
    </Tables>
    <BudgetItemModal v-if="showBudgetItemModal" @close="showBudgetItemModal = false" @item:create="handleCreateItem" @item:update="handleUpdateItem"/>
  </div>
</template>

<script setup>
import {
  FwbHeading, FwbInput, FwbButton, FwbAccordion, FwbAccordionPanel, FwbAccordionHeader, FwbAccordionContent,
  FwbTableRow
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { onMounted, ref } from "vue";
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import BudgetItemModal from './modals/budgetItemModal.vue'

const router = useRouter()

const budgetId = router.currentRoute.value.params.id
const budget = ref(null)
const customer = ref(null)
const payment = ref(null)
const showBudgetItemModal = ref(false)
const budgetItems = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref(null)

onMounted(async () => {
  if (!budgetId) {
    await router.push({name: 'budget'})
    return
  }

  await loadBudgetDetails()
})

const loadBudgetDetails = async () => {
  const response = await window.api.budget.getById(budgetId)
  budget.value = response.budget

  if (budget.value.customer_id) {
    const customerResponse = await window.api.customer.getById(budget.value.customer_id)
    customer.value = customerResponse.customer
  }
  if (budget.value.payment_id) {
    const paymentResponse = await window.api.payment.getById(budget.value.payment_id)
    payment.value = paymentResponse.payment
  }

  await handleSearchBudgetItems()
}

const handleSearch = async (query) => {
  searchQuery.value = query
  await handleSearchBudgetItems()
}

const handleSearchBudgetItems = async () => {
  const response = await window.api.budgetItem.search(searchQuery.value, 5, currentPage.value)
  const { data, total, pages } = response
  budgetItems.value = data
  totalPages.value = pages
  totalItems.value = total
}

const handleCreateItem = async (itemData) => {
  itemData.budget_id = budgetId
  await window.api.budgetItem.add(itemData)
  await window.api.budget.updateTotals(budgetId)
  this.showBudgetItemModal.value = false
  await loadBudgetDetails()
}

const handleUpdateItem = async (itemData) => {
  itemData.budget_id = budgetId
  await window.api.budgetItem.update(itemData)
  await window.api.budget.updateTotals(budgetId)
  this.showBudgetItemModal.value = false
  await loadBudgetDetails()
}

const handleEditItem = async (itemId) => {
  console.log('Edit item with ID:', itemId)
}

const handleDeleteItem = async (itemId) => {
  console.log('Delete item with ID:', itemId)
}

</script>