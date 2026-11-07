<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { apiUrl } from '../../api';
  import { fetchAdmin, signOutAdmin } from '../../auth';
  import { serializarListaMidia, buscarTituloVideo } from '../../midiaUtils';
  import Desempenho from '../../components/Desempenho.vue';
  import profAulas from '../../components/profAulas.vue'
  import ProfAlunos from '../../components/profAlunos.vue';

  const router = useRouter();
  const $q = useQuasar();
  const isLoading = ref(true)

  const disciplinaSelecionada = ref('');
  const materias = ref('Aulas');
  const aulasLocal = ref([]);
  const alunosLocal = ref([]);


  // Banco de dados
  const carregarAulasDb = async () => {
    try {
        let response;
        try {
            response = await fetchAdmin('/api/aulas')
        } catch {
            response = await fetch(apiUrl('/api/aulas'))
        }
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

        const aulasDb = await response.json()

        if (aulasDb && !aulasDb.erro) {
            aulasLocal.value = aulasDb
        }
    } catch (error) {
        console.warn("Falha na API:", error)
    } finally {
        isLoading.value = false
    }
  }

  const carregarAlunosDb = async () => {
    try {
        const response = await fetch(apiUrl('/api/alunos'))
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

        const alunosDb = await response.json()

        if (alunosDb && !alunosDb.erro) {
            alunosLocal.value = alunosDb
        }
    } catch (error) {
        console.warn("Falha na API:", error)
    } finally {
        isLoading.value = false
    }
  }

  onMounted(() => {
      carregarAulasDb()
      carregarAlunosDb()
  })

  // funções
  function deletarAula(payload) {
    const tipo = payload?.tipo || 'aula'
    const id = payload?.id ?? payload

    if (tipo === 'aluno') {
      alunosLocal.value = alunosLocal.value.filter(aluno => aluno.id !== id)
    } else {
      aulasLocal.value = aulasLocal.value.filter(aula => aula.id !== id)
    }
  }

  async function atualizarAula(aula) {
    const index = aulasLocal.value.findIndex(item => item.id === aula.id)
    if (index !== -1) aulasLocal.value[index] = aula
    else await carregarAulasDb()
    await carregarAlunosDb()
  }

  function visualizacao() {
    materias.value = materias.value === 'Aulas' ? 'Alunos' : 'Aulas';
  }

  async function sair() {
    await signOutAdmin();
    await router.replace('/login');
  }


  // ---------- Adicionar Aluno / Aula ----------
  const disciplinas = ['Teclado', 'Partitura'];
  const salvando = ref(false);

  const dialogAluno = ref(false);
  const formAluno = ref({ name: '', disciplina: '' });

  const dialogAula = ref(false);
  const formAula = ref({
    name: '', disciplina: '', topicos: '',
    videosLista: [{ nome: '', url: '' }],
    imgsLista: [{ nome: '', url: '' }],
    atividadesLista: [{ nome: '', url: '' }],
    presentes: [], visibilidade: 'todos'
  });

  // alunos da disciplina escolhida (para marcar presença)
  const alunosDaDisciplina = computed(() =>
    alunosLocal.value
      .filter(a => a.disciplina === formAula.value.disciplina)
      .map(a => a.name)
  );

  // "um item por linha" -> array (ou null se vazio)
  const linhasParaArray = (texto) => {
    const lista = (texto || '').split('\n').map(l => l.trim()).filter(Boolean);
    return lista.length ? lista : null;
  };

  function adicionarItemMidia(lista) {
    lista.push({ nome: '', url: '' });
  }

  function removerItemMidia(lista, index) {
    if (lista.length > 1) {
      lista.splice(index, 1);
    } else {
      lista[0] = { nome: '', url: '' };
    }
  }

  async function preencherTituloAutomatico(itemVideo) {
    if (itemVideo.url && !itemVideo.nome) {
      const titulo = await buscarTituloVideo(itemVideo.url);
      if (titulo && !itemVideo.nome) {
        itemVideo.nome = titulo;
      }
    }
  }

  function addAluno() {
    formAluno.value = { name: '', disciplina: disciplinaSelecionada.value || '' };
    dialogAluno.value = true;
  }

  function addAula() {
    formAula.value = {
      name: '', disciplina: disciplinaSelecionada.value || '',
      topicos: '',
      videosLista: [{ nome: '', url: '' }],
      imgsLista: [{ nome: '', url: '' }],
      atividadesLista: [{ nome: '', url: '' }],
      presentes: [], visibilidade: 'todos'
    };
    dialogAula.value = true;
  }

  async function salvarAluno() {
    const { name, disciplina } = formAluno.value;
    if (!name.trim() || !disciplina) {
      $q.notify({ type: 'warning', message: 'Preencha nome e disciplina' });
      return;
    }
    salvando.value = true;
    try {
      const response = await fetchAdmin('/api/adicionarAluno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), disciplina })
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      await carregarAlunosDb();  
      dialogAluno.value = false;
      $q.notify({ type: 'positive', message: 'Aluno adicionado!' });
    } catch (error) {
      console.warn('Falha ao adicionar aluno:', error);
      $q.notify({ type: 'negative', message: 'Erro ao adicionar aluno' });
    } finally {
      salvando.value = false;
    }
  }

  async function salvarAula() {
    const f = formAula.value;
    const topicos = linhasParaArray(f.topicos);
    if (!f.name.trim() || !f.disciplina || !topicos) {
      $q.notify({ type: 'warning', message: 'Preencha título, disciplina e tópicos' });
      return;
    }
    salvando.value = true;
    try {
      const response = await fetchAdmin('/api/adicionarAula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          disciplina: f.disciplina,
          topicos,
          video: serializarListaMidia(f.videosLista),
          imgs: serializarListaMidia(f.imgsLista.map(i => ({ nome: '', url: i.url }))),
          atividades: serializarListaMidia(f.atividadesLista),
          presentes: f.presentes,
          visibilidade: f.visibilidade || 'todos'
        })
      });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      // recarrega aulas e alunos (a frequência dos alunos muda com uma nova aula)
      await Promise.all([carregarAulasDb(), carregarAlunosDb()]);
      dialogAula.value = false;
      $q.notify({ type: 'positive', message: 'Aula adicionada!' });
    } catch (error) {
      console.warn('Falha ao adicionar aula:', error);
      $q.notify({ type: 'negative', message: 'Erro ao adicionar aula' });
    } finally {
      salvando.value = false;
    }
  }


  // filtrando dados
  const aulasFiltradas = computed(() => {
    if (!disciplinaSelecionada.value) {
      return aulasLocal.value;
    }
    return aulasLocal.value.filter(
      aula => aula.disciplina === disciplinaSelecionada.value
    );
  });

  const alunosFiltrados = computed(() => {
    if (!disciplinaSelecionada.value) {
      return alunosLocal.value;
    }
    return alunosLocal.value.filter(
      aluno => aluno.disciplina === disciplinaSelecionada.value
    );
  });

</script>

<template>
    <div class="flex flex-col items-center px-4">
      <q-btn rounded class="fixed top-5 left-5 z-50"
          label="Voltar" to="/">
      </q-btn>
      <q-btn class="fixed top-5 right-5 z-50" round flat icon="logout" @click="sair">
        <q-tooltip>Sair</q-tooltip>
      </q-btn>
  
      <div class="mt-8 w-full max-w-[1360px] flex flex-col xl:flex-row items-center xl:items-start justify-center gap-4">
        <div class="hidden xl:block xl:w-[140px] shrink-0"></div>
        <desempenho :alunos="alunosFiltrados"/>

        <div class="bg-[#a5d8ff] xl:mt-10 shrink-0" >
          <select v-model="disciplinaSelecionada" 
            class="pr-15 pl-1 pb-2 pt-2 border" name="disciplina">
            <option value="">Todas</option>
            <option value="Teclado">Teclado</option>
            <option value="Partitura">Partitura</option>
          </select>
        </div>
      </div>

      <div v-if="materias === 'Aulas'" class="mt-10 sm:mt-15 w-full max-w-[1460px]">
        <h3 class="mb-5">Aulas</h3>
        
        <div class="max-w-400 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center sm:justify-items-start gap-6 xl:gap-15 mb-30">
          <profAulas :aulas="aulasFiltradas" :alunos="alunosLocal" @deletar="deletarAula" @atualizar="atualizarAula"/>
        </div>
      </div>
      <div v-else-if="materias === 'Alunos'" class="mt-10 sm:mt-15 w-full max-w-[1460px]">
        <h3 class="mb-5">Perfil Alunos</h3>
        
        <div class="max-w-400 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center sm:justify-items-start gap-6 xl:gap-15 mb-30">
          <ProfAlunos :alunos="alunosFiltrados" @deletar="deletarAula"/>
        </div>
      </div>


    </div>

    <q-btn class="fixed z-50 bottom-10 left-10" size="xl" 
      round color="secondary" icon="settings" @click="visualizacao">
      <q-tooltip anchor="center left" self="center right">
        Mudar para {{ materias === 'Aulas' ? 'Alunos' : 'Aulas' }}
      </q-tooltip>
    </q-btn>


    <q-btn class="fixed z-50 bottom-10 right-10" size="xl" round color="secondary" icon="add">
      <q-menu anchor="top middle" self="bottom middle" 
        :offset="[0, 15]" class="bg-transparent no-shadow">

        <div class="column q-gutter-y-sm items-center">
          <!-- Superior -->
          <q-btn fab-mini color="primary" icon="control_point" 
            @click="addAula" v-close-popup>
            <q-tooltip  anchor="center left" self="center right">
              Add Aula
            </q-tooltip>
          </q-btn>


          <!-- Inferior -->
          <q-btn fab-mini color="primary" icon="person_add_alt" 
            @click="addAluno" v-close-popup >
            <q-tooltip  anchor="center left" self="center right">
              Add Aluno
            </q-tooltip>
          </q-btn>
          
        </div>
      </q-menu>

    </q-btn>

    <!-- Dialog: Add Aluno -->
    <q-dialog v-model="dialogAluno">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Adicionar Aluno</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input v-model="formAluno.name" label="Nome do aluno" outlined autofocus
            @keyup.enter="salvarAluno" />
          <q-select v-model="formAluno.disciplina" :options="disciplinas"
            behavior="menu" label="Disciplina" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Salvar" :loading="salvando" @click="salvarAluno" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog: Add Aula -->
    <q-dialog v-model="dialogAula">
      <q-card style="min-width: 320px; width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Adicionar Aula</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md scroll" style="max-height: 70vh">
          <q-input v-model="formAula.name" label="Título da aula" outlined autofocus />
          <q-select v-model="formAula.disciplina" :options="disciplinas"
            label="Disciplina" outlined @update:model-value="formAula.presentes = []" />
          <q-select
            v-model="formAula.visibilidade"
            :options="[
              { label: 'Alunos', value: 'todos' },
              { label: 'Apenas professor', value: 'professor' }
            ]"
            emit-value
            map-options
            behavior="menu"
            label="Visibilidade"
            outlined
          />
          <q-input v-model="formAula.topicos" type="textarea" autogrow outlined
            label="Tópicos (um por linha)" />

          <div class="border border-gray-300 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-medium text-sm text-gray-700">Vídeos (opcional)</span>
              <q-btn flat dense size="sm" color="primary" icon="add" label="Adicionar vídeo" @click="adicionarItemMidia(formAula.videosLista)" />
            </div>
            <div v-for="(vid, idx) in formAula.videosLista" :key="idx" class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gray-50 p-2 rounded-lg">
              <q-input v-model="vid.nome" dense outlined label="Nome do vídeo (opcional)" class="sm:w-2/5" />
              <q-input v-model="vid.url" dense outlined label="Link do vídeo" class="flex-1" @blur="preencherTituloAutomatico(vid)" />
              <q-btn flat round dense color="negative" icon="delete" @click="removerItemMidia(formAula.videosLista, idx)" />
            </div>
          </div>

          <div class="border border-gray-300 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-medium text-sm text-gray-700">Imagens (opcional)</span>
              <q-btn flat dense size="sm" color="primary" icon="add" label="Adicionar imagem" @click="adicionarItemMidia(formAula.imgsLista)" />
            </div>
            <div v-for="(img, idx) in formAula.imgsLista" :key="idx" class="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
              <q-input v-model="img.url" dense outlined label="Link da imagem" class="flex-1" />
              <img v-if="img.url" :src="img.url" alt="Prévia" class="w-10 h-10 object-cover rounded border" />
              <q-btn flat round dense color="negative" icon="delete" @click="removerItemMidia(formAula.imgsLista, idx)" />
            </div>
          </div>

          <div class="border border-gray-300 rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-medium text-sm text-gray-700">Atividades (opcional)</span>
              <q-btn flat dense size="sm" color="primary" icon="add" label="Adicionar atividade" @click="adicionarItemMidia(formAula.atividadesLista)" />
            </div>
            <div v-for="(ativ, idx) in formAula.atividadesLista" :key="idx" class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-gray-50 p-2 rounded-lg">
              <q-input v-model="ativ.nome" dense outlined label="Nome do arquivo (opcional)" class="sm:w-2/5" />
              <q-input v-model="ativ.url" dense outlined label="Link da atividade" class="flex-1" />
              <q-btn flat round dense color="negative" icon="delete" @click="removerItemMidia(formAula.atividadesLista, idx)" />
            </div>
          </div>

          <q-select v-model="formAula.presentes" :options="alunosDaDisciplina"
            multiple use-chips outlined behavior="menu" label="Alunos presentes"
            :hint="formAula.disciplina ? '' : 'Escolha a disciplina primeiro'" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Salvar" :loading="salvando" @click="salvarAula" />
        </q-card-actions>
      </q-card>
    </q-dialog>

</template>
