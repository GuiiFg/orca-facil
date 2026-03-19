<template>
  <FwbModal @close="onCloseModal">
    <template #header>
      <div>
        <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-credit-card" /> Meio de Pagamento</FwbHeading>
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Adicione ou edite uma forma de pagamento no orçamento.
          </p>
        </div>
      </div>
    </template>
    <template #body>
      <Forms title="Pagamento" description="Cadastre um meio de pagamento para o orçamento." icon="fas fa-credit-card"
             @form:save="handleSave" @form:clear="handleClear" :hasHeader="false">
        <div>
          <p class="font-normal text-gray-700 dark:text-gray-400">
            Informações do Pagamento
          </p>
        </div>
        <div class="flex flex-col md:flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Meio de Pagamento:</p>
            <div class="auto-complete-fixer">
              <FwbAutocomplete class="bg-white dark:bg-gray-800" type="text" placeholder="Digite para buscar um pagamento" v-model="form.payment_id.value" :options="form.payment_id.options"
                               :validation-status="form.payment_id.status" :required="form.payment_id.required" display="name" @search="searchPayments"
                               :disabled="isEditing === true">
                <template #validationMessage>
                  <span v-for="msg in form.payment_id.errors" :key="msg">{{ msg }}</span>
                </template>
              </FwbAutocomplete>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Máximo de parcelas:</p>
            <FwbInput
                type="number"
                min="1"
                placeholder="Digite a quantidade de parcelas"
                v-model="form.installments.value"
                :validation-status="form.installments.status"
                :required="form.installments.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">Qtd</span>
              </template>
              <template #validationMessage>
                <span v-for="msg in form.installments.errors" :key="msg">{{ msg }}</span>
              </template>
            </FwbInput>
          </div>
        </div>
        <div class="flex flex-col md:flex-row gap-5 mt-4">
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Valor Total de Cada Parcela:</p>
            <FwbInput
                type="number"
                min="0"
                placeholder="Valor da parcela"
                v-model="form.installment_value.value"
                :validation-status="form.installment_value.status"
                :required="form.installment_value.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">R$</span>
              </template>
              <template #validationMessage>
                <span v-for="msg in form.installment_value.errors" :key="msg">{{ msg }}</span>
              </template>
            </FwbInput>
          </div>
          <div class="grow">
            <p class="font-medium text-gray-900 dark:text-white mb-2">Desconto:</p>
            <FwbInput
                type="number"
                min="0"
                placeholder="Desconto"
                v-model="form.discount.value"
                :validation-status="form.discount.status"
                :required="form.discount.required">
              <template #prefix>
                <span class="text-gray-500 dark:text-gray-400">%</span>
              </template>
              <template #validationMessage>
                <span v-for="msg in form.discount.errors" :key="msg">{{ msg }}</span>
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
import {onMounted, ref, toRaw, watch} from "vue";
import Forms from '@/components/dataManagers/Forms/forms.vue'
import BudgetPaymentData from '@/shared/models/budgetPayment.js'
import BudgetPaymentForm from './budgetPaymentForm'
import FormHelpers from '@/helpers/formHelpers.js'
import { api } from '@/services/api.js'

const props = defineProps(['budgetTotal'])
const form = ref({ ...BudgetPaymentForm })
let data = ref(null)
const isEditing = ref(false)

const emit = defineEmits(['close', 'payment:create', 'payment:update'])

const onCloseModal = () => {
  handleClear()
  emit('close')
}

watch([() => form.value.installments.value, () => form.value.discount.value], ([newInstallments, newDiscount]) => {
  const basePrice = props.budgetTotal || 0;
  let parsedInstallments = parseInt(newInstallments);
  if (isNaN(parsedInstallments) || parsedInstallments < 1) parsedInstallments = 1;
  const parsedDiscount = parseFloat(newDiscount) || 0;

  const discountVal = (basePrice * parsedDiscount) / 100;
  const totalAfterDiscount = basePrice - discountVal;

  form.value.installment_value.value = (totalAfterDiscount / parsedInstallments).toFixed(2);
})

onMounted(() => {
  handleClear()
})

const handleEditItem = async (payment_id) => {
  handleClear()
  const response = await api.budgetPayment.getById(payment_id)
  const { budgetPayment } = response
  FormHelpers.loadForm(form.value, budgetPayment)
  data = ref({ ...budgetPayment })

  const paymentResponse = await api.payment.getById(budgetPayment.payment_id)
  const { payment } = paymentResponse
  const p = {
    id: payment.id,
    name: payment.name,
    ...payment
  }
  form.value.payment_id.options = [p]
  form.value.payment_id.value = p
  isEditing.value = true
}

defineExpose({
  handleEditItem
})

const searchPayments = async (query) => {
  if (!query || query.length < 1) {
    form.value.payment_id.options = []
    return
  }
  const response = await api.payment.search(query, 5, 1)
  const paymentsResponse = response.data
  if (paymentsResponse && paymentsResponse.length > 0) {
    form.value.payment_id.options = paymentsResponse.map(payment => ({
      id: payment.id,
      name: payment.name,
      ...payment
    }))
    FormHelpers.forceAutocompleteUpdate()
  }
};

const handleSave = async () => {
  const finalForm = ref(JSON.parse(JSON.stringify(toRaw(form.value))))
  if (form.value.payment_id.value) finalForm.value.payment_id.value = form.value.payment_id.value.id

  const isValid = FormHelpers.validateForm(finalForm.value)
  if (!isValid) return

  if (data && data.value && data.value.id) {
    FormHelpers.loadData(finalForm.value, data.value)
    handleUpdate()
  } else {
    data = ref({ ...BudgetPaymentData })
    FormHelpers.loadData(finalForm.value, data.value)
    data.value.id = null
    handleCreate()
  }
}

const handleCreate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  emit('payment:create', value)
  onCloseModal()
}

const handleUpdate = async () => {
  const value = JSON.parse(JSON.stringify(toRaw(data.value)))
  emit('payment:update', value)
  onCloseModal()
}

const handleClear = () => {
  data.value = null
  data = ref(null)
  FormHelpers.clearForm(form.value)
  isEditing.value = false;
  
  form.value.discount.value = 0;
  form.value.installments.value = 1;
  form.value.installment_value.value = props.budgetTotal || 0;
}
</script>

<style scoped>
.auto-complete-fixer .relative.w-full {
  padding: 0px;
  background-color: transparent;
  border: none;
}
</style>
