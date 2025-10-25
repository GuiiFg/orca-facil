<template>
  <section class="relative bg-center bg-no-repeat bg-[url('https://www.ifinance.com.br/wp-content/uploads/2024/07/capas-de-blog-22.png')] bg-gray-800 bg-blend-multiply text-center py-32">
    <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900/60"></div>
    <div class="relative z-10 px-4 mx-auto max-w-screen-md">
      <h1 class="mb-4 text-5xl font-extrabold tracking-tight leading-tight text-white">
        Orça Fácil
      </h1>
      <p class="mb-8 text-lg font-light text-gray-300 sm:px-8">
        Uma ferramenta simples e eficiente para criar, organizar e enviar orçamentos de forma profissional.
      </p>
      <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
        <button
            @click="handleGoToProductsAndServices"
            class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition"
        >
          Começar agora
          <svg
              class="w-3.5 h-3.5 ml-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
          >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
        <button
            @click="handleGoToAbout"
            class="inline-flex justify-center items-center py-3 px-6 sm:ml-4 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-white hover:text-gray-900 focus:ring-4 focus:ring-gray-400 transition"
        >
          Saiba mais
        </button>
      </div>
    </div>
  </section>
  <section class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-10">
        Tudo o que você precisa em um só lugar
      </h2>
      <div class="grid md:grid-cols-3 gap-10">
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 hover:shadow-lg transition">
          <div class="text-4xl mb-4">⚙️</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gestão Simplificada</h3>
          <p class="text-gray-700 dark:text-gray-400">
            Gerencie produtos, serviços e clientes com facilidade e mantenha tudo organizado em um só painel.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 hover:shadow-lg transition">
          <div class="text-4xl mb-4">🚀</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Criação Rápida</h3>
          <p class="text-gray-700 dark:text-gray-400">
            Gere orçamentos profissionais em segundos, prontos para enviar diretamente ao seu cliente.
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 hover:shadow-lg transition">
          <div class="text-4xl mb-4">💡</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interface Intuitiva</h3>
          <p class="text-gray-700 dark:text-gray-400">
            Design moderno e fácil de usar — pensado para que você foque no que realmente importa: o seu negócio.
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="bg-gray-800 bg-blend-multiply text-white text-center py-14">
    <h3 class="text-2xl font-semibold mb-3">Pronto para começar?</h3>
    <p class="text-gray-100 mb-6">Crie orçamentos profissionais em poucos cliques.</p>
    <button
        @click="handleGoToProductsAndServices"
        class="bg-white text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition"
    >
      Criar meu primeiro orçamento
    </button>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { sideBarActions } from '../../stores/ui/siderBar'

const router = useRouter()

const handleGoToProductsAndServices = () => {
  router.push({ name: 'products' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}

const handleGoToAbout = () => {
  router.push({ name: 'about' })
  if (sideBarActions.sidebarOpen) {
    sideBarActions.toggle()
  }
}
</script>