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
          <div class="flex flex-row gap-5">
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Cliente:</p>
              <div class="auto-complete-fixer">
                <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar o cliente" v-model="editForm.customer_id.value" :options="editForm.customer_id.options"
                  :validation-status="editForm.customer_id.status" :required="editForm.customer_id.required" display="name" @search="searchCustomers">
                  <template #validationMessage>
                    <span v-for="msg in editForm.customer_id.errors" :key="msg">{{ msg }}</span>
                  </template>
                </FwbAutocomplete>
              </div>
            </div>
            <div class="grow">
              <p class="font-medium text-gray-900 dark:text-white mb-2">Meio de Pagamento:</p>
              <div class="auto-complete-fixer">
                <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar o cliente" v-model="editForm.payment_id.value" :options="editForm.payment_id.options"
                  :validation-status="editForm.payment_id.status" :required="editForm.payment_id.required" display="name" @search="searchPayments">
                  <template #validationMessage>
                    <span v-for="msg in editForm.payment_id.errors" :key="msg">{{ msg }}</span>
                  </template>
                </FwbAutocomplete>
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-5 mt-4">
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
          <div v-if="customer">
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
          <div class="mt-4">
            <FwbButton @click="onShowAddClientModal"><FontAwesomeIcon icon="fas fa-pen" /> Editar orçamento</FwbButton>
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
          <div v-if="payment">
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
    </Tables>
    <FwbButton class="mt-4" color="green" @click="handleGeneratePdf">
      <FontAwesomeIcon icon="fas fa-file-pdf" /> Gerar PDF do Orçamento
    </FwbButton>
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
import { nextTick, onMounted, ref, toRaw } from "vue";
import TableColumn from '@/components/dataManagers/TableColumn/tableColumn.vue'
import Tables from '@/components/dataManagers/Tables/tables.vue'
import BudgetItemModal from './modals/budgetItemModal.vue'
import EditForm from './form.js'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import FormHelpers from '@/helpers/formHelpers.js'
import pdfMake from '@/utils/pdfmake'

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
const showAddClientModal = ref(false)
const editForm = ref({ ...EditForm })

const modalItemRef = ref(null)

onMounted(async () => {
  if (!budgetId) {
    await router.push({name: 'budget'})
    return
  }

  await loadBudgetDetails()
})

const loadBudgetDetails = async () => {
  customer.value = null
  payment.value = null
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

const searchCustomers = async (query) => {
  if (!query || query.length < 3) {
    editForm.value.customer_id.options = []
    return
  }
  const response = await window.api.customer.search(query, 5, 1)
  editForm.value.customer_id.options = response.data.map(customer => ({
    id: customer.id,
    name: customer.name + ' ' + customer.surname,
  }))
}

const searchPayments = async (query) => {
  if (!query || query.length < 1) {
    editForm.value.payment_id.options = []
    return
  }
  const response = await window.api.payment.search(query, 5, 1)
  editForm.value.payment_id.options = response.data.map(payment => ({
    id: payment.id,
    name: payment.name,
  }))
}

const handleClear = () => {
  FormHelpers.clearForm(editForm.value)
}

const handleSave = async () => {
  const finalForm = ref(JSON.parse(JSON.stringify(toRaw(editForm.value))))
  if (editForm.value.customer_id.value) finalForm.value.customer_id.value = editForm.value.customer_id.value.id
  if (editForm.value.payment_id.value) finalForm.value.payment_id.value = editForm.value.payment_id.value.id

  const isValid = FormHelpers.validateForm(finalForm.value)
  if (!isValid) return

  const budgetData = JSON.parse(JSON.stringify(toRaw(budget.value)))
  budgetData.customer_id = finalForm.value.customer_id.value
  budgetData.payment_id = finalForm.value.payment_id.value
  budgetData.notes = finalForm.value.notes.value

  await window.api.budget.update(budgetData)

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

  if (payment.value) {
    editForm.value.payment_id.value = {
      id: payment.value.id,
      name: payment.value.name
    }
  }

  editForm.value.notes.value = budget.value.notes || null

  showAddClientModal.value = true
}

const handleGeneratePdf = async () => {
  const dd = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    content: [],
    styles: {
      title: {
        fontSize: 18,
        bold: true
      },
      subTitle: {
        fontSize: 10,
        color: '#555'
      },
      sectionTitle: {
        fontSize: 13,
        bold: true,
        margin: [0, 15, 0, 8]
      },
      tableHeader: {
        bold: true,
        fillColor: '#eeeeee'
      }
    }
  }

  const settingResponse = await window.api.setting.get()
  const setting = settingResponse.setting || null

  //hearder
  dd.content.push({
    columns: [
      {
        image: setting && setting.budget_image ? setting.budget_image : null,
        width: 70
      },
      {
        stack: [
          { text: 'ORÇAMENTO', style: 'title' },
          { text: 'Código: ' + budget.value.code, style: 'subTitle' },
          { text: 'Data: ' + new Date().toLocaleDateString(), style: 'subTitle' }
        ],
        alignment: 'right'
      }
    ]
  })
  dd.content.push({ text: '\n' })

  // cliente 
  dd.content.push({
    text: 'Dados do Cliente',
    style: 'sectionTitle'
  })
  dd.content.push({
    columns: [
      {
        width: '*',
        text: [
          { text: customer.value.name + ' ' + customer.value.surname + '\n', bold: true },
          'Documento: ' + customer.value.document + '\n',
          'Email: ' + customer.value.email + '\n',
          'Telefone: ' + customer.value.phone
        ]
      },
      {
        width: '*',
        text: [
          'Endereço:\n',
          (customer.value.street ? customer.value.street : 'N/A') + ', ' + (customer.value.number ? customer.value.number : 'N/A') + '\n',
          (customer.value.district ? customer.value.district : 'N/A') + ' - ' + (customer.value.city ? customer.value.city : 'N/A') + '/' + (customer.value.state ? customer.value.state : 'N/A') + '\n',
          'CEP: ' + (customer.value.zipcode ? customer.value.zipcode : 'N/A') + '\n'
        ]
      }
    ]
  })
  dd.content.push({ text: '\n' })

  // itens
  dd.content.push({
    text: 'Itens do Orçamento',
    style: 'sectionTitle'
  })
  dd.content.push({
      table: {
      widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
      body: [
        [
          { text: 'Tipo', style: 'tableHeader' },
          { text: 'Descrição', style: 'tableHeader' },
          { text: 'Qtd', style: 'tableHeader' },
          { text: 'Valor Unit.', style: 'tableHeader' },
          { text: 'Desc(%)', style: 'tableHeader' },
          { text: 'Total', style: 'tableHeader' }
        ],

        ...budgetItems.value.map(item => ([
          item.product_code,
          item.product_name,
          item.quantity,
          { text: formatMoney(item.unit_price), alignment: 'right' },
          { text: item.discount ? (item.discount.toString() + ' %') : '0 %', alignment: 'right' },
          { text: formatMoney(item.total_price), alignment: 'right' }
        ]))
      ]
    },
    layout: 'lightHorizontalLines'
  }),
  dd.content.push({ text: '\n' })

  // totais
  dd.content.push({
    alignment: 'right',
    table: {
      widths: ['*', 'auto'],
      body: [
        ['Subtotal', formatMoney(calculateTotalWithoutDiscount(budgetItems.value) || 0)],
        ['Descontos', formatMoney(calculateTotalDiscount(budgetItems.value) || 0)],
        [
          { text: 'Total Geral', bold: true },
          { text: formatMoney(budget.value.total_price), bold: true }
        ]
      ]
    },
    layout: 'noBorders'
  })
  dd.content.push({ text: '\n' })

  // pagamento
  dd.content.push({
    text: 'Forma de Pagamento',
    style: 'sectionTitle'
  })
  dd.content.push({
    text: payment.value ? payment.value.name + '\n' + (payment.value.description || '') : 'N/A'
  })
  dd.content.push({ text: '\n' })

  // observações

  dd.content.push({
    text: 'Observações',
    style: 'sectionTitle'
  })
  dd.content.push({
    text: budget.value.notes || 'N/A'
  })

  pdfMake.createPdf(dd).download('orcamento.pdf')
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

</script>

<style scoped>
.auto-complete-fixer .relative.w-full {
  padding: 0px;
  background-color: transparent;
  border: none;
}
</style>