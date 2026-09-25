<script setup>
  import { onMounted, watchEffect, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { logado, cursoState } from '/src/importDados.js';
  import Desempenho from '../../components/Desempenho.vue';
    import profAulas from '../../components/profAulas.vue'

  const router = useRouter();
  const disciplinaSelecionada = ref('');

  watchEffect(() => {
    if (!logado.value) {
      router.push('/login');
    }
  });

</script>

<template>
    <div class="flex flex-col items-center">
      <q-btn rounded class="fixed top-5 left-5 z-50"
          label="Voltar" to="/">
      </q-btn>
  
      <div class="mt-8 w-full flex justify-center">
        <desempenho :alunos="cursoState.alunos"/>

      </div>
      
      <div class="mt-15 ml-30">
        <div class="flex">
          <h3 class="mb-5 mr-300">Aulas</h3>
          <select v-model="disciplinaSelecionada" 
            class="pr-10 border-1" name="disciplina">
            <option value=""></option>
            <option value="Teclado">Teclado</option>
            <option value="Partitura">Partitura</option>
          </select>
        </div>
        
          <div class="max-w-400 w-full flex flex-row gap-15" v-if="disciplinaSelecionada">
            <profAulas :aulas="cursoState.aulas[disciplinaSelecionada]"/>
          </div>
          <div class="max-w-400 w-full flex flex-row gap-15" v-else>
            <profAulas :aulas="cursoState.aulas"/>
          </div>
      </div>


      <p>Aqui você pode acessar informações importantes sobre os professores.</p>
    </div>

</template>
