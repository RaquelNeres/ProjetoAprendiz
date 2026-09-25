<template>
  <div v-for="aula in cursoState.aulas" :key="aula.id"
       class="bg-[#a5d8ff] w-80 border-2 rounded-2xl h-60 pt-10">
    <div class="text-xl ml-5">
      <h6>{{ aula.name }}</h6>
      <p>{{ aula.disciplina }}</p>
      <p>{{ aula.presentes.join(', ') }}</p>
      <q-btn class="left-46 bottom-1" label="Editar" @click="abrir(aula)" />
    </div>
  </div>

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
        <q-btn color="primary" label="Salvar" @click="salvar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { cursoState } from '/src/importDados.js'

    const aberto = ref(false)
    const form = ref({})

    function abrir(aula) {
    // cópia profunda: arrays também são copiados, então Cancelar não altera nada
    form.value = JSON.parse(JSON.stringify(aula))
    aberto.value = true
    }

    function salvar() {
        const i = cursoState.aulas.findIndex(a => a.id === form.value.id)
        cursoState.aulas[i] = form.value
    }

    const alunosDaDisciplina = computed(() =>
        cursoState.alunos
            .filter(a => a.disciplina === form.value.disciplina)
            .map(a => a.name)
    )
</script>