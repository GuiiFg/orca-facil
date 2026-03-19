<template>
  <div class="overflow-y-auto">
    <!-- Hero -->
    <section class="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-14">
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Equipe</p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Conheça quem faz o Orça Fácil
          </h2>
          <p class="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Pessoas apaixonadas por tecnologia que acreditam que praticidade e eficiência andam juntas.
          </p>
        </div>

        <!-- Team Cards -->
        <div class="flex flex-col md:flex-row justify-center items-stretch gap-8 px-4">
          <!-- Card 1 -->
          <div class="w-full md:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 overflow-hidden group">
            <div class="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            <div class="p-6 text-center">
              <fwb-img
                alt="Guilherme Padovine"
                img-class="rounded-full w-28 h-28 mx-auto object-cover shadow-md border-4 border-white dark:border-gray-700 group-hover:scale-105 transition-transform"
                :src="Pado"
              />
              <h5 class="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                Guilherme Padovine
              </h5>
              <p class="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                Desenvolvedor Fullstack
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                Focado em criar soluções práticas e elegantes para problemas do dia a dia.
              </p>
              <div class="flex justify-center gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <a href="https://github.com/seu-usuario" target="_blank" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FontAwesomeIcon icon="fab fa-github" class="text-xl" />
                </a>
                <a href="https://linkedin.com/in/seu-usuario" target="_blank" class="text-gray-400 hover:text-blue-600 transition">
                  <FontAwesomeIcon icon="fab fa-linkedin" class="text-xl" />
                </a>
                <a href="mailto:seuemail@email.com" class="text-gray-400 hover:text-red-500 transition">
                  <FontAwesomeIcon icon="fas fa-envelope" class="text-xl" />
                </a>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="w-full md:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 overflow-hidden group">
            <div class="h-2 bg-gradient-to-r from-purple-500 to-purple-700"></div>
            <div class="p-6 text-center">
              <fwb-img
                alt="Guilherme Farias"
                img-class="rounded-full w-28 h-28 mx-auto object-cover shadow-md border-4 border-white dark:border-gray-700 group-hover:scale-105 transition-transform"
                :src="Farias"
              />
              <h5 class="mt-5 text-xl font-bold text-gray-900 dark:text-white">
                Guilherme Farias Garcia
              </h5>
              <p class="text-sm text-purple-600 dark:text-purple-400 font-medium mt-1">
                Dev. Fullstack / Tech Lead
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                Liderando o desenvolvimento técnico com foco em qualidade e experiência do usuário.
              </p>
              <div class="flex justify-center gap-4 mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                <a href="https://github.com/seu-usuario" target="_blank" class="text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FontAwesomeIcon icon="fab fa-github" class="text-xl" />
                </a>
                <a href="https://linkedin.com/in/seu-usuario" target="_blank" class="text-gray-400 hover:text-blue-600 transition">
                  <FontAwesomeIcon icon="fab fa-linkedin" class="text-xl" />
                </a>
                <a href="mailto:seuemail@email.com" class="text-gray-400 hover:text-red-500 transition">
                  <FontAwesomeIcon icon="fas fa-envelope" class="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-14 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <FontAwesomeIcon icon="fas fa-paper-plane" class="text-4xl text-blue-600 dark:text-blue-400 mb-4" />
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Entre em contato</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Tem uma sugestão, dúvida ou quer colaborar? Fique à vontade para nos contatar por qualquer um dos canais acima.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="mailto:seuemail@email.com" class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow hover:shadow-lg">
            <FontAwesomeIcon icon="fas fa-envelope" class="mr-2" />
            Enviar email
          </a>
          <a href="https://github.com/seu-usuario" target="_blank" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <FontAwesomeIcon icon="fab fa-github" class="mr-2" />
            Ver no GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { FwbImg } from 'flowbite-vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Pado from '@/assets/images/Pado.jpeg'
import Farias from '@/assets/images/Farias.png'
</script>
