<template>
  <main class="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
    <h1 class="text-center text-3xl sm:text-4xl mb-8 sm:mb-15 px-2">
      Você é professor ou aluno?
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
      <router-link to="/professor" class="no-underline block">
        <div class="bg-amber-100 p-8 sm:p-12 md:p-14 border-2 border-amber-200 rounded-3xl sm:rounded-4xl text-center hover:bg-amber-200 transition-colors shadow-sm cursor-pointer">
          <span class="text-xl sm:text-2xl font-medium text-black">Sou professor</span>
        </div>
      </router-link>

      <router-link to="/aluno" class="no-underline block">
        <div class="bg-amber-100 p-8 sm:p-12 md:p-14 border-2 border-amber-200 rounded-3xl sm:rounded-4xl text-center hover:bg-amber-200 transition-colors shadow-sm cursor-pointer">
          <span class="text-xl sm:text-2xl font-medium text-black">Sou aluno</span>
        </div>
      </router-link>
    </div>
  </main>
</template>

<script setup>

</script>
