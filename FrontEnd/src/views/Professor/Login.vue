<template>
    <h1>Bem-vindo, faça seu login!</h1>
    <p>So pode acessar o perfil do professor depois de fazer login.</p>
</template>

<script setup>
  import { onMounted, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { logado } from '/src/importDados.js';

  const router = useRouter();

  watchEffect(() => {
    if (logado.value) {
      router.push('/professor');
    }
  });
</script>