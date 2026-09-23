<template>
  
  <div class="flex min-h-screen w-full flex-col items-center justify-center">
    <h1 class="text-center text-4xl mb-15">Você é professor ou aluno?</h1>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-amber-100 p-20 border-2 border-amber-200 rounded-4xl">
        <router-link to='/professor'>
          <button class="text-2xl">Sou professor</button>
        </router-link>
      </div>

      <div class="bg-amber-100 p-20 border-2 border-amber-200 rounded-4xl">
        <router-link to='/aluno'>
          <button class="text-2xl">Sou aluno</button>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>


</script>