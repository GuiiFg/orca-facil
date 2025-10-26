<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-credit-card" /> Meios de Pagamento</FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Cadastre e gerencie seus meios de pagamento.
        </p>
      </div>
    </div>
    <FwbModal v-if="showFormModal" @close="showFormModal = false" size="5xl">
      <template #header>
        <div>
          <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-credit-card" /> Meios de Pagamento</FwbHeading>
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Cadastre e gerencie seus meios de pagamento.
            </p>
          </div>
        </div>
      </template>
      <template #body>
        <Forms
            title="Meios de Pagamento"
            description="Cadastre e gerencie seus meios de pagamento."
            icon="fas fa-credit-card"
            @form:save="handleSave"
            @form:clear="handleClear"
            :hasHeader="false"
        >
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Informações básicas
            </p>
          </div>
          <div class="flex flex-row gap-5">
            <div class="md:w-1/3">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
              <FwbInput
                  type="text"
                  placeholder="Digite o nome do meio de pagamento"
                  v-model="form.name.value"
                  :validation-status="form.name.status"
                  :required="form.name.required">
                <template #validationMessage>
                  <span v-for="msg in form.name.errors" :key="msg">{{ msg }}</span>
                </template>
              </FwbInput>
            </div>
          </div>
          <div class="flex flex-row gap-5 mt-4">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Descrição:</p>
              <FwbTextarea
                  v-model="form.description.value"
                  :validation-status="form.description.status"
                  :required="form.description.required"
                  placeholder="Digite a descrição do produto ou serviço" />
            </div>
          </div>
        </Forms>
      </template>
    </FwbModal>
    <Tables
        :columns="['Nome', 'Descrição', 'Ações']"
        :page="currentPage"
        :totalPages="totalPages"
        :total="totalItems"
        v-on:update:page="handleUpdatePage"
        v-on:search="handleSearch"
        v-on:reload="handleSearchPayments"
        v-on:new="showFormModal = true"
        hasSearch
        hasNew
        hasReload
        class="w-full p-5 mt-4">
      <fwb-table-row v-if="payments.length === 0">
        <td colspan="5" class="text-center py-4">
          Nenhum dado encontrado.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(payment, index) in payments" :key="payment.id">
        <TableColumn isText :value="payment.name" />
        <TableColumn isText :value="payment.description" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="handleEdit(payment)" v-on:line:delete="handleDelete(payment)" />
      </fwb-table-row>
    </Tables>
  </div>
</template>

<script setup>
import {FwbCard, FwbHeading, FwbInput, FwbModal, FwbTableRow, FwbTextarea} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import { ref, onMounted, toRaw } from 'vue'
import FormHelpers from '@/helpers/formHelpers.js'
import PaymentsForm from './form'
import PaymentsData from '@/shared/models/payments'

const form = ref({ ...PaymentsForm })
const payments = ref([])
let data = ref(null)

let currentPage = ref(1)
let totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref(null)
const showFormModal = ref(false)

const handleUpdatePage = async (newPage) => {
  currentPage.value = newPage
  await handleSearchPayments()
}

const handleSearch = async (query) => {
  searchQuery.value = query
  await handleSearchPayments()
}

const handleSearchPayments = async () => {
  console.log('window.api = ', window.api)
  const response = await window.api.payment.search(searchQuery.value, 5, currentPage.value)
  const { data, total, pages } = response
  payments.value = data
  totalPages.value = pages
  totalItems.value = total
}

onMounted(() => {
  handleClear()
  currentPage.value = 1
  totalPages.value = 1
  handleSearchPayments()
})

const handleEdit = (payment) => {
  handleClear()
  if (!payment || !payment.id) return
  if (!data || !data.value) {
    data = ref({ ...payment })
  } else {
    data.value = { ...payment }
  }
  showFormModal.value = true
  FormHelpers.loadForm(form.value, data.value)
}

const handleSave = () => {
  const isValid = FormHelpers.validateForm(form.value)
  if (!isValid) return

  if (data && data.value && data.value.id) {
    FormHelpers.loadData(form.value, data.value)
    handleUpdate()
  } else {
    data = ref({ ...PaymentsData })
    FormHelpers.loadData(form.value, data.value)
    data.value.id = null
    handleCreate()
  }
}

const handleUpdate = () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  window.api.payment.update(value)
  handleClear()
  handleSearchPayments()
  showFormModal.value = false
}

const handleCreate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  await window.api.payment.add(value)
  handleClear()
  await handleSearchPayments()
  showFormModal.value = false
}

const handleDelete = async (payment) => {
  if (!payment || !payment.id) return
  await window.api.payment.delete(payment.id)
  await handleSearchPayments()
}

const handleClear = () => {
  data.value = null
  data = ref(null)
  FormHelpers.clearForm(form.value)
}
</script>