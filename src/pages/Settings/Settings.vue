<template>
  <div class="p-3">
    <div>
      <FwbHeading tag="h4"><FontAwesomeIcon icon="fas fa-cog" /> Configurações</FwbHeading>
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Gerencie suas configurações.
        </p>
      </div>
    </div>
    <Forms
      title="Configurações"
      description="Gerencie suas configurações."
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
      <div class="flex flex-col md:flex-row gap-5">
        <div class="md:w-1/3">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Logo do Orçamento:</p>
          <FwbInput
              type="text"
              class="file-input-fixer"
              placeholder="Selecione o caminho da imagem do logo"
              v-model="form.budget_image.value"
              :validation-status="form.budget_image.status"
              :required="form.budget_image.required">
            <template #validationMessage>
              <span v-for="msg in form.budget_image.errors" :key="msg">{{ msg }}</span>
            </template>
          </FwbInput>
          <FwbButton color="blue" @click="selectLogo">
            Selecionar arquivo
          </FwbButton>
          <FwbImg v-if="imgPrev" :src="imgPrev" class="mt-4 max-h-32" />
        </div>
      </div>
    </Forms>
  </div>
</template>

<script setup>
import {FwbHeading, FwbInput, FwbButton, FwbImg } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Forms from '@/components/dataManagers/Forms/forms.vue'
import { ref, toRaw, onMounted } from 'vue'
import FormHelpers from '@/helpers/formHelpers.js'
import SettingsForm from './form'

const form = ref({ ...SettingsForm })
let data = ref(null)
const imgPrev = ref(null)

onMounted(async () => {
  const response = await window.api.setting.get()
  data.value = response.setting || null

  if (data.value) {
    imgPrev.value = data.value.budget_image || null
    form.value.budget_image.value = null
  }
})

const selectLogo = async () => {
  const path = await window.api.selectFile()
  if (path) {
    form.value.budget_image.value = path

    imgPrev.value = await window.api.fileToBase64(form.value.budget_image.value)
  }
}

const handleSave = async () => {
  const isValid = FormHelpers.validateForm(form.value)
  if (!isValid) return

  const rawForm = toRaw(form.value)
  const response = await window.api.setting.get()
  const currentSetting = response.setting || null

  if (rawForm.budget_image.value) {
    const base64 = await window.api.fileToBase64(rawForm.budget_image.value)
    console.log('base64Data:', base64)
    imgPrev.value = base64
  }
  
  if (!currentSetting) {
    console.log('creating setting')
    await window.api.setting.create({
      budget_image: imgPrev.value
    })
  } else {
    currentSetting.budget_image = imgPrev.value
    await window.api.setting.update({
      ...currentSetting
    })
  }
}

const handleClear = () => {
  data.value = null
  data = ref(null)
  FormHelpers.clearForm(form.value)
}
</script>

<style scoped>
.file-input-fixer {
  padding: 0px;
  background-color: transparent;
  border: none;
}
</style>