<template>

    <div v-if="aulas.length" class="flex flex-col gap-3">
        <div v-for="aula in aulas" :key="aula.id" class="flex items-center">
            <p class="text-xl ml-15 mr-10">{{ aula.name }}</p>
        </div>

    </div>
</template>

<script setup>
    const props = defineProps({
       aulas: Array
    })
    
</script>