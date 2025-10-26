<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4">
        <FontAwesomeIcon icon="fas fa-file-invoice-dollar" /> Orçamentos
      </FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Cadastre e gerencie orçamentos.
        </p>
      </div>
    </div>
    <FwbModal v-if="showFormModal" @close="showFormModal = false" size="5xl">
      <template #header>
        <div>
          <FwbHeading tag="h4">
            <FontAwesomeIcon icon="fas fa-file-invoice-dollar" /> Orçamentos
          </FwbHeading>
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Cadastre e gerencie orçamentos.
            </p>
          </div>
        </div>
      </template>
      <template #body>
        <Forms title="Orçamentos" description="Cadastre e gerencie orçamentos." icon="fas fa-file-invoice-dollar"
          @form:save="handleSave" @form:clear="handleClear" :hasHeader="false">
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Informações básicas
            </p>
          </div>
          <div class="flex flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Código:</p>
              <FwbInput type="text" placeholder="Digite o código do orçamento" v-model="form.code.value"
                :validation-status="form.code.status" :required="form.code.required">
                <template #validationMessage>
                  <span v-for="msg in form.code.errors" :key="msg">{{ msg }}</span>
                </template>
              </FwbInput>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Cliente:</p>
              <div class="auto-complete-fixer">
                <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar o cliente" v-model="form.customer_id.value" :options="form.customer_id.options"
                  :validation-status="form.customer_id.status" :required="form.customer_id.required" display="name" @search="searchCustomers">
                  <template #validationMessage>
                    <span v-for="msg in form.customer_id.errors" :key="msg">{{ msg }}</span>
                  </template>
                </FwbAutocomplete>
              </div>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Meio de Pagamento:</p>
              <div class="auto-complete-fixer">
                <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar o cliente" v-model="form.payment_id.value" :options="form.payment_id.options"
                  :validation-status="form.payment_id.status" :required="form.payment_id.required" display="name" @search="searchPayments">
                  <template #validationMessage>
                    <span v-for="msg in form.payment_id.errors" :key="msg">{{ msg }}</span>
                  </template>
                </FwbAutocomplete>
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-5 mt-4">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Observações:</p>
              <FwbTextarea v-model="form.notes.value" :validation-status="form.notes.status"
                :required="form.notes.required" placeholder="Digite as observações do orçamento" />
            </div>
          </div>
        </Forms>
      </template>
    </FwbModal>
    <Tables v-if="budgets" :columns="['Código', 'Cliente', 'Pagamento', 'Valor', 'Custo', 'Ações']" :page="currentPage"
      :totalPages="totalPages" :total="totalItems" v-on:update:page="handleUpdatePage" v-on:search="handleSearch"
      v-on:reload="handleSearchBudgets" v-on:new="showFormModal = true" hasSearch hasNew hasReload
      class="w-full p-5 mt-4">
      <fwb-table-row v-if="budgets.length === 0">
        <td colspan="5" class="text-center py-4">
          Nenhum dado encontrado.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(budget, index) in budgets" :key="budget.id">
        <TableColumn isText :value="budget.code" />
        <TableColumn isText :value="budget.customer_name" />
        <TableColumn isText :value="budget.payment_name" />
        <TableColumn isMoney :value="budget.value ? budget.value.toString() : '0'" />
        <TableColumn isMoney :value="budget.cost ? budget.cost.toString() : '0'" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="handleEdit(budget)"
          v-on:line:delete="handleDelete(budget)" />
      </fwb-table-row>
    </Tables>
  </div>
</template>

<script setup>
import { FwbInput, FwbTableRow, FwbTextarea, FwbHeading, FwbModal, FwbAutocomplete } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import { ref, onMounted, toRaw } from 'vue'
import FormHelpers from '@/helpers/formHelpers.js'
import BudgetForm from './form'
import BudgetData from '@/shared/models/budget'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({ ...BudgetForm })
const budgets = ref([])
let data = ref(null)

let currentPage = ref(1)
let totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref(null)
const showFormModal = ref(false)

const handleUpdatePage = async (newPage) => {
  currentPage.value = newPage
  await handleSearchBudgets()
}

const handleSearch = async (query) => {
  searchQuery.value = query
  await handleSearchBudgets()
}

const handleSearchBudgets = async () => {
  const response = await window.api.budget.search(searchQuery.value, 5, currentPage.value)
  const { data, total, pages } = response
  console.log('response', data)
  budgets.value = data
  totalPages.value = pages
  totalItems.value = total
}

const searchCustomers = async (query) => {
  if (!query || query.length < 3) {
    form.value.customer_id.options = []
    return
  }
  const response = await window.api.customer.search(query, 5, 1)
  form.value.customer_id.options = response.data.map(customer => ({
    id: customer.id,
    name: customer.name + ' ' + customer.surname,
  }))
}

const searchPayments = async (query) => {
  if (!query || query.length < 1) {
    form.value.payment_id.options = []
    return
  }
  const response = await window.api.payment.search(query, 5, 1)
  form.value.payment_id.options = response.data.map(payment => ({
    id: payment.id,
    name: payment.name,
  }))
}

onMounted(() => {
  handleClear()
  currentPage.value = 1
  totalPages.value = 1
  handleSearchBudgets()
})

const handleEdit = (budget) => {
  handleClear()
  router.push({ name: 'budget-details', params: { id: budget.id } })
}

const handleSave = () => {
  const finalForm = ref(JSON.parse(JSON.stringify(toRaw(form.value))))
  if (form.value.customer_id.value) finalForm.value.customer_id.value = form.value.customer_id.value.id
  if (form.value.payment_id.value) finalForm.value.payment_id.value = form.value.payment_id.value.id


  const isValid = FormHelpers.validateForm(finalForm.value)
  if (!isValid) return

  if (data && data.value && data.value.id) {
    FormHelpers.loadData(finalForm.value, data.value)
    handleUpdate()
  } else {
    data = ref({ ...BudgetData })
    FormHelpers.loadData(finalForm.value, data.value)
    data.value.id = null
    handleCreate()
  }
}

const handleUpdate = () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  window.api.budget.update(value)
  handleClear()
  handleSearchBudgets()
  showFormModal.value = false
}

const handleCreate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  await window.api.budget.add(value)
  handleClear()
  await handleSearchBudgets()
  showFormModal.value = false
}

const handleDelete = async (budget) => {
  if (!budget || !budget.id) return
  await window.api.budget.delete(budget.id)
  await handleSearchBudgets()
}

const handleClear = () => {
  data.value = null
  data = ref(null)
  FormHelpers.clearForm(form.value)
}
</script>

<style scoped>
.auto-complete-fixer .relative.w-full {
  padding: 0px;
  background-color: transparent;
  border: none;
}
</style>
