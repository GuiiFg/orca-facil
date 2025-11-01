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
          <div>
            <div class="flex justify-center items-center gap-10 mb-2" v-if="budget">
              <FwbHeading tag="h3" class="w-min">
                <div class="flex justify-center items-center gap-2 text-blue-400">
                  <FontAwesomeIcon icon="fas fa-arrow-up" />
                  <span>{{ formatMoney(budget.total_price) }}</span>
                </div>
              </FwbHeading>
              <FwbHeading tag="h3" class="w-min">
                <div class="flex justify-center items-center gap-2 text-red-400">
                  <FontAwesomeIcon icon="fas fa-arrow-down" />
                  <span>{{ formatMoney(budget.total_cost) }}</span>
                </div>
              </FwbHeading>
              <FwbHeading tag="h3" class="w-min">
                <div class="flex justify-center items-center gap-2 text-green-400">
                  <FontAwesomeIcon icon="fas fa-plus" />
                  <span>{{ formatMoney(budget.total_price - budget.total_cost) }}</span>
                </div>
              </FwbHeading>
            </div>
          </div>
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
      :columns="['Código', 'Nome', 'Qtde.', 'Desconto', 'Preço Unit.', 'Preço Total', 'Custo Unit.', 'Custo Total', 'Ações']">
      <fwb-table-row v-if="budgetItems.length === 0">
        <td colspan="9" class="text-center py-4">
          Nenhum produto ou serviço adicionado ao orçamento.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(item, index) in budgetItems" :key="item.id">
        <TableColumn isText :value="item.product_code" />
        <TableColumn isText :value="item.product_name" />
        <TableColumn isText :value="item.quantity" />
        <TableColumn isPercent :value="item.discount" />
        <TableColumn isMoney :value="item.unit_price" />
        <TableColumn isMoney :value="item.total_price" />
        <TableColumn isMoney :value="item.unit_cost || 0" />
        <TableColumn isMoney :value="(item.unit_cost * item.quantity) * (1 - (item.discount / 100))" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="handleEditItem(item.id)" v-on:line:delete="handleDeleteItem(item.id)" />
      </fwb-table-row>
    </Tables>
    <BudgetItemModal ref="modalItemRef" v-if="showBudgetItemModal" @close="showBudgetItemModal = false" @item:create="handleCreateItem" @item:update="handleUpdateItem"/>
  </div>
</template>

<script setup>
import {
  FwbHeading, FwbInput, FwbButton, FwbAccordion, FwbAccordionPanel, FwbAccordionHeader, FwbAccordionContent,
  FwbTableRow
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { nextTick, onMounted, ref } from "vue";
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

const modalItemRef = ref(null)

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
  const filters = {
    budget_id: budgetId,
    search: searchQuery.value
  }
  const response = await window.api.budgetItem.search(filters, 5, currentPage.value)
  const { data, total, pages } = response
  budgetItems.value = data
  totalPages.value = pages
  totalItems.value = total
}

const handleCreateItem = async (itemData) => {
  itemData.budget_id = budgetId
  await window.api.budgetItem.add(itemData)
  await window.api.budget.updateTotals(budgetId)
  await loadBudgetDetails()
}

const handleUpdateItem = async (itemData) => {
  itemData.budget_id = budgetId
  await window.api.budgetItem.update(itemData)
  await window.api.budget.updateTotals(budgetId)
  await loadBudgetDetails()
}

const handleEditItem = async (itemId) => {
  showBudgetItemModal.value = true
  nextTick(() => {
    console.log(modalItemRef.value)
    if (modalItemRef.value && modalItemRef.value.handleEditItem) {
      modalItemRef.value.handleEditItem(itemId)
    }
  })
}

const handleDeleteItem = async (itemId) => {
  await window.api.budgetItem.delete(itemId)
  await window.api.budget.updateTotals(budgetId)
  await loadBudgetDetails()
}

const formatMoney = (value) => {
  if (value === null || value === undefined) value = '0'
  let stringValue = value.toString()
  const numberValue = parseFloat(stringValue.replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

</script>