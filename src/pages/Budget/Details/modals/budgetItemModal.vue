<template>
  <FwbModal @close="onCloseModal">
    <template #header>
      <div>
        <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-user" /> Item do orçamento</FwbHeading>
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Adicione ou edite um item do orçamento.
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
        <div class="flex flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Produto/Serviço:</p>
            <div class="auto-complete-fixer">
              <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar um produto/serviço" v-model="form.product_id.value" :options="form.product_id.options"
                               :validation-status="form.product_id.status" :required="form.product_id.required" display="list_name" @search="searchProducts" @update:modelValue="onSelectProduct"
                               :disabled="isEditing === true">
                <template #validationMessage>
                  <span v-for="msg in form.product_id.errors" :key="msg">{{ msg }}</span>
                </template>
              </FwbAutocomplete>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Quantidate:</p>
            <FwbInput
                type="number"
                min="0"
                placeholder="Digite a quantidade"
                v-model="form.quantity.value"
                :validation-status="form.quantity.status"
                :required="form.quantity.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">UNs</span>
              </template>
            </FwbInput>
          </div>
        </div>
        <div class="flex flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Valor Unitário:</p>
            <FwbInput
                type="number"
                min="0"
                placeholder="Digite a quantidade"
                v-model="form.unit_price.value"
                :validation-status="form.unit_price.status"
                :required="form.unit_price.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">R$</span>
              </template>
            </FwbInput>
          </div>
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Custo Unitário:</p>
            <FwbInput
                type="number"
                min="0"
                placeholder="Digite a quantidade"
                v-model="form.unit_cost.value"
                :validation-status="form.unit_cost.status"
                :required="form.unit_cost.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">R$</span>
              </template>
            </FwbInput>
          </div>
        </div>
        <div class="flex flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Desconto:</p>
            <FwbInput
                type="number"
                min="0"
                max="100"
                placeholder="Digite a quantidade"
                v-model="form.discount.value"
                :validation-status="form.discount.status"
                :required="form.discount.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">%</span>
              </template>
            </FwbInput>
          </div>
        </div>
        <div class="flex flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Total:</p>
            <FwbInput
                type="number"
                placeholder="Digite a quantidade"
                disabled
                v-model="finalValue">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">R$</span>
              </template>
            </FwbInput>
          </div>
        </div>
      </Forms>
    </template>
  </FwbModal>
</template>

<script setup>
import {FwbAutocomplete, FwbHeading, FwbInput, FwbModal} from 'flowbite-vue'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {onMounted, ref, computed, toRaw} from "vue";
import Forms from '@/components/dataManagers/Forms/forms.vue'
import BudgetItemData from '@/shared/models/budgetItem.js'
import BudgetItemForm from './budgetItemForm'
import FormHelpers from '@/helpers/formHelpers.js'

const form = ref({ ...BudgetItemForm })
let data = ref(null)
const isEditing = ref(false)

const emit = defineEmits(['close', 'item:create', 'item:update'])

const onCloseModal = () => {
  handleClear()
  emit('close')
}

onMounted(() => {
  handleClear()
})

const handleEditItem = async (item_id) => {
  handleClear()
  const response = await window.api.budgetItem.getById(item_id)
  const { budgetItem } = response
  FormHelpers.loadForm(form.value, budgetItem)
  data = ref({ ...budgetItem })

  const prodResponse = await window.api.product.getById(budgetItem.product_id)
  const { product } = prodResponse
  const p = {
    id: product.id,
    list_name: product.code + ' - ' + product.name + ' (' + (product.type === 0 ? 'Produto' : 'Serviço') + ')',
    ...product
  }
  form.value.product_id.options = [p]
  form.value.product_id.value = p
  isEditing.value = true
}

defineExpose({
  handleEditItem
})

const finalValue = computed(() => {
  if (form.value.unit_price.value <= 0 || form.value.quantity.value <= 0) return 0
  const total = form.value.unit_price.value * form.value.quantity.value
  const discount = form.value.discount.value > 0 ? (total * (form.value.discount.value / 100)) : 0
  return total - discount
})

const searchProducts = async (query) => {
  if (!query || query.length < 2) {
    form.value.product_id.options = []
    return
  }
  const response = await window.api.product.search(query, 5, 0)
  const { data } = response
  if (data && data.length > 0) {
    form.value.product_id.options = data.map(item => ({
      id: item.id,
      list_name: item.code + ' - ' + item.name + ' (' + (item.type === 0 ? 'Produto' : 'Serviço') + ')',
      ...item
    }))
  }
};

const onSelectProduct = (selected) => {
  if (selected) {
    form.value.unit_price.value = selected.amount || 0
    form.value.unit_cost.value = selected.cost || 0
  } else {
    form.value.unit_price.value = 0
    form.value.unit_cost.value = 0
  }
  form.value.quantity.value = 1
  form.value.discount.value = 0
}

const handleSave = async () => {
  const finalForm = ref(JSON.parse(JSON.stringify(toRaw(form.value))))
  if (form.value.product_id.value) finalForm.value.product_id.value = form.value.product_id.value.id

  const isValid = FormHelpers.validateForm(finalForm.value)
  if (!isValid) return

  if (data && data.value && data.value.id) {
    FormHelpers.loadData(finalForm.value, data.value)
    handleUpdate()
  } else {
    data = ref({ ...BudgetItemData })
    FormHelpers.loadData(finalForm.value, data.value)
    data.value.id = null
    handleCreate()
  }
}

const handleCreate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  emit('item:create', value)
  onCloseModal()
}

const handleUpdate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  emit('item:update', value)
  onCloseModal()
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