<script setup>
  import { watchEffect, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { logado, cursoState } from '/src/importDados.js';
  import Desempenho from '../../components/Desempenho.vue';
  import profAulas from '../../components/profAulas.vue'
import ProfAlunos from '../../components/profAlunos.vue';

  const router = useRouter();
  const disciplinaSelecionada = ref('');
  const materias = ref('Aulas');

  watchEffect(() => {
    if (!logado.value) {
      router.push('/login');
    }
  });

  function deletarAula(id) {    
    cursoState.aulas.value = cursoState.aulas.value.filter(aula => aula.id !== id)
  }

  function visualizacao() {
    materias.value = materias.value === 'Aulas' ? 'Alunos' : 'Aulas';
  }


  const aulasFiltradas = computed(() => {
    if (!disciplinaSelecionada.value) {
      return cursoState.aulas;
    }

    return cursoState.aulas.filter(
      aula => aula.disciplina === disciplinaSelecionada.value
    );
  });

  const alunosFiltrados = computed(() => {
    if (!disciplinaSelecionada.value) {
      return cursoState.alunos;
    }

    return cursoState.alunos.filter(
      aluno => aluno.disciplina === disciplinaSelecionada.value
    );
  });

</script>

<template>
    <div class="flex flex-col items-center">
      <q-btn rounded class="fixed top-5 left-5 z-50"
          label="Voltar" to="/">
      </q-btn>
  
      <div class="mt-8 w-full flex justify-center">
        <desempenho :alunos="alunosFiltrados"/>

      </div>
      
      <div class="fixed top-20 right-70 bg-[#a5d8ff]" >
        <select v-model="disciplinaSelecionada" 
          class="pr-15 pl-1 pb-2 pt-2 border" name="disciplina">
          <option value="">Todas</option>
          <option value="Teclado">Teclado</option>
          <option value="Partitura">Partitura</option>
        </select>
      </div>

      <div v-if="materias === 'Aulas'" class="mt-15 ml-30">
        <h3 class="mb-5 mr-300">Aulas</h3>
        
        <div class="max-w-400 w-full flex flex-row gap-15 mb-30">
          <profAulas :aulas="aulasFiltradas" @deletar="deletarAula"/>
        </div>
      </div>
      <div v-else-if="materias === 'Alunos'" class="mt-15 ml-30">
        <h3 class="mb-5 mr-300">Perfil Alunos</h3>
        
        <div class="max-w-400 w-full flex flex-row gap-15 mb-30">
          <ProfAlunos :alunos="alunosFiltrados" @deletar="deletarAula"/>
        </div>
      </div>


    </div>

    <q-btn class="fixed z-50 bottom-10 left-10" size="xl" 
      round color="secondary" icon="settings" @click="visualizacao"/>


    <q-btn class="fixed z-50 bottom-10 right-10" size="xl" round color="secondary" icon="add">
      <q-menu anchor="top middle" self="bottom middle" 
        :offset="[0, 15]" class="bg-transparent no-shadow">

        <div class="column q-gutter-y-sm items-center">
          <!-- Superior -->
          <q-btn fab-mini color="primary" icon="control_point" 
            @click="addAula" v-close-popup/>

          <!-- Inferior -->
          <q-btn fab-mini color="primary" icon="person_add_alt" 
            @click="addAluno" v-close-popup />
          
        </div>
      </q-menu>

    </q-btn>

</template>
