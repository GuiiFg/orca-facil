<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-user" /> Clientes</FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Cadastre e gerencie seus clientes.
        </p>
      </div>
    </div>
    <FwbModal v-if="showFormModal" @close="showFormModal = false" size="5xl">
      <template #header>
        <div>
          <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-user" /> Clientes</FwbHeading>
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Cadastre e gerencie seus clientes.
            </p>
          </div>
        </div>
      </template>
      <template #body>
        <Forms
          title="Cadastro de Clientes"
          description="Cadastre e gerencie seus clientes."
          icon="fas fa-user"
          :hasHeader="false"
          @form:save="handleSave"
          @form:clear="handleClear">
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Informações básicas
            </p>
          </div>
          <div class="flex flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
              <FwbInput
                type="text"
                placeholder="Digite o nome do cliente"
                v-model="form.name.value"
                :validation-status="form.name.status"
                :required="form.name.required">
                <template #validationMessage>
                  <span v-for="msg in form.name.errors" :key="msg">{{ msg }}</span>
                </template>
              </FwbInput>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Sobrenome:</p>
              <FwbInput
                type="text"
                placeholder="Digite o sobrenome do cliente"
                v-model="form.surname.value"
                :validation-status="form.surname.status"
                :required="form.surname.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Email:</p>
              <FwbInput
                type="email"
                placeholder="Digite o email do cliente"
                v-model="form.email.value"
                :validation-status="form.email.status"
                :required="form.email.required"/>
            </div>
          </div>
          <div class="flex flex-row gap-5 mt-4">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Telefone:</p>
              <FwbInput
                type="text"
                placeholder="Digite o telefone do cliente"
                v-maska="'## #####-####'"
                v-model="form.phone.value"
                :validation-status="form.phone.status"
                :required="form.phone.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Celular:</p>
              <FwbInput
                type="text"
                placeholder="Digite o celular do cliente"
                v-maska="'## #####-####'"
                v-model="form.cellphone.value"
                :validation-status="form.cellphone.status"
                :required="form.cellphone.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">CPF/CNPJ:</p>
              <FwbInput
                type="text"
                placeholder="Digite o CPF/CNPJ do cliente"
                v-maska="maskaConfig"
                v-model="form.document.value"
                :validation-status="form.document.status"
                :required="form.document.required"/>
            </div>
          </div>
          <div class="mt-4">
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Localização
            </p>
          </div>
          <div class="flex flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Cep:</p>
              <FwbInput
                type="text"
                placeholder="Digite o cep do cliente"
                v-maska="'#####-###'"
                v-model="form.zipcode.value"
                :validation-status="form.zipcode.status"
                :required="form.zipcode.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Estado:</p>
              <FwbInput
                type="text"
                placeholder="Digite o estado do cliente"
                v-model="form.state.value"
                :validation-status="form.state.status"
                :required="form.state.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Município:</p>
              <FwbInput
                type="text"
                placeholder="Digite o município do cliente"
                v-model="form.city.value"
                :validation-status="form.city.status"
                :required="form.city.required"/>
            </div>
          </div>
          <div class="flex flex-row gap-5 mt-4">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Bairro:</p>
              <FwbInput
                type="text"
                placeholder="Digite o bairro do cliente"
                v-model="form.district.value"
                :validation-status="form.district.status"
                :required="form.district.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Rua:</p>
              <FwbInput
                type="text"
                placeholder="Digite a rua do cliente"
                v-model="form.street.value"
                :validation-status="form.street.status"
                :required="form.street.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Número:</p>
              <FwbInput
                type="text"
                placeholder="Digite o número do cliente"
                v-model="form.number.value"
                :validation-status="form.number.status"
                :required="form.number.required"/>
            </div>
          </div>
          <div class="mt-4">
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Informações extras
            </p>
          </div>
          <div class="flex flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Observações:</p>
              <FwbTextarea
                placeholder="Digite as observações sobre o cliente"
                v-model="form.notes.value"
                :validation-status="form.notes.status"
                :required="form.notes.required"
              />
            </div>
          </div>
        </Forms>
      </template>
    </FwbModal>
    <Tables
      v-if="customers"
      :columns="['Nome', 'Sobrenome', 'Celular', 'Documento', 'Ações']"
      :page="currentPage"
      :totalPages="totalPages"
      :total="totalItems"
      v-on:update:page="handleUpdatePage"
      v-on:search="handleSearch"
      v-on:reload="handleSearchClients"
      v-on:new="showFormModal = true"
      hasSearch
      hasNew
      hasReload
      class="w-full p-5 mt-4">
      <fwb-table-row v-if="customers.length === 0">
        <td colspan="5" class="text-center py-4">
          Nenhum dado encontrado.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(customer, index) in customers" :key="customer.id">
        <TableColumn isText :value="customer.name" />
        <TableColumn isText :value="customer.surname" />
        <TableColumn isText :value="customer.cellphone" />
        <TableColumn isText :value="customer.document" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="handleEdit(customer)" v-on:line:delete="handleDelete(customer)" />
      </fwb-table-row>
    </Tables>
  </div>
</template>

<script setup>
import { FwbInput, FwbTextarea, FwbTableRow, FwbModal, FwbHeading } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import { ref, onMounted, computed, toRaw } from 'vue'
import FormHelpers from '@/helpers/formHelpers.js'
import CustomerForm from './form'
import CustomerData from '@/shared/models/customer'

const maskaConfig = computed(() => ({
  mask: (value) => {
    const digits = value.replace(/\D/g, '')
    // Se tiver até 11 dígitos, aplica CPF
    if (digits.length <= 11) {
      return '###.###.###-##'
    }
    // Caso contrário, aplica CNPJ
    return '##.###.###/####-##'
  }
}))

const form = ref({ ...CustomerForm })
let data = ref(null)
const customers = ref([])

let currentPage = ref(1)
let totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref(null)
const showFormModal = ref(false)

const handleUpdatePage = async (newPage) => {
  currentPage.value = newPage
  await handleSearchClients()
}

const handleSearch = async (query) => {
  searchQuery.value = query
  await handleSearchClients()
}

const handleSearchClients = async () => {
  const response = await window.api.customer.search(searchQuery.value, 5, currentPage.value)
  const { data, total, pages } = response
  customers.value = data
  totalPages.value = pages
  totalItems.value = total
}

onMounted(() => {
  handleClear()
  currentPage.value = 1
  totalPages.value = 1
  handleSearchClients()
})

const handleEdit = (customer) => {
  handleClear()
  if (!customer || !customer.id) return
  if (!data || !data.value) {
    data = ref({ ...customer })
  } else {
    data.value = { ...customer }
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
    data = ref({ ...CustomerData })
    FormHelpers.loadData(form.value, data.value)
    data.value.id = null
    handleCreate()
  }
}

const handleUpdate = () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  window.api.customer.update(value)
  handleClear()
  handleSearchClients()
}

const handleCreate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  await window.api.customer.add(value)
  handleClear()
  await handleSearchClients()
}

const handleDelete = async (customer) => {
  if (!customer || !customer.id) return
  await window.api.customer.delete(customer.id)
  await handleSearchClients()
}

const handleClear = () => {
  data.value = null
  data = ref(null)
  FormHelpers.clearForm(form.value)
}
</script>