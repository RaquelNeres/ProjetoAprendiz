<template>

    <div v-if="aulas.length" v-for="aula in aulas" :key="aula.id" 
        class="mb-2 bg-[#a5d8ff] 
            border-2 rounded-2xl pb-5 pt-5 mt-5">

        <details class="text-xl ml-10">
            <summary>{{ aula.name }}</summary>

            <div v-if="aula.topicos">
                <h2 class="ml-5 mt-3">Topicos</h2>
                <li v-for="topico in aula.topicos" class="ml-15 mt-1">{{ topico }}</li>
            </div>

            <div v-if="aula.video">
                <h2 class="ml-5 mt-3">Videos</h2>
                <a class="ml-10 mt-1" href="{{aula.video}}" target="_blank" rel="noopener noreferrer">Acesse o video aqui</a>
            </div>

            <div v-if="aula.imgs">
                <h2 class="ml-5 mt-3">Imagens</h2>
                <a class="ml-10 mt-1" href="{{aula.imgs}}" target="_blank" rel="noopener noreferrer">Acesse a imagem aqui</a>
            </div>

            <div v-if="aula.atividades">
                <h2 class="ml-5 mt-3">Atividades</h2>
                <a class="ml-10 mt-1" href="{{aula.atividades}}" target="_blank" rel="noopener noreferrer">Acesse a atividade aqui</a>
            </div>
        </details>

    </div>
</template>

<script setup>
    const props = defineProps({
       aulas: Array
    })
    
</script>