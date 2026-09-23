<template>
  <div class="flex min-h-screen w-full flex-col items-center justify-center">
    <h1 class="text-center text-4xl mb-15">Você é aluno de que?</h1>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-amber-100 p-20 border-2 border-amber-200 rounded-4xl">
        <router-link to="/teclado">
          <button class="text-2xl">Sou aluno de Teclado</button>
        </router-link>
      </div>

      <div class="bg-amber-100 p-20 border-2 border-amber-200 rounded-4xl">
        <router-link to='/partitura'>
          <button class="text-2xl">Sou aluno de Partitura</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>