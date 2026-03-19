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
    <FwbModal v-if="showAddClientModal" @close="showAddClientModal = false" size="5xl">
      <template #header>
        <div>
          <FwbHeading tag="h4">
            <FontAwesomeIcon icon="fas fa-file-invoice-dollar" /> Editar orçamento
          </FwbHeading>
          <div>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              Editar orçamento.
            </p>
          </div>
        </div>
      </template>
      <template #body>
        <Forms title="Orçamentos" description="Editar orçamento." icon="fas fa-file-invoice-dollar"
          @form:save="handleSave" @form:clear="handleClear" :hasHeader="false">
          <div class="flex flex-col md:flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Cliente:</p>
              <div class="auto-complete-fixer w-full">
                <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar o cliente" v-model="editForm.customer_id.value" :options="editForm.customer_id.options"
                  :validation-status="editForm.customer_id.status" :required="editForm.customer_id.required" display="name" @search="searchCustomers">
                  <template #validationMessage>
                    <span v-for="msg in editForm.customer_id.errors" :key="msg">{{ msg }}</span>
                  </template>
                </FwbAutocomplete>
              </div>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-5 mt-4">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Observações:</p>
              <FwbTextarea v-model="editForm.notes.value" :validation-status="editForm.notes.status"
                :required="editForm.notes.required" placeholder="Digite as observações do orçamento" />
            </div>
          </div>
        </Forms>
      </template>
    </FwbModal>
    <FwbAccordion flushed>
      <FwbAccordionPanel show>
        <FwbAccordionHeader>
          <div class="flex justify-start items-start">
            <div class="content-start">
              <FontAwesomeIcon icon="fas fa-chart-simple" /> Painel de Valores
            </div>
          </div>
        </FwbAccordionHeader>
          <FwbAccordionContent>
          <div v-if="budget">
            <!-- KPI Cards Row -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <!-- Receita -->
              <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:-translate-y-0.5 transition-transform">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800 flex-shrink-0">
                  <FontAwesomeIcon icon="fas fa-arrow-trend-up" class="text-blue-500 dark:text-blue-300 text-lg" />
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Receita Total</p>
                  <p class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ formatMoney(budget.total_price) }}</p>
                </div>
              </div>
              <!-- Custo -->
              <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:-translate-y-0.5 transition-transform">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-800 flex-shrink-0">
                  <FontAwesomeIcon icon="fas fa-arrow-trend-down" class="text-red-500 dark:text-red-300 text-lg" />
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Custo Total</p>
                  <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ formatMoney(budget.total_cost) }}</p>
                </div>
              </div>
              <!-- Lucro -->
              <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:-translate-y-0.5 transition-transform">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" :class="profitValue >= 0 ? 'bg-green-100 dark:bg-green-800' : 'bg-orange-100 dark:bg-orange-800'">
                  <FontAwesomeIcon :icon="profitValue >= 0 ? 'fas fa-hand-holding-dollar' : 'fas fa-triangle-exclamation'" :class="profitValue >= 0 ? 'text-green-500 dark:text-green-300' : 'text-orange-500 dark:text-orange-300'" class="text-lg" />
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lucro Bruto</p>
                  <p class="text-xl font-bold" :class="profitValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">{{ formatMoney(profitValue) }}</p>
                </div>
              </div>
              <!-- Margem -->
              <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:-translate-y-0.5 transition-transform">
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800 flex-shrink-0">
                  <FontAwesomeIcon icon="fas fa-percent" class="text-purple-500 dark:text-purple-300 text-lg" />
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Margem de Lucro</p>
                  <p class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ profitMarginPercent }}%</p>
                </div>
              </div>
            </div>

            <!-- Profit Margin Bar -->
            <div class="mb-6">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Margem de Lucro</span>
                <span class="text-sm font-medium" :class="profitMarginPercent >= 30 ? 'text-green-500' : profitMarginPercent >= 15 ? 'text-yellow-500' : 'text-red-500'">{{ profitMarginPercent }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600 overflow-hidden">
                <div class="h-3 rounded-full transition-all duration-700 ease-out" :class="profitMarginPercent >= 30 ? 'bg-gradient-to-r from-green-400 to-green-600' : profitMarginPercent >= 15 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-red-400 to-red-600'" :style="{ width: Math.min(Math.max(profitMarginPercent, 0), 100) + '%' }"></div>
              </div>
            </div>

            <!-- Visual Breakdown Bar -->
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Composição do Orçamento</p>
              <div class="flex w-full h-8 rounded-lg overflow-hidden shadow-inner">
                <div class="bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center text-xs text-white font-semibold transition-all duration-700" :style="{ width: costBarPercent + '%' }" v-if="costBarPercent > 5">
                  Custo {{ costBarPercent }}%
                </div>
                <div class="bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center text-xs text-white font-semibold transition-all duration-700" :style="{ width: profitBarPercent + '%' }" v-if="profitBarPercent > 5">
                  Lucro {{ profitBarPercent }}%
                </div>
                <div class="bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-semibold" v-if="budget.total_price <= 0" style="width:100%">
                  Sem valores
                </div>
              </div>
            </div>

            <!-- Discount info -->
            <div class="flex items-center gap-2 mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700" v-if="budget.discount > 0">
              <FontAwesomeIcon icon="fas fa-tag" class="text-yellow-500" />
              <span class="text-sm text-gray-600 dark:text-gray-400">Desconto geral aplicado: <strong class="text-yellow-600 dark:text-yellow-400">{{ budget.discount }}%</strong></span>
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
          <div v-if="customer">
            <div class="flex flex-col md:flex-row gap-5">
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
            <div class="flex flex-col md:flex-row gap-5 mt-4">
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
            <div class="flex flex-col md:flex-row gap-5 mt-4">
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
            <div class="flex flex-col md:flex-row gap-5 mt-4">
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
          <div class="mt-4">
            <FwbButton @click="onShowAddClientModal"><FontAwesomeIcon icon="fas fa-pen" /> Editar orçamento</FwbButton>
          </div>
        </FwbAccordionContent>
      </FwbAccordionPanel>

      <FwbAccordionPanel>
        <FwbAccordionHeader>
          <div class="flex justify-start items-start">
            <div class="content-start">
              <FontAwesomeIcon icon="fas fa-eye" /> Observações
            </div>
          </div>
        </FwbAccordionHeader>
        <FwbAccordionContent>
          <div v-if="budget && budget.notes">
            <div class="flex flex-row gap-5">
              <div class="grow">
                <p class="font-medium text-gray-900 dark:text-white mb-2">Observações:</p>
                <FwbInput type="text" disabled v-model="budget.notes" />
              </div>
            </div>
          </div>
          <div v-else>
            <p class="text-gray-500 dark:text-gray-400">Nenhuma observação adicionada ao orçamento.</p>
          </div>
          <div class="mt-4">
            <FwbButton @click="onShowAddClientModal"><FontAwesomeIcon icon="fas fa-pen" /> Editar orçamento</FwbButton>
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
      <template #mobile>
        <p v-if="budgetItems.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">Nenhum produto ou serviço adicionado.</p>
        <MobileCard v-else v-for="item in budgetItems" :key="item.id"
          :title="item.product_name" :subtitle="item.product_code"
          hasEdit hasDelete @edit="handleEditItem(item.id)" @delete="handleDeleteItem(item.id)">
          <MobileCardField label="Qtde." :value="item.quantity" isText />
          <MobileCardField label="Preço Unit." :value="item.unit_price" isMoney color="blue" />
          <MobileCardField label="Total" :value="item.total_price" isMoney color="green" />
        </MobileCard>
      </template>
    </Tables>
    <div v-if="testeMessagePdf" class="mt-5 mb-5 text-center font-bold text-lg text-blue-600">
      {{ testeMessagePdf }}
    </div>

    <Tables
      class="w-full p-5 mt-4"
      hasSearch
      hasNew
      hasReload
      v-on:search="handleSearchPayments"
      v-on:reload="handleSearchBudgetPayments"
      v-on:new="showBudgetPaymentModal = true"
      :columns="['Meio de Pagamento', 'Parcelas', 'Valor da Parcela', 'Desconto', 'Ações']">
      <fwb-table-row v-if="budgetPayments.length === 0">
        <td colspan="5" class="text-center py-4">
          Nenhum meio de pagamento adicionado ao orçamento.
        </td>
      </fwb-table-row>
      <fwb-table-row v-else v-for="(pay, index) in budgetPayments" :key="pay.id">
        <TableColumn isText :value="pay.payment_name" />
        <TableColumn isText :value="pay.installments" />
        <TableColumn isMoney :value="pay.installment_value" />
        <TableColumn isPercent :value="pay.discount" />
        <TableColumn isActions hasEdit hasDelete v-on:line:edit="handleEditPayment(pay.id)" v-on:line:delete="handleDeletePayment(pay.id)" />
      </fwb-table-row>
      <template #mobile>
        <p v-if="budgetPayments.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">Nenhum meio de pagamento adicionado.</p>
        <MobileCard v-else v-for="pay in budgetPayments" :key="pay.id"
          :title="pay.payment_name"
          hasEdit hasDelete @edit="handleEditPayment(pay.id)" @delete="handleDeletePayment(pay.id)">
          <MobileCardField label="Parcelas" :value="pay.installments + 'x'" isText />
          <MobileCardField label="Valor" :value="pay.installment_value" isMoney color="blue" />
          <MobileCardField label="Desconto" :value="pay.discount ? pay.discount + '%' : '0%'" isText color="yellow" />
        </MobileCard>
      </template>
    </Tables>
    <BudgetPaymentModal :budgetTotal="budget.total_price" ref="modalPaymentRef" v-if="showBudgetPaymentModal" @close="showBudgetPaymentModal = false" @payment:create="handleCreatePayment" @payment:update="handleUpdatePayment"/>
    <BudgetItemModal ref="modalItemRef" v-if="showBudgetItemModal" @close="showBudgetItemModal = false" @item:create="handleCreateItem" @item:update="handleUpdateItem"/>
    <div class="mt-4 mb-20 flex justify-end">
      <FwbButton color="green" @click="handleGeneratePdf">
        <FontAwesomeIcon icon="fas fa-file-pdf" /> Gerar PDF do Orçamento
      </FwbButton>
    </div>
  </div>
</template>

<script setup>
import {
  FwbHeading, FwbInput, FwbButton, FwbAccordion, FwbAccordionPanel, FwbAccordionHeader, FwbAccordionContent,
  FwbTableRow, FwbModal, FwbAutocomplete, FwbTextarea
} from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { nextTick, onMounted, ref, toRaw, computed } from "vue";
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import MobileCard from '@/components/dataManagers/MobileCard/mobileCard.vue'
import MobileCardField from '@/components/dataManagers/MobileCard/mobileCardField.vue'
import BudgetItemModal from './modals/budgetItemModal.vue'
import BudgetPaymentModal from './modals/budgetPaymentModal.vue'
import EditForm from './form.js'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import FormHelpers from '@/helpers/formHelpers.js'
import { api } from '@/services/api.js'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()

const budgetId = router.currentRoute.value.params.id
const budget = ref(null)
const customer = ref(null)
const showBudgetItemModal = ref(false)
const showBudgetPaymentModal = ref(false)
const budgetItems = ref([])
const budgetPayments = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const searchQuery = ref(null)
const searchPaymentQuery = ref(null)
const showAddClientModal = ref(false)
const editForm = ref({ ...EditForm })
const testeMessagePdf = ref(null)

const modalItemRef = ref(null)
const modalPaymentRef = ref(null)

onMounted(async () => {
  if (!budgetId) {
    await router.push({name: 'budget'})
    return
  }

  await loadBudgetDetails()
})

const loadBudgetDetails = async () => {
  customer.value = null
  const response = await api.budget.getById(budgetId)
  budget.value = response.budget

  if (budget.value.customer_id) {
    const customerResponse = await api.customer.getById(budget.value.customer_id)
    customer.value = customerResponse.customer
  }

  await handleSearchBudgetItems()
  await handleSearchBudgetPayments()
}

const handleSearchBudgetPayments = async () => {
  const filters = { 
    budget_id: budgetId,
    search: searchPaymentQuery.value
  }
  const response = await api.budgetPayment.search(filters, 50, 1)
  budgetPayments.value = response.data
}

const handleSearchPayments = async (query) => {
  searchPaymentQuery.value = query
  await handleSearchBudgetPayments()
}

const handleCreatePayment = async (paymentData) => {
  paymentData.budget_id = budgetId
  await api.budgetPayment.add(paymentData)
  await loadBudgetDetails()
}

const handleUpdatePayment = async (paymentData) => {
  paymentData.budget_id = budgetId
  await api.budgetPayment.update(paymentData)
  await loadBudgetDetails()
}

const handleEditPayment = async (paymentId) => {
  showBudgetPaymentModal.value = true
  nextTick(() => {
    if (modalPaymentRef.value && modalPaymentRef.value.handleEditItem) {
      modalPaymentRef.value.handleEditItem(paymentId)
    }
  })
}

const handleDeletePayment = async (paymentId) => {
  await api.budgetPayment.delete(paymentId)
  await loadBudgetDetails()
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
  const response = await api.budgetItem.search(filters, 5, currentPage.value)
  const { data, total, pages } = response
  budgetItems.value = data
  totalPages.value = pages
  totalItems.value = total
}

const handleCreateItem = async (itemData) => {
  itemData.budget_id = budgetId
  await api.budgetItem.add(itemData)
  await api.budget.updateTotals(budgetId)
  await loadBudgetDetails()
}

const handleUpdateItem = async (itemData) => {
  itemData.budget_id = budgetId
  await api.budgetItem.update(itemData)
  await api.budget.updateTotals(budgetId)
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
  await api.budgetItem.delete(itemId)
  await api.budget.updateTotals(budgetId)
  await loadBudgetDetails()
}

const formatMoney = (value) => {
  if (value === null || value === undefined) value = '0'
  let stringValue = value.toString()
  const numberValue = parseFloat(stringValue.replace(/[^0-9.-]+/g,""))
  return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const searchCustomers = async (query) => {
  if (!query || query.length < 3) {
    editForm.value.customer_id.options = []
    return
  }
  const response = await api.customer.search(query, 5, 1)
  editForm.value.customer_id.options = response.data.map(customer => ({
    id: customer.id,
    name: customer.name + ' ' + customer.surname,
    ...customer
  }))
  FormHelpers.forceAutocompleteUpdate()
}

const handleClear = () => {
  FormHelpers.clearForm(editForm.value)
}

const handleSave = async () => {
  const finalForm = ref(JSON.parse(JSON.stringify(toRaw(editForm.value))))
  if (editForm.value.customer_id.value) finalForm.value.customer_id.value = editForm.value.customer_id.value.id

  const isValid = FormHelpers.validateForm(finalForm.value)
  if (!isValid) return

  const budgetData = JSON.parse(JSON.stringify(toRaw(budget.value)))
  budgetData.customer_id = finalForm.value.customer_id.value
  budgetData.notes = finalForm.value.notes.value

  await api.budget.update(budgetData)

  handleClear()
  showAddClientModal.value = false
  loadBudgetDetails()
}

const onShowAddClientModal = () => {
  handleClear()

  if (customer.value) {
    editForm.value.customer_id.value = {
      id: customer.value.id,
      name: customer.value.name + ' ' + customer.value.surname
    }
  }

  editForm.value.notes.value = budget.value.notes || null

  showAddClientModal.value = true
}

const handleGeneratePdf = async () => {
  testeMessagePdf.value = 'Gerando PDF com jsPDF...'

  try {
    const doc = new jsPDF()

    const primaryColor = [30, 58, 95]
    const accentColor = [37, 99, 235]
    const darkText = [30, 41, 59]
    const mutedText = [100, 116, 139]

    testeMessagePdf.value = 'Buscando configurações...'
    const settingResponse = await api.setting.get()
    const setting = settingResponse.setting || null

    let startY = 20

    if (setting && setting.budget_image) {
      try {
        doc.addImage(setting.budget_image, 'JPEG', 14, startY - 8, 30, 30)
      } catch (e) {
        console.warn('Erro ao inserir logo no jsPDF', e)
      }
    }

    doc.setFontSize(22)
    doc.setTextColor(...primaryColor)
    doc.text('ORÇAMENTO', 196, startY, { align: 'right' })
    
    doc.setDrawColor(...accentColor)
    doc.setLineWidth(1)
    doc.line(140, startY + 2, 196, startY + 2)

    doc.setFontSize(9)
    doc.setTextColor(...mutedText)
    doc.text('Código: ' + budget.value.code, 196, startY + 8, { align: 'right' })
    doc.text('Data: ' + new Date().toLocaleDateString('pt-BR'), 196, startY + 13, { align: 'right' })

    startY += 25

    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.5)
    doc.line(14, startY, 196, startY)
    startY += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('DADOS DO CLIENTE', 14, startY)
    startY += 5

    if (customer.value) {
      autoTable(doc, {
        startY: startY,
        theme: 'plain',
        styles: { fillColor: [248, 250, 252], cellPadding: 4, fontSize: 9, textColor: darkText },
        body: [
          [
            'Nome: ' + (customer.value.name || '') + ' ' + (customer.value.surname || '') + '\nDocumento: ' + (customer.value.document || 'N/A') + '\nEmail: ' + (customer.value.email || 'N/A') + '\nTelefone: ' + (customer.value.phone || 'N/A'),
            'Endereço\n' + (customer.value.street || 'N/A') + ', ' + (customer.value.number || 'S/N') + '\n' + (customer.value.district || '') + ' - ' + (customer.value.city || '') + '/' + (customer.value.state || '') + '\nCEP: ' + (customer.value.zipcode || 'N/A')
          ]
        ],
        margin: { left: 14, right: 14 }
      })
      startY = doc.lastAutoTable.finalY + 10
    }

    testeMessagePdf.value = 'Construindo itens...'

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('ITENS DO ORÇAMENTO', 14, startY)
    
    const itemsBody = budgetItems.value.map((item, idx) => [
      (idx + 1).toString(),
      item.product_name || '',
      item.quantity.toString(),
      formatMoney(item.unit_price),
      item.discount ? item.discount + '%' : '0%',
      formatMoney(item.total_price)
    ])

    autoTable(doc, {
      startY: startY + 5,
      head: [['#', 'Descrição', 'Qtd', 'Valor Unit.', 'Desc.', 'Total']],
      body: itemsBody,
      theme: 'striped',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3, textColor: darkText },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        2: { halign: 'center', cellWidth: 15 },
        3: { halign: 'right', cellWidth: 35 },
        4: { halign: 'center', cellWidth: 20 },
        5: { halign: 'right', cellWidth: 35 }
      },
      margin: { left: 14, right: 14 }
    })
    startY = doc.lastAutoTable.finalY + 10

    const subtotal = calculateTotalWithoutDiscount(budgetItems.value) || 0
    const discounts = calculateTotalDiscount(budgetItems.value) || 0
    
    autoTable(doc, {
      startY: startY,
      theme: 'plain',
      body: [
        ['Subtotal', formatMoney(subtotal)],
        ['Descontos', '- ' + formatMoney(discounts)],
        ['TOTAL GERAL', formatMoney(budget.value.total_price)]
      ],
      styles: { fontSize: 10, halign: 'right', textColor: darkText },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 40 }
      },
      margin: { left: 116 },
      didParseCell: function(data) {
        if (data.row.index === 1 && data.column.index === 1) {
          data.cell.styles.textColor = [239, 68, 68]
        }
        if (data.row.index === 2) {
          data.cell.styles.fontSize = 12
          data.cell.styles.textColor = primaryColor
          data.cell.styles.fontStyle = 'bold'
        }
      }
    })
    startY = doc.lastAutoTable.finalY + 15

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('FORMAS DE PAGAMENTO', 14, startY)

    if (budgetPayments.value && budgetPayments.value.length > 0) {
      const payBody = budgetPayments.value.map((pay) => [
        pay.payment_name || '',
        pay.installments + 'x',
        formatMoney(pay.installment_value),
        pay.discount ? pay.discount + '%' : '0%'
      ])

      autoTable(doc, {
        startY: startY + 5,
        head: [['Meio de Pagamento', 'Parcelas', 'Valor Parcela', 'Desconto']],
        body: payBody,
        theme: 'striped',
        headStyles: { fillColor: [226, 232, 240], textColor: darkText },
        styles: { fontSize: 9, cellPadding: 3, textColor: darkText },
        columnStyles: {
          1: { halign: 'center', cellWidth: 25 },
          2: { halign: 'right', cellWidth: 35 },
          3: { halign: 'center', cellWidth: 25 }
        },
        margin: { left: 14, right: 14 }
      })
      startY = doc.lastAutoTable.finalY + 15
    } else {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(...mutedText)
      doc.text('Nenhuma forma de pagamento definida.', 14, startY + 8)
      startY += 15
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('OBSERVAÇÕES', 14, startY)

    autoTable(doc, {
      startY: startY + 5,
      theme: 'plain',
      styles: { fillColor: [248, 250, 252], cellPadding: 4, fontSize: 9, textColor: darkText },
      body: [
        [budget.value.notes || 'Nenhuma observação.']
      ],
      didParseCell: function(data) {
        if (!budget.value.notes) {
          data.cell.styles.fontStyle = 'italic'
          data.cell.styles.textColor = mutedText
        }
      },
      margin: { left: 14, right: 14 }
    })
    startY = doc.lastAutoTable.finalY + 30

    if (startY > 250) {
       doc.addPage()
       startY = 30
    }

    doc.setDrawColor(...darkText)
    doc.setLineWidth(0.5)
    doc.line(20, startY, 90, startY)
    doc.line(120, startY, 190, startY)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...mutedText)
    doc.text('Assinatura do Responsável', 55, startY + 4, { align: 'center' })
    doc.text('Assinatura do Cliente', 155, startY + 4, { align: 'center' })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(...mutedText)
        doc.text('Orçamento gerado pelo sistema OrcaFácil', 14, 285)
        doc.text('Página ' + i + ' de ' + pageCount, 196, 285, { align: 'right' })
    }

    testeMessagePdf.value = 'PDF Desenhado. Extraindo arrayBuffer...'

    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      const buffer = doc.output('arraybuffer')
      testeMessagePdf.value = 'Repassando pro Capacitor...'
      await api.savePdf(buffer, 'orcamento-' + budget.value.code + '.pdf', (msg) => {
        testeMessagePdf.value = msg
      })
      setTimeout(() => { testeMessagePdf.value = null }, 3000)
    } else {
      testeMessagePdf.value = 'Salvando no Desktop...'
      doc.save('orcamento-' + budget.value.code + '.pdf')
      testeMessagePdf.value = 'PDF Gerado com Sucesso!'
      setTimeout(() => { testeMessagePdf.value = null }, 3000)
    }

  } catch (error) {
    console.error('Erro ao gerar PDF com jsPDF:', error)
    testeMessagePdf.value = 'Erro fatal: ' + error.message
  }
}


const calculateTotalWithoutDiscount = (items) => {
  let total = 0
  items.forEach(item => {
    total += item.unit_price * item.quantity
  })
  return total
}

const calculateTotalDiscount = (items) => {
  let totalDiscount = 0
  items.forEach(item => {
    const itemDiscount = (item.unit_price * item.quantity) * (item.discount / 100)
    totalDiscount += itemDiscount
  })
  return totalDiscount
}

const profitValue = computed(() => {
  if (!budget.value) return 0
  return budget.value.total_price - budget.value.total_cost
})

const profitMarginPercent = computed(() => {
  if (!budget.value || !budget.value.total_price || budget.value.total_price <= 0) return 0
  return ((profitValue.value / budget.value.total_price) * 100).toFixed(1)
})

const costBarPercent = computed(() => {
  if (!budget.value || !budget.value.total_price || budget.value.total_price <= 0) return 0
  return ((budget.value.total_cost / budget.value.total_price) * 100).toFixed(0)
})

const profitBarPercent = computed(() => {
  if (!budget.value || !budget.value.total_price || budget.value.total_price <= 0) return 0
  return (100 - parseFloat(costBarPercent.value)).toFixed(0)
})

</script>

<style scoped>
.auto-complete-fixer .relative.w-full {
  padding: 0px;
  background-color: transparent;
  border: none;
}
</style>