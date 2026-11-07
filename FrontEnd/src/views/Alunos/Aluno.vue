<template>
  <main class="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
    <q-btn rounded class="fixed top-4 left-4 sm:top-5 sm:left-5 z-50 shadow-sm"
        label="Voltar" to="/">
    </q-btn>

    <h1 class="text-center text-3xl sm:text-4xl mb-8 sm:mb-15 px-2">
      Você é aluno de que?
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
      <router-link to="/teclado" class="no-underline block">
        <div class="bg-amber-100 p-8 sm:p-12 md:p-14 border-2 border-amber-200 rounded-3xl sm:rounded-4xl text-center hover:bg-amber-200 transition-colors shadow-sm cursor-pointer">
          <span class="text-xl sm:text-2xl font-medium text-black">Sou aluno de Teclado</span>
        </div>
      </router-link>

      <router-link to="/partitura" class="no-underline block">
        <div class="bg-amber-100 p-8 sm:p-12 md:p-14 border-2 border-amber-200 rounded-3xl sm:rounded-4xl text-center hover:bg-amber-200 transition-colors shadow-sm cursor-pointer">
          <span class="text-xl sm:text-2xl font-medium text-black">Sou aluno de Partitura</span>
        </div>
      </router-link>
    </div>
  </main>
</template>

<script setup>

</script>
