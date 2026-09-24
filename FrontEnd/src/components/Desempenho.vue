<template>
  <q-card 
    flat 
    bordered 
    class="w-full q-mt-lg q-pb-lg q-pt-md column q-gap-sm"
    style="max-width: 1040px; border-radius: 32px; border-width: 2px; border-color: black;"
  >
    <q-card-section>
      <div 
        class="text-h4 q-ml-md q-mr-lg border-b-2 pb-2" 
      >
        Frequencia
      </div>
    </q-card-section>

    <q-card-section v-if="alunos.length" class="column q-gap-md">
      <div v-for="aluno in alunos" :key="aluno.id" class="row items-center no-wrap q-px-md">
        
        <div class="text-h6 ellipsis w-25">
          {{ aluno.name }}
        </div>
        
        <div class="col q-px-md">
          <q-linear-progress
            :value="aluno.frequencia / 100"
            :color="getCorProgresso(aluno.frequencia)"
            size="12px"
            rounded
          />
        </div>
        
        <div class="text-right text-h6 w-15">
          {{ aluno.frequencia }}%
        </div>

      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
  const props = defineProps({
    alunos: {
      type: Array,
      default: () => []
    }
  })

  const getCorProgresso = (frequencia) => {
    if (frequencia >= 75) return 'positive'
    if (frequencia >= 60) return 'warning' 
    return 'negative'                      
  }
</script>