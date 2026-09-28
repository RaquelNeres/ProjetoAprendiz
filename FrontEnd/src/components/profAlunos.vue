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

        <q-input v-model="form.frequencia" label="Freguencia" outlined />
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
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { fetchAdmin } from '../auth'

  const props = defineProps({
    alunos: {
      type: Array,
      default: () => []
    }
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

  async function salvar() {
    if (!form.value.id || !form.value.name || !form.value.disciplina) return

    try {
      const response = await fetchAdmin(`/api/editarAluno/${form.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.value.name,
          disciplina: form.value.disciplina
        })
      })

      if (!response.ok) {
        const erro = await response.json().catch(() => ({}))
        throw new Error(erro.error || `HTTP Error: ${response.status}`)
      }

      const alunoAtualizado = await response.json()

      const index = props.alunos.findIndex(
        aluno => aluno.id === alunoAtualizado.id
      )

      if (index !== -1) {
        Object.assign(props.alunos[index], alunoAtualizado)
      }
      aberto.value = false
    } catch (error) {
      console.error('Erro ao editar aluno:', error)
    }
  }

  async function excluir() {
    if (!form.value.id) return

    try {
      const response = await fetchAdmin(`/api/deletaraluno/${form.value.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const erro = await response.json().catch(() => ({}))
        throw new Error(erro.error || `HTTP Error: ${response.status}`)
      }

      emit('deletar', { tipo: 'aluno', id: form.value.id })
      aberto2.value = false
    } catch (error) {
      console.error('Erro ao excluir aluno:', error)
    }
  }

  function capturarSalvar(event) {
    const botao = event.target.closest('button')
    if (!botao || botao.textContent?.trim() !== 'Salvar') return
    if (!aberto.value) return
    if (!botao.closest('.q-dialog')) return

    event.preventDefault()
    salvar()
  }

  onMounted(() => document.addEventListener('click', capturarSalvar, true))
  onBeforeUnmount(() => document.removeEventListener('click', capturarSalvar, true))
</script>
