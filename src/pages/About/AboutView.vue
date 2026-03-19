<template>
  <div class="overflow-y-auto">
    <!-- Hero Banner -->
    <section class="relative bg-center bg-no-repeat bg-cover bg-gray-700 bg-blend-multiply text-center py-20 md:py-28"
      style="background-image: url('https://www.ifinance.com.br/wp-content/uploads/2024/07/capas-de-blog-22.png');">
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900/70"></div>
      <div class="relative px-4 mx-auto max-w-screen-md">
        <img
          src="@/assets/logos/logo_name.svg"
          alt="Orça Fácil"
          class="mx-auto mb-6 w-52 sm:w-60 md:w-72 drop-shadow-lg"
        />
        <p class="mb-4 text-xl md:text-2xl font-semibold text-white">Sobre o Orça Fácil</p>
        <p class="text-base md:text-lg font-light text-gray-300 sm:px-8 leading-relaxed">
          Simplificando a criação de orçamentos para profissionais e pequenas empresas desde o primeiro dia.
        </p>
      </div>
    </section>

    <!-- Nossa História -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div class="flex-shrink-0">
            <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center">
              <FontAwesomeIcon icon="fas fa-book-open" class="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
          </div>
          <div>
            <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Nossa História</p>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Como tudo começou</h2>
            <p class="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              O Orça Fácil nasceu da necessidade real de simplificar o processo de orçamentação para profissionais autônomos e pequenas empresas.
              Criado por desenvolvedores apaixonados por tecnologia, o projeto tem o propósito de ajudar pessoas a organizar clientes, produtos e serviços em um só lugar — de forma prática, rápida e acessível.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- O que fazemos -->
    <section class="py-16 bg-white dark:bg-gray-800 px-6">
      <div class="max-w-6xl mx-auto text-center">
        <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Funcionalidades</p>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-12">O que fazemos por você</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon="fas fa-users" class="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cadastro de Clientes</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Gerencie seus clientes com endereço, contato e documentos. Tudo organizado em um só lugar.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon="fas fa-box" class="text-orange-600 dark:text-orange-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Produtos e Serviços</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Monte seu catálogo com preços e custos. Identifique a margem de lucro de cada item.
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon="fas fa-file-pdf" class="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Geração de Orçamentos</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Crie orçamentos detalhados com múltiplas formas de pagamento e exporte PDFs profissionais.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Missão -->
    <section class="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6">
      <div class="max-w-3xl mx-auto text-center">
        <FontAwesomeIcon icon="fas fa-bullseye" class="text-4xl mb-4 opacity-80" />
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Nossa Missão</h2>
        <p class="text-blue-100 text-lg leading-relaxed">
          Ajudar empreendedores, prestadores de serviço e pequenas empresas a economizar tempo e
          profissionalizar seus atendimentos com uma ferramenta prática, leve e 100% gratuita.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
</script>