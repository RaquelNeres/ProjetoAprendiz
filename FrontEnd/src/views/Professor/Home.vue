<script setup>
  import { onMounted, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { logado } from '/src/importDados.js';
import Desempenho from '../../components/Desempenho.vue';

  const router = useRouter();

  watchEffect(() => {
    if (!logado.value) {
      router.push('/login');
    }
  });
</script>

<template>
    <div class="flex flex-col items-center">
      <q-btn rounded class="fixed top-5 left-5 z-50"
          label="Voltar" to="/"
      </q-btn>
  
      <desempenho/>
      
      <p>Aqui você pode acessar informações importantes sobre os professores.</p>
    </div>

</template>
