<template>
  
  <div v-for="aula in aulas" :key="aula.id"
       class="bg-[#a5d8ff] w-full max-w-80 border-2 rounded-2xl pt-5 pb-4">
    <div class="text-xl ml-5 mr-5">
      <h5>{{ aula.name }}</h5>
      <p>{{ aula.descricao }}</p>
      <p>{{ aula.disciplina }}</p>
      <p>{{ aula.presentes.join(', ') }}</p>
      <div class="mb-2 flex items-center gap-1.5 text-sm font-medium">
        <span>Visível para:</span>
        <button
          type="button"
          @click="alternarVisibilidade(aula)"
          class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
          :class="aula.visibilidade === 'professor'
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-emerald-100 text-emerald-900 border-emerald-300'">
          <q-icon :name="aula.visibilidade === 'professor' ? 'lock' : 'visibility'" size="14px" />
          <span>{{ aula.visibilidade === 'professor' ? 'Apenas professor' : 'Alunos' }}</span>
        </button>
      </div>

      <div class="flex justify-between items-center pr-3">
        <button @click="abrir2(aula)">
          <q-icon size="sm" name="delete" />
        </button>
        <q-btn label="Editar" @click="abrir(aula)" />
      </div>
    </div>
  </div>

  <!-- dialog para mostrar o conteudo das aulas -->
  <q-dialog v-model="aberto">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="text-h6">Editar aula #{{ form.id }}</q-card-section>

      <q-card-section class="q-gutter-md scroll" style="max-height: 65vh">
        <q-input v-model="form.name" label="Nome" outlined />

        <q-select v-model="form.disciplina" :options="['Partitura', 'Teclado']"
                  behavior="menu" label="Disciplina" outlined />

        <q-select
          v-model="form.visibilidade"
          :options="opcoesVisibilidade"
          emit-value
          map-options
          behavior="menu"
          label="Visibilidade"
          outlined
        />

        <q-select v-model="form.topicos" label="Tópicos" outlined
                  multiple use-chips use-input hide-dropdown-icon
                  new-value-mode="add-unique" />

        <div class="border border-gray-300 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-sm text-gray-700">Vídeos</span>
            <q-btn flat dense size="sm" color="primary" icon="add" label="Adicionar vídeo" @click="adicionarItem(form.videosLista)" />
          </div>
          <div v-for="(vid, idx) in form.videosLista" :key="idx" class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gray-50 p-2 rounded-lg">
            <q-input v-model="vid.nome" dense outlined label="Nome do vídeo (opcional)" class="sm:w-2/5" />
            <q-input v-model="vid.url" dense outlined label="Vídeo (URL)" class="flex-1" @blur="preencherTituloAutomatico(vid)" />
            <q-btn flat round dense color="negative" icon="delete" @click="removerItem(form.videosLista, idx)" />
          </div>
        </div>

        <div class="border border-gray-300 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-sm text-gray-700">Imagens</span>
            <q-btn flat dense size="sm" color="primary" icon="add" label="Adicionar imagem" @click="adicionarItem(form.imgsLista)" />
          </div>
          <div v-for="(img, idx) in form.imgsLista" :key="idx" class="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
            <q-input v-model="img.url" dense outlined label="Imagem (URL)" class="flex-1" />
            <img v-if="img.url" :src="img.url" alt="Prévia" class="w-10 h-10 object-cover rounded border" />
            <q-btn flat round dense color="negative" icon="delete" @click="removerItem(form.imgsLista, idx)" />
          </div>
        </div>

        <div class="border border-gray-300 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-medium text-sm text-gray-700">Atividades</span>
            <q-btn flat dense size="sm" color="primary" icon="add" label="Adicionar atividade" @click="adicionarItem(form.atividadesLista)" />
          </div>
          <div v-for="(ativ, idx) in form.atividadesLista" :key="idx" class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gray-50 p-2 rounded-lg">
            <q-input v-model="ativ.nome" dense outlined label="Nome do arquivo (opcional)" class="sm:w-2/5" />
            <q-input v-model="ativ.url" dense outlined label="Atividades (URL)" class="flex-1" />
            <q-btn flat round dense color="negative" icon="delete" @click="removerItem(form.atividadesLista, idx)" />
          </div>
        </div>

        <q-select v-model="form.presentes" label="Presentes" outlined
                  multiple use-chips behavior="menu"
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
  import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
  import { fetchAdmin } from '../auth'
  import {
    extrairListaMidia,
    serializarListaMidia,
    buscarTituloVideo
  } from '../midiaUtils'

  const props = defineProps({
    aulas: {
      type: Array,
      default: () => []
    },
    alunos: {
      type: Array,
      default: () => []
    }
  })

  const aberto = ref(false)
  const aberto2 = ref(false)
  const form = ref({})
  const emit = defineEmits(['deletar', 'atualizar'])
  const opcoesVisibilidade = [
    { label: 'Alunos', value: 'todos' },
    { label: 'Apenas professor', value: 'professor' }
  ]
  const alunosDaDisciplina = computed(() =>
    props.alunos
      .filter(aluno => aluno.disciplina === form.value.disciplina)
      .map(aluno => aluno.name)
  )

  function adicionarItem(lista) {
    lista.push({ nome: '', url: '' })
  }

  function removerItem(lista, index) {
    if (lista.length > 1) {
      lista.splice(index, 1)
    } else {
      lista[0] = { nome: '', url: '' }
    }
  }

  async function preencherTituloAutomatico(itemVideo) {
    if (itemVideo.url && !itemVideo.nome) {
      const titulo = await buscarTituloVideo(itemVideo.url)
      if (titulo && !itemVideo.nome) {
        itemVideo.nome = titulo
      }
    }
  }

  function abrir(aula) {
    const videosExtraidos = extrairListaMidia(aula.video, false)
    const imgsExtraidas = extrairListaMidia(aula.imgs, false)
    const atividadesExtraidas = extrairListaMidia(aula.atividades, false)

    form.value = {
      ...JSON.parse(JSON.stringify(aula)),
      visibilidade: aula.visibilidade || 'todos',
      videosLista: videosExtraidos.length ? videosExtraidos : [{ nome: '', url: '' }],
      imgsLista: imgsExtraidas.length ? imgsExtraidas : [{ nome: '', url: '' }],
      atividadesLista: atividadesExtraidas.length ? atividadesExtraidas : [{ nome: '', url: '' }]
    }
    aberto.value = true
  }

  function abrir2(aula) {
    form.value = JSON.parse(JSON.stringify(aula))
    aberto2.value = true
  }

  async function alternarVisibilidade(aula) {
    const novaVisibilidade = aula.visibilidade === 'professor' ? 'todos' : 'professor'
    try {
      const response = await fetchAdmin(`/api/aulaVisibilidade/${aula.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibilidade: novaVisibilidade })
      })

      if (!response.ok) {
        const erro = await response.json().catch(() => ({}))
        throw new Error(erro.error || `HTTP Error: ${response.status}`)
      }

      const aulaAtualizada = await response.json()
      emit('atualizar', aulaAtualizada)
    } catch (error) {
      console.error('Erro ao alternar visibilidade da aula:', error)
    }
  }

  async function salvar() {
    if (!form.value.id || !form.value.name || !form.value.topicos?.length || !form.value.presentes) {
      console.warn('Dados obrigatórios da aula não preenchidos.')
      return
    }

    try {
      const response = await fetchAdmin(`/api/editarAula/${form.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.value.name,
          topicos: form.value.topicos,
          disciplina: form.value.disciplina,
          video: serializarListaMidia(form.value.videosLista),
          imgs: serializarListaMidia(form.value.imgsLista.map(i => ({ nome: '', url: i.url }))),
          atividades: serializarListaMidia(form.value.atividadesLista),
          presentes: form.value.presentes,
          visibilidade: form.value.visibilidade || 'todos'
        })
      })

      if (!response.ok) {
        const erro = await response.json().catch(() => ({}))
        throw new Error(erro.error || `HTTP Error: ${response.status}`)
      }

      const aulaAtualizada = await response.json()
      emit('atualizar', aulaAtualizada)
      aberto.value = false
    } catch (error) {
      console.error('Erro ao editar aula:', error)
    }
  }

  async function excluir() {
    if (!form.value.id) return

    try {
      const response = await fetchAdmin(`/api/deletarAula/${form.value.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const erro = await response.json().catch(() => ({}))
        throw new Error(erro.error || `HTTP Error: ${response.status}`)
      }

      emit('deletar', { tipo: 'aula', id: form.value.id })
      aberto2.value = false
    } catch (error) {
      console.error('Erro ao excluir aula:', error)
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
