<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-box" /> Produtos e Serviços</FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Cadastre e gerencie produtos e serviços.
        </p>
      </div>
    </div>
    <FwbModal v-if="showFormModal" @close="showFormModal = false" size="5xl">
      <template #header>
        <div>
          <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-box" /> Produtos e Serviços</FwbHeading>
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Cadastre e gerencie produtos e serviços.
            </p>
          </div>
        </div>
      </template>
      <template #body>
        <Forms
            title="Produtos e Serviços"
            description="Cadastre e gerencie seus produtos e serviços aqui."
            icon="fas fa-box"
            :hasHeader="false"
        >
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Informações básicas
            </p>
          </div>
          <div class="flex flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Código:</p>
              <FwbInput
                  type="text"
                  placeholder="Digite o código do produto ou serviço"
                  v-model="form.code.value"
                  :validation-status="form.code.status"
                  :required="form.code.required">
                <template #validationMessage>
                  <span v-for="msg in form.code.errors" :key="msg">{{ msg }}</span>
                </template>
              </FwbInput>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
              <FwbInput
                  type="text"
                  placeholder="Digite o nome do produto ou serviço"
                  v-model="form.name.value"
                  :validation-status="form.name.status"
                  :required="form.name.required"/>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Valor:</p>
              <FwbInput
                  type="text"
                  placeholder="Digite o telefone do cliente"
                  v-model="form.amount.value"
                  :validation-status="form.amount.status"
                  :required="form.amount.required">
                <template #prefix>
                  <span class="text-gray-500 dark:text-gray-400">R$</span>
                </template>
              </FwbInput>
            </div>
          </div>
          <div class="flex flex-row gap-5 mt-4">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Tipo:</p>
              <fwb-select
                  v-model="form.type.value"
                  :options="form.type.options"
                  :required="form.type.required"
              />
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Custo:</p>
              <FwbInput
                  type="text"
                  placeholder="Digite o custo do produto ou serviço"
                  v-model="form.cost.value"
                  :validation-status="form.cost.status"
                  :required="form.cost.required"/>
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
        v-if="products"
        :columns="['Código', 'Nome', 'Descrição', 'Valor', 'Ações']"
        :page="currentPage"
        :totalPages="totalPages"
        :total="totalItems"
        v-on:update:page="handleUpdatePage"
        v-on:search="handleSearch"
        v-on:reload="handleSearchProducts"
        v-on:new="showFormModal = true"
        hasSearch
        hasNew
        hasReload
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
import {FwbSelect, FwbInput, FwbTableRow, FwbTextarea, FwbHeading, FwbModal} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import { ref, onMounted, toRaw } from 'vue'
import FormHelpers from '@/helpers/formHelpers.js'
import ProductsForm from './form'
import ProductsData from '@/shared/models/productsAndServices'

const form = ref({ ...ProductsForm })
const products = ref([])
let data = ref(null)

let currentPage = ref(1)
let totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref(null)
const showFormModal = ref(false)

const handleUpdatePage = async (newPage) => {
  currentPage.value = newPage
  await handleSearchProducts()
}

const handleSearch = async (query) => {
  searchQuery.value = query
  await handleSearchProducts()
}

const handleSearchProducts = async () => {
  const response = await window.api.product.search(searchQuery.value, 5, currentPage.value)
  const { data, total, pages } = response
  products.value = data
  totalPages.value = pages
  totalItems.value = total
}

onMounted(() => {
  handleClear()
  currentPage.value = 1
  totalPages.value = 1
  handleSearchProducts()
})

const handleEdit = (product) => {
  handleClear()
  if (!product || !product.id) return
  if (!data || !data.value) {
    data = ref({ ...product })
  } else {
    data.value = { ...product }
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
    data = ref({ ...ProductsData })
    FormHelpers.loadData(form.value, data.value)
    data.value.id = null
    handleCreate()
  }
}

const handleUpdate = () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  window.api.product.update(value)
  handleClear()
  handleSearchProducts()
  showFormModal.value = false
}

const handleCreate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  await window.api.product.add(value)
  handleClear()
  await handleSearchProducts()
  showFormModal.value = false
}

const handleDelete = async (product) => {
  if (!product || !product.id) return
  await window.api.product.delete(product.id)
  await handleSearchProducts()
}

const handleClear = () => {
  data.value = null
  data = ref(null)
  FormHelpers.clearForm(form.value)
}
</script>