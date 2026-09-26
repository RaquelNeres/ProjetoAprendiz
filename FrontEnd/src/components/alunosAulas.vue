<template>

    <div v-if="aulas.length" v-for="aula in aulas" :key="aula.id" 
        class="mb-2 bg-[#a5d8ff] 
            border-2 rounded-2xl pb-5 pt-5 mt-5
            border-b-5 border-r-5">

        <details class="">
            <summary class="text-4xl ml-5"><q-icon name="expand_more" class="rounded-full bg-amber-300 border"/> {{ aula.name }}</summary>

            <div class="bg-amber-50 border rounded-2xl ml-5 mt-5 mr-5 pb-8">
                <div v-if="aula.topicos" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl border-b-4 border-r-4 bg-blue-50 border"/> 
                        Assuntos abordados
                    </h4>
                    <!-- <ul></ul>  pra tirar o ponto antes -->
                    <li v-for="topico in aula.topicos" class="ml-15 mt-1">{{ topico }}</li>
                </div>
    
                <div v-if="aula.video" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl  border-b-4 border-r-4 bg-blue-50 border"/> 
                        Videos
                    </h4>
                    <a class="ml-17 border border-blue-300 rounded-lg pt-2 pb-2 pr-5 pl-5"  
                    :href="aula.video" target="_blank" rel="noopener noreferrer">
                        Acesse o video aqui
                    </a>
                </div>
    
                <div v-if="aula.imgs" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl  border-b-4 border-r-4 bg-blue-50 border"/> 
                        Imagens</h4>
                    <a class="ml-17 border border-blue-300 rounded-lg pt-2 pb-2 pr-5 pl-5" 
                    :href="aula.imgs" target="_blank" rel="noopener noreferrer">
                        Acesse a imagem aqui
                    </a>
                </div>
    
                <div v-if="aula.atividades" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl  border-b-4 border-r-4 bg-blue-50 border"/> 
                        Atividades
                    </h4>
                    <a class="ml-17 border border-blue-300 rounded-lg pt-2 pb-2 pr-5 pl-5" 
                    :href="aula.atividades" target="_blank" rel="noopener noreferrer">
                        Acesse a atividade aqui
                    </a>
                </div>
            </div>
        </details>

    </div>
</template>

<script setup>
    const props = defineProps({
       aulas: Array
    })
    
</script>