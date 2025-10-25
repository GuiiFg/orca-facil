<template>
  <div class="p-3">
    <Forms title="Cadastro de Clientes" description="Cadastre e gerencie seus clientes." icon="fas fa-user" >
      <div>
        <p class="font-normal text-gray-700 dark:text-gray-400">
          Informações básicas
        </p>
      </div>
      <div class="flex flex-row gap-5">
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Nome:</p>
          <FwbInput type="text" placeholder="Digite o nome do cliente" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Sobrenome:</p>
          <FwbInput type="text" placeholder="Digite o sobrenome do cliente" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Email:</p>
          <FwbInput type="email" placeholder="Digite o email do cliente" />
        </div>
      </div>
      <div class="flex flex-row gap-5 mt-4">
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Telefone:</p>
          <FwbInput type="text" placeholder="Digite o telefone do cliente" v-maska="'(##) #####-####'" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Celular:</p>
          <FwbInput type="text" placeholder="Digite o celular do cliente" v-maska="'(##) #####-####'" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">CPF/CNPJ:</p>
          <FwbInput type="text" placeholder="Digite o CPF/CNPJ do cliente" v-maska="maskaConfig" />
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
          <FwbInput type="text" placeholder="Digite o cep do cliente" v-maska="'#####-###'" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Estado:</p>
          <FwbInput type="text" placeholder="Digite o estado do cliente" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Município:</p>
          <FwbInput type="text" placeholder="Digite o município do cliente" />
        </div>
      </div>
      <div class="flex flex-row gap-5 mt-4">
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Bairro:</p>
          <FwbInput type="text" placeholder="Digite o bairro do cliente" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Rua:</p>
          <FwbInput type="text" placeholder="Digite a rua do cliente" />
        </div>
        <div class="grow">
          <p class="font-medium text-gray-900 dark:text-white mb-2">Número:</p>
          <FwbInput type="text" placeholder="Digite o número do cliente" />
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
          <FwbTextarea placeholder="Digite as observações sobre o cliente" />
        </div>
      </div>
    </Forms>
    <fwb-card class="w-full p-5 mt-4">

    </fwb-card>
  </div>
</template>

<script setup>
import { FwbCard, FwbHeading, FwbInput, FwbTextarea } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from 'vue'
import Forms from '@/components/dataManagers/Forms/forms.vue'

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
</script>