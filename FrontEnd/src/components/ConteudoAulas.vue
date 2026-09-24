<template>

    <div v-if="aulas.length" v-for="aula in aulas" :key="aula.id" 
        class="max-w-300 w-full mb-7
            border-2 rounded-2xl pb-5 pt-5">

        <details class="text-xl ml-10">
            <summary>{{ aula.name }}</summary>

            <h2 class="ml-5 mt-3">Topicos</h2>
            <li v-for="topico in aula.topicos" class="ml-5 mt-1">{{ topico }}</li>
        </details>

    </div>
</template>

<script setup>
    const props = defineProps({
       aulas: Array
    })
    
</script>