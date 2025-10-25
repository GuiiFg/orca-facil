<template>
  <section class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="text-center mb-14">
      <fwb-heading
          tag="h2"
          class="text-4xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Nossa Equipe
      </fwb-heading>
      <p class="mt-3 text-gray-500 dark:text-gray-400 text-lg">
        Pessoas que acreditam que praticidade e eficiência andam juntas.
      </p>
    </div>
    <div class="flex justify-center items-start gap-10 flex-wrap px-4">
      <fwb-card class="w-sm bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg hover:shadow-xl transition">
        <div class="p-5 text-center">
          <fwb-img
              alt="Guilherme Padovine"
              img-class="rounded-lg border-[1px] w-100 h-100 mx-auto object-cover shadow-md"
              :src="Pado"
          />
          <h5 class="mb-2 mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Guilherme Padovine
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400 mb-4">
            Desenvolvedor Fullstack
          </p>
          <p class="font-normal text-gray-700 dark:text-gray-400 mb-4">
            <a
                href="https://github.com/seu-usuario"
                target="_blank"
                class="mx-1 text-gray-800 dark:text-gray-300 hover:underline"
            >GitHub</a>
            |
            <a
                href="https://linkedin.com/in/seu-usuario"
                target="_blank"
                class="mx-1 text-gray-800 dark:text-gray-300 hover:underline"
            >LinkedIn</a>
            |
            <a
                href="mailto:seuemail@email.com"
                class="mx-1 text-gray-800 dark:text-gray-300 hover:underline"
            >Email</a>
          </p>
        </div>
      </fwb-card>
      <fwb-card class="w-sm bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg hover:shadow-xl transition">
        <div class="p-5 text-center">
          <fwb-img
              alt="Guilherme Farias"
              img-class="rounded-lg border-[1px] w-100 h-100 mx-auto object-cover shadow-md"
              :src="Farias"
          />
          <h5 class="mb-2 mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Guilherme Farias
          </h5>
          <p class="font-normal text-gray-700 dark:text-gray-400 mb-4">
            Desenvolvedor Fullstack
          </p>
          <p class="font-normal text-gray-700 dark:text-gray-400 mb-4">
            <a
                href="https://github.com/seu-usuario"
                target="_blank"
                class="mx-1 text-gray-800 dark:text-gray-300 hover:underline"
            >GitHub</a>
            |
            <a
                href="https://linkedin.com/in/seu-usuario"
                target="_blank"
                class="mx-1 text-gray-800 dark:text-gray-300 hover:underline"
            >LinkedIn</a>
            |
            <a
                href="mailto:seuemail@email.com"
                class="mx-1 text-gray-800 dark:text-gray-300 hover:underline"
            >Email</a>
          </p>
        </div>
      </fwb-card>
    </div>
  </section>
</template>

<script setup>
import { FwbCard, FwbImg, FwbHeading } from 'flowbite-vue'
import Pado from '../../images/Pado.jpeg'
import Farias from '../../images/Farias.png'
</script>
