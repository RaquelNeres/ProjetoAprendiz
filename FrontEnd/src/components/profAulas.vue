<template>
  
  <div v-for="aula in aulas" :key="aula.id"
       class="bg-[#a5d8ff] w-80 border-2 rounded-2xl h-60 pt-5">
    <div class="text-xl ml-5">
      <h5>{{ aula.name }}</h5>
      <p>{{ aula.descricao }}</p>
      <p>{{ aula.disciplina }}</p>
      <p>{{ aula.presentes.join(', ') }}</p>

      <button @click="abrir2(aula)">
        <q-icon size="sm" name="delete" />
      </button>
      <q-btn class="left-40 bottom-1" label="Editar" @click="abrir(aula)" />
    </div>
  </div>

  <!-- dialog para mostrar o conteudo das aulas -->
  <q-dialog v-model="aberto">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="text-h6">Editar aula #{{ form.id }}</q-card-section>

      <q-card-section class="q-gutter-md scroll" style="max-height: 65vh">
        <q-input v-model="form.name" label="Nome" outlined />

        <q-select v-model="form.disciplina" :options="['Partitura', 'Teclado']"
                  label="Disciplina" outlined />

        <q-select v-model="form.topicos" label="Tópicos" outlined
                  multiple use-chips use-input hide-dropdown-icon
                  new-value-mode="add-unique" />

        <q-input v-model="form.video" label="Vídeo (URL)" outlined />
        <q-input v-model="form.imgs" label="Imagem (URL)" outlined />
        <q-input v-model="form.atividades" label="Atividades (URL)" outlined />

        <q-select v-model="form.presentes" label="Presentes" outlined
                  multiple use-chips
                  :options="alunosDaDisciplina" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Salvar" @click="" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- dialog para excluir aula -->
  <q-dialog v-model="aberto2">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="text-h4 mt-5">Excluir aula #{{ form.id }}</q-card-section>

      <q-card-section class="text-h6 text-amber-600">"{{ form.name }}"</q-card-section>

      <q-card-section class="text-xl q-gutter-md scroll" style="max-height: 65vh">
        <p>Tem certeza que deseja excluir esta aula?</p>
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
      aulas: Array
  })

  const aberto = ref(false)
  const aberto2 = ref(false)
  const form = ref({})
  const emit = defineEmits(['deletar'])


  function abrir(aula) {
    form.value = JSON.parse(JSON.stringify(aula))
    aberto.value = true
  }

  function abrir2(aula) {
    form.value = JSON.parse(JSON.stringify(aula))
    aberto2.value = true
  }

  function excluir() {    
    emit('deletar', form.value.id)
  }

  // function salvar() {
  //     const i = props.aulas.findIndex(a => a.id === form.value.id)
  //     props.aulas[i] = form.value
  // }
</script>