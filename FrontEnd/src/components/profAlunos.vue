<template>
  
  <div v-for="aluno in alunos" :key="aluno.id"
       class="bg-[#a5d8ff] w-80 border-2 rounded-2xl h-60 pt-5">
    <div class="text-xl ml-5">
      <h4>{{ aluno.name }}</h4>
      <p>Disciplina: {{ aluno.disciplina }}</p>
      <p>Freguencia: {{ aluno.frequencia }}%</p>

      <button @click="abrir2(aluno)">
        <q-icon size="sm" name="delete" />
      </button>
      <q-btn class="left-40 bottom-1" label="Editar" @click="abrir(aluno)" />
    </div>
  </div>

  <!-- dialog para mostrar o conteudo das alunos -->
  <q-dialog v-model="aberto">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="text-h6">Editar aluno #{{ form.id }}</q-card-section>

      <q-card-section class="q-gutter-md scroll" style="max-height: 65vh">
        <q-input v-model="form.name" label="Nome" outlined />

        <q-select v-model="form.disciplina" :options="['Partitura', 'Teclado']"
            label="Disciplina" outlined />

        <q-input v-model="form.frequencia" label="Atividades (URL)" outlined />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Salvar" @click="" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- dialog para excluir aluno -->
  <q-dialog v-model="aberto2">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="text-h4 mt-5">Excluir aluno #{{ form.id }}</q-card-section>

      <q-card-section class="text-h6 text-amber-600">"{{ form.name }}" de {{ form.disciplina }}</q-card-section>

      <q-card-section class="text-xl q-gutter-md scroll" style="max-height: 65vh">
        <p>Tem certeza que deseja excluir este aluno?</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="negative" label="Excluir" @click="excluir" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { tiAlert } from '@quasar/extras/themify'
  import { ref, computed } from 'vue'

  const props = defineProps({
      alunos: Array
  })

  const aberto = ref(false)
  const aberto2 = ref(false)
  const form = ref({})
  const emit = defineEmits(['deletar'])


  function abrir(aluno) {
    form.value = JSON.parse(JSON.stringify(aluno))
    aberto.value = true
  }

  function abrir2(aluno) {
    form.value = JSON.parse(JSON.stringify(aluno))
    aberto2.value = true
  }

  function excluir() {    
    emit('deletar', form.value.id)
  }

  // function salvar() {
  //     const i = props.alunos.findIndex(a => a.id === form.value.id)
  //     props.alunos[i] = form.value
  // }
</script>