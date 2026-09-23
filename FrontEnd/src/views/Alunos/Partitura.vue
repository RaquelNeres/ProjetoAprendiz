<template>
  <div class="mt-10 max-w-[945px] px-6 text-justify w-full mx-auto leading-relaxed">
        
    <header class="text-center">
        <h1 class="font-medium text-[50px] text-center mb-8">
            APDSJ, Aprendizes de Partirura
        </h1>
    </header>

    <div class="flex justify-center">
        <img class="border-5 rounded-[40px]" src="https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg" alt="versiculo">
    </div>

    <div class="border-2 rounded-4xl mt-5 pb-30 pt-5 flex flex-col gap-2">
        <h2 class="font-medium text-[40px] ml-10 border-b-2 mr-15">Desempenho</h2>

        <Desempenho :alunos="alunos"/>
    </div>

    <ConteudoAulas :aulas="aulas"/>

  </div>
</template>

<script setup>
    import { computed } from 'vue'
    import Desempenho from '../../components/Desempenho.vue'
    import ConteudoAulas from '../../components/ConteudoAulas.vue'
    import { cursoState } from '/src/importDados.js'

    // Acessa os alunos diretamente
    const alunos = cursoState.alunos

    // Filtra as aulas de forma reativa com computed
    const aulas = computed(() => {
    return cursoState.aulas.filter(aula => aula.disciplina === "Partitura")
    })
</script>