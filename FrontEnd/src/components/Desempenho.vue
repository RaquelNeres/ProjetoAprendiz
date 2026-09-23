<template>

    <div v-if="alunos.length" class="flex flex-col gap-3">
        <div v-for="aluno in alunos" :key="aluno.id" class="flex items-center">
            <p class="text-lg ml-15 mr-10">{{ aluno.name }}</p>
            <meter
                class="mt-1 w-100"
                id="progresso"
                :value="aluno.frequencia"
                min="0"
                max="100"
                low="60"
                high="75"
                optimum="100"
            ></meter>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
       alunos: Array
    })

</script>