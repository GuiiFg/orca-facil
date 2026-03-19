<template>
  <div class="overflow-y-auto">
    <!-- Hero Section -->
    <section class="relative bg-center bg-no-repeat bg-cover bg-gray-800 bg-blend-multiply text-center py-24 md:py-32"
      style="background-image: url('https://www.ifinance.com.br/wp-content/uploads/2024/07/capas-de-blog-22.png');">
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-900/50 to-gray-900/80"></div>
      <div class="relative px-4 mx-auto max-w-screen-md">
        <img
          src="@/assets/logos/logo_name.svg"
          alt="Orça Fácil"
          class="mx-auto mb-6 w-56 sm:w-64 md:w-72 drop-shadow-lg"
        />
        <p class="mb-4 text-xl md:text-2xl font-semibold text-white">
          Orçamentos profissionais em minutos
        </p>
        <p class="mb-8 text-base md:text-lg font-light text-gray-300 sm:px-8 leading-relaxed">
          Crie, organize e envie orçamentos com aparência profissional.
          Tudo em uma ferramenta simples, rápida e pensada para o seu negócio.
        </p>
        <div class="flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <button
            @click="handleGoToBudget"
            class="inline-flex justify-center items-center py-3 px-8 text-base font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all"
          >
            <FontAwesomeIcon icon="fas fa-rocket" class="mr-2" />
            Começar agora
          </button>
          <button
            @click="handleGoToAbout"
            class="inline-flex justify-center items-center py-3 px-8 text-base font-medium text-white rounded-lg border border-white/50 hover:bg-white hover:text-gray-900 focus:ring-4 focus:ring-gray-400 transition-all"
          >
            <FontAwesomeIcon icon="fas fa-info-circle" class="mr-2" />
            Saiba mais
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Funcionalidades</p>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Tudo o que você precisa em um só lugar
        </h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Ferramentas pensadas para simplificar sua rotina e profissionalizar seu atendimento.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon="fas fa-users" class="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gestão de Clientes</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Cadastre e organize seus clientes. Tenha endereço, contato e histórico sempre acessíveis.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon="fas fa-box" class="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Produtos e Serviços</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Monte seu catálogo com preços, custos e descrições. Ganhe agilidade ao montar orçamentos.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon="fas fa-file-invoice-dollar" class="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Orçamentos em PDF</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Gere PDFs profissionais com itens, valores, parcelas e assinatura — prontos para enviar.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-white dark:bg-gray-800 border-t border-b border-gray-100 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">100%</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Gratuito</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">PDF</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Profissional</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">Local</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Seus dados seguros</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-orange-500">Fácil</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sem complicação</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center py-14">
      <div class="max-w-2xl mx-auto px-6">
        <FontAwesomeIcon icon="fas fa-file-invoice-dollar" class="text-4xl mb-4 opacity-80" />
        <h3 class="text-2xl font-bold mb-3">Pronto para começar?</h3>
        <p class="text-blue-100 mb-6 text-lg">Crie seu primeiro orçamento profissional agora mesmo.</p>
        <button
          @click="handleGoToBudget"
          class="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
        >
          <FontAwesomeIcon icon="fas fa-plus" class="mr-2" />
          Criar orçamento
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { sideBarActions } from '../../stores/ui/siderBar'

const router = useRouter()

const handleGoToBudget = () => {
  router.push({ name: 'budget' })
  if (sideBarActions.sidebarOpen) sideBarActions.toggle()
}

const handleGoToAbout = () => {
  router.push({ name: 'about' })
  if (sideBarActions.sidebarOpen) sideBarActions.toggle()
}
</script>