<template>
  <section class="relative bg-center bg-no-repeat bg-[url('https://www.ifinance.com.br/wp-content/uploads/2024/07/capas-de-blog-22.png')] bg-gray-700 bg-blend-multiply text-center py-28">
    <div class="px-4 mx-auto max-w-screen-md">
      <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl">
        Sobre Nós
      </h1>
      <p class="mb-8 text-lg font-normal text-gray-300 sm:px-16 lg:px-48">
        Tornamos a criação de orçamentos simples, rápida e profissional. O Orça Fácil foi criado para quem busca agilidade e praticidade no dia a dia.
      </p>
    </div>
  </section>
  <section class="py-16 bg-gray-50 dark:bg-gray-800 text-center px-6">
    <fwb-heading tag="h2" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      Nossa História
    </fwb-heading>
    <p class="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
      O Orça Fácil nasceu da necessidade real de simplificar o processo de orçamentação para profissionais autônomos e pequenas empresas.
      <br />
      Criado por desenvolvedores apaixonados por tecnologia, o projeto surgiu com o propósito de ajudar pessoas a organizar clientes, produtos e serviços em um só lugar — de forma prática e acessível.
    </p>
  </section>
  <section class="py-16 bg-white dark:bg-gray-900 px-6">
    <fwb-heading tag="h2" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
      O que fazemos
    </fwb-heading>
    <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <fwb-card class="bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition rounded-xl text-center">
        <div class="p-6">
          <div class="text-4xl mb-4">💬</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cadastro de Clientes</h3>
          <p class="text-gray-700 dark:text-gray-400">
            Gerencie seus clientes e mantenha todas as informações importantes em um só lugar.
          </p>
        </div>
      </fwb-card>
      <fwb-card class="bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition rounded-xl text-center">
        <div class="p-6">
          <div class="text-4xl mb-4">🛠️</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gestão de Produtos e Serviços</h3>
          <p class="text-gray-700 dark:text-gray-400">
            Organize os produtos e serviços que oferece e ganhe tempo na criação dos orçamentos.
          </p>
        </div>
      </fwb-card>
      <fwb-card class="bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition rounded-xl text-center">
        <div class="p-6">
          <div class="text-4xl mb-4">📄</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Geração de Orçamentos</h3>
          <p class="text-gray-700 dark:text-gray-400">
            Crie orçamentos com aparência profissional e prontos para enviar ao cliente em segundos.
          </p>
        </div>
      </fwb-card>
    </div>
  </section>
  <section class="py-16 bg-gray-50 dark:bg-gray-800 text-center px-6">
    <fwb-heading tag="h2" class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
      Nossa Missão
    </fwb-heading>
    <p class="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
      Queremos ajudar empreendedores, prestadores de serviço e pequenas empresas a economizar tempo e
      profissionalizar seus atendimentos com uma ferramenta prática, leve e gratuita.
    </p>
  </section>
</template>

<script setup>
import { FwbHeading, FwbCard } from 'flowbite-vue'
</script>