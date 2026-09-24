<template>
  <div class="flex flex-col items-center">
        
    <header class="text-center mt-6 ">
        <h1 class="font-medium text-[50px] text-center mb-5">
            APDSJ, Aprendizes de {{disciplina}}
        </h1>
    </header>

    <div class="flex justify-center">
        <img class="border-5 rounded-[40px] h-80" src="https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg" alt="versiculo">
    </div>

    <Desempenho :alunos="alunos"/>

    <ConteudoAulas :aulas="aulas"/>

  </div>
</template>

<script setup>
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import Desempenho from '../../components/Desempenho.vue'
    import ConteudoAulas from '../../components/ConteudoAulas.vue'
    import { cursoState } from '/src/importDados.js'

    const route = useRoute()
    const parametroRota = computed(() => (route.params.disciplina || '').toString().toLowerCase())

    const disciplina = computed(() => {
        if (!parametroRota.value) return ''
        return parametroRota.value.charAt(0).toUpperCase() + parametroRota.value.slice(1)
    })


    // Filtra de forma reativa com computed
    const alunos = computed(() => {
        return cursoState.alunos.filter(
            aluno => aluno.disciplina.toLowerCase() === parametroRota.value
        )
    })

    const aulas = computed(() => {
        return cursoState.aulas.filter(
            aula => aula.disciplina.toLowerCase() === parametroRota.value
        )
    })
</script>