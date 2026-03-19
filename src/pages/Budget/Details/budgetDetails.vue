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
    <div class="mt-4 flex justify-end">
      <FwbButton color="green" @click="handleGeneratePdf">
        <FontAwesomeIcon icon="fas fa-file-pdf" /> Gerar PDF do Orçamento
      </FwbButton>
    </div>
    <BudgetPaymentModal :budgetTotal="budget.total_price" ref="modalPaymentRef" v-if="showBudgetPaymentModal" @close="showBudgetPaymentModal = false" @payment:create="handleCreatePayment" @payment:update="handleUpdatePayment"/>
    <BudgetItemModal ref="modalItemRef" v-if="showBudgetItemModal" @close="showBudgetItemModal = false" @item:create="handleCreateItem" @item:update="handleUpdateItem"/>
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
import pdfMake from '@/utils/pdfmake'

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
  }))
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
  const primaryColor = '#1e3a5f'
  const accentColor = '#2563eb'
  const lightGray = '#f8fafc'
  const mediumGray = '#e2e8f0'
  const darkText = '#1e293b'
  const mutedText = '#64748b'

  const dd = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 60],
    footer: function(currentPage, pageCount) {
      return {
        columns: [
          { text: 'Orçamento gerado pelo sistema OrcaFácil', fontSize: 7, color: mutedText, margin: [40, 20, 0, 0] },
          { text: 'Página ' + currentPage + ' de ' + pageCount, fontSize: 7, color: mutedText, alignment: 'right', margin: [0, 20, 40, 0] }
        ]
      }
    },
    content: [],
    styles: {
      title: { fontSize: 22, bold: true, color: primaryColor },
      subTitle: { fontSize: 9, color: mutedText },
      sectionTitle: { fontSize: 12, bold: true, color: primaryColor, margin: [0, 20, 0, 8] },
      tableHeader: { bold: true, fontSize: 9, color: '#ffffff', fillColor: primaryColor },
      tableCell: { fontSize: 9, color: darkText },
      tableCellRight: { fontSize: 9, color: darkText, alignment: 'right' },
      totalLabel: { fontSize: 10, color: darkText },
      totalValue: { fontSize: 10, color: darkText, bold: true },
      grandTotalLabel: { fontSize: 12, color: primaryColor, bold: true },
      grandTotalValue: { fontSize: 12, color: primaryColor, bold: true }
    },
    defaultStyle: { fontSize: 9, color: darkText }
  }

  const settingResponse = await api.setting.get()
  const setting = settingResponse.setting || null

  // === HEADER ===
  const headerColumns = []
  if (setting && setting.budget_image) {
    headerColumns.push({ image: setting.budget_image, width: 65 })
  }
  headerColumns.push({
    stack: [
      { text: 'ORÇAMENTO', style: 'title' },
      { canvas: [{ type: 'line', x1: 0, y1: 2, x2: 150, y2: 2, lineWidth: 2, lineColor: accentColor }] },
      { text: ' ', fontSize: 4 },
      { text: 'Código: ' + budget.value.code, style: 'subTitle' },
      { text: 'Data: ' + new Date().toLocaleDateString('pt-BR'), style: 'subTitle' }
    ],
    alignment: 'right'
  })
  dd.content.push({ columns: headerColumns })

  // Separator line
  dd.content.push({ canvas: [{ type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 0.5, lineColor: mediumGray }] })

  // === CLIENTE ===
  dd.content.push({ text: 'DADOS DO CLIENTE', style: 'sectionTitle' })
  if (customer.value) {
    dd.content.push({
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              stack: [
                { text: (customer.value.name || '') + ' ' + (customer.value.surname || ''), bold: true, fontSize: 11, color: darkText },
                { text: ' ', fontSize: 4 },
                { text: 'Documento: ' + (customer.value.document || 'N/A'), fontSize: 9, color: mutedText },
                { text: 'Email: ' + (customer.value.email || 'N/A'), fontSize: 9, color: mutedText },
                { text: 'Telefone: ' + (customer.value.phone || 'N/A'), fontSize: 9, color: mutedText }
              ],
              border: [false, false, false, false],
              fillColor: lightGray,
              margin: [8, 8, 8, 8]
            },
            {
              stack: [
                { text: 'Endereço', bold: true, fontSize: 9, color: darkText },
                { text: ' ', fontSize: 4 },
                { text: (customer.value.street || 'N/A') + ', ' + (customer.value.number || 'S/N'), fontSize: 9, color: mutedText },
                { text: (customer.value.district || '') + ' - ' + (customer.value.city || '') + '/' + (customer.value.state || ''), fontSize: 9, color: mutedText },
                { text: 'CEP: ' + (customer.value.zipcode || 'N/A'), fontSize: 9, color: mutedText }
              ],
              border: [false, false, false, false],
              fillColor: lightGray,
              margin: [8, 8, 8, 8]
            }
          ]
        ]
      },
      layout: 'noBorders'
    })
  }

  // === ITENS ===
  dd.content.push({ text: 'ITENS DO ORÇAMENTO', style: 'sectionTitle' })
  const itemsTableBody = [
    [
      { text: '#', style: 'tableHeader', alignment: 'center' },
      { text: 'Descrição', style: 'tableHeader' },
      { text: 'Qtd', style: 'tableHeader', alignment: 'center' },
      { text: 'Valor Unit.', style: 'tableHeader', alignment: 'right' },
      { text: 'Desc.', style: 'tableHeader', alignment: 'center' },
      { text: 'Total', style: 'tableHeader', alignment: 'right' }
    ]
  ]
  budgetItems.value.forEach((item, idx) => {
    const rowColor = idx % 2 === 0 ? '#ffffff' : lightGray
    itemsTableBody.push([
      { text: (idx + 1).toString(), alignment: 'center', fillColor: rowColor, style: 'tableCell' },
      { text: item.product_name || '', fillColor: rowColor, style: 'tableCell' },
      { text: item.quantity.toString(), alignment: 'center', fillColor: rowColor, style: 'tableCell' },
      { text: formatMoney(item.unit_price), alignment: 'right', fillColor: rowColor, style: 'tableCell' },
      { text: item.discount ? item.discount + '%' : '0%', alignment: 'center', fillColor: rowColor, style: 'tableCell' },
      { text: formatMoney(item.total_price), alignment: 'right', fillColor: rowColor, style: 'tableCell' }
    ])
  })
  dd.content.push({
    table: {
      headerRows: 1,
      widths: [25, '*', 35, 70, 40, 75],
      body: itemsTableBody
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0,
      hLineColor: () => mediumGray,
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 5,
      paddingBottom: () => 5
    }
  })

  // === TOTAIS ===
  dd.content.push({ text: '', margin: [0, 10, 0, 0] })
  dd.content.push({
    columns: [
      { width: '*', text: '' },
      {
        width: 220,
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Subtotal', style: 'totalLabel', border: [false, false, false, true], borderColor: [null, null, null, mediumGray] },
              { text: formatMoney(calculateTotalWithoutDiscount(budgetItems.value) || 0), style: 'totalValue', alignment: 'right', border: [false, false, false, true], borderColor: [null, null, null, mediumGray] }
            ],
            [
              { text: 'Descontos', style: 'totalLabel', border: [false, false, false, true], borderColor: [null, null, null, mediumGray] },
              { text: '- ' + formatMoney(calculateTotalDiscount(budgetItems.value) || 0), style: 'totalValue', alignment: 'right', color: '#ef4444', border: [false, false, false, true], borderColor: [null, null, null, mediumGray] }
            ],
            [
              { text: 'TOTAL GERAL', style: 'grandTotalLabel', border: [false, false, false, false], margin: [0, 6, 0, 0] },
              { text: formatMoney(budget.value.total_price), style: 'grandTotalValue', alignment: 'right', border: [false, false, false, false], margin: [0, 6, 0, 0] }
            ]
          ]
        },
        layout: {
          hLineWidth: (i) => i === 0 ? 0 : 0.5,
          vLineWidth: () => 0,
          hLineColor: () => mediumGray,
          paddingTop: () => 4,
          paddingBottom: () => 4
        }
      }
    ]
  })

  // === PAGAMENTO ===
  dd.content.push({ text: 'FORMAS DE PAGAMENTO', style: 'sectionTitle' })
  if (budgetPayments.value && budgetPayments.value.length > 0) {
    const payTableBody = [
      [
        { text: 'Meio de Pagamento', style: 'tableHeader' },
        { text: 'Parcelas', style: 'tableHeader', alignment: 'center' },
        { text: 'Valor Parcela', style: 'tableHeader', alignment: 'right' },
        { text: 'Desconto', style: 'tableHeader', alignment: 'center' }
      ]
    ]
    budgetPayments.value.forEach((pay, idx) => {
      const rowColor = idx % 2 === 0 ? '#ffffff' : lightGray
      payTableBody.push([
        { text: pay.payment_name || '', fillColor: rowColor, style: 'tableCell' },
        { text: pay.installments + 'x', alignment: 'center', fillColor: rowColor, style: 'tableCell' },
        { text: formatMoney(pay.installment_value), alignment: 'right', fillColor: rowColor, style: 'tableCell' },
        { text: pay.discount ? pay.discount + '%' : 'N/A', alignment: 'center', fillColor: rowColor, style: 'tableCell' }
      ])
    })
    dd.content.push({
      table: {
        headerRows: 1,
        widths: ['*', 60, 80, 60],
        body: payTableBody
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => mediumGray,
        paddingLeft: () => 6,
        paddingRight: () => 6,
        paddingTop: () => 5,
        paddingBottom: () => 5
      }
    })
  } else {
    dd.content.push({ text: 'Nenhuma forma de pagamento definida.', fontSize: 9, color: mutedText, italics: true })
  }

  // === OBSERVAÇÕES ===
  dd.content.push({ text: 'OBSERVAÇÕES', style: 'sectionTitle' })
  dd.content.push({
    table: {
      widths: ['*'],
      body: [
        [{
          text: budget.value.notes || 'Nenhuma observação.',
          fontSize: 9,
          color: budget.value.notes ? darkText : mutedText,
          italics: !budget.value.notes,
          border: [false, false, false, false],
          fillColor: lightGray,
          margin: [8, 8, 8, 8]
        }]
      ]
    },
    layout: 'noBorders'
  })

  // === ASSINATURA ===
  dd.content.push({ text: '', margin: [0, 40, 0, 0] })
  dd.content.push({
    columns: [
      {
        width: '*',
        stack: [
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5, lineColor: darkText }] },
          { text: 'Assinatura do Responsável', fontSize: 8, color: mutedText, margin: [0, 4, 0, 0], alignment: 'center', width: 200 }
        ],
        alignment: 'center'
      },
      {
        width: '*',
        stack: [
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.5, lineColor: darkText }] },
          { text: 'Assinatura do Cliente', fontSize: 8, color: mutedText, margin: [0, 4, 0, 0], alignment: 'center', width: 200 }
        ],
        alignment: 'center'
      }
    ]
  })

  pdfMake.createPdf(dd).download('orcamento-' + budget.value.code + '.pdf')
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