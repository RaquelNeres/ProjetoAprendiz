<template>

    <div class="max-w-260 w-full mb-10 
        border-2 rounded-4xl mt-7 pb-10 pt-5 
        flex flex-col gap-2">
        <h2 class="font-medium text-[40px] ml-10 border-b-2 mr-15">Desempenho</h2>
    
        <div v-if="alunos.length" class="flex flex-col gap-3">
            <div v-for="aluno in alunos" :key="aluno.id" class="flex items-center">
                <p class="text-lg ml-15 mr-10 w-20 ">{{ aluno.name }}</p>
                <meter
                    class="mt-1 w-120"
                    id="progresso"
                    :value="aluno.frequencia"
                    min="0"
                    max="100"
                    low="60"
                    high="75"
                    optimum="100"
                ></meter>
                <p class="ml-5">{{ aluno.frequencia }}%</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
       alunos: Array
    })

</script>