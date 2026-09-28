<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { apiUrl } from '../../api';
  import { fetchAdmin, signOutAdmin } from '../../auth';
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
        const response = await fetch(apiUrl('/api/aulas'))
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
    name: '', disciplina: '', topicos: '', video: '', imgs: '', atividades: '', presentes: []
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

  function addAluno() {
    formAluno.value = { name: '', disciplina: disciplinaSelecionada.value || '' };
    dialogAluno.value = true;
  }

  function addAula() {
    formAula.value = {
      name: '', disciplina: disciplinaSelecionada.value || '',
      topicos: '', video: '', imgs: '', atividades: '', presentes: []
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
          video: f.video.trim() || null,
          imgs: linhasParaArray(f.imgs),
          atividades: linhasParaArray(f.atividades),
          presentes: f.presentes
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
    <div class="flex flex-col items-center">
      <q-btn rounded class="fixed top-5 left-5 z-50"
          label="Voltar" to="/">
      </q-btn>
      <q-btn class="fixed top-5 right-5 z-50" round flat icon="logout" @click="sair">
        <q-tooltip>Sair</q-tooltip>
      </q-btn>
  
      <div class="mt-8 w-full flex justify-center">
        <desempenho :alunos="alunosFiltrados"/>

      </div>
      
      <div class="fixed top-20 right-70 bg-[#a5d8ff]" >
        <select v-model="disciplinaSelecionada" 
          class="pr-15 pl-1 pb-2 pt-2 border" name="disciplina">
          <option value="">Todas</option>
          <option value="Teclado">Teclado</option>
          <option value="Partitura">Partitura</option>
        </select>
      </div>

      <div v-if="materias === 'Aulas'" class="mt-15 ml-30">
        <h3 class="mb-5 mr-300">Aulas</h3>
        
        <div class="max-w-400 w-full flex flex-row gap-15 mb-30">
          <profAulas :aulas="aulasFiltradas" :alunos="alunosLocal" @deletar="deletarAula"/>
        </div>
      </div>
      <div v-else-if="materias === 'Alunos'" class="mt-15 ml-30">
        <h3 class="mb-5 mr-300">Perfil Alunos</h3>
        
        <div class="max-w-400 w-full flex flex-row gap-15 mb-30">
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
      <q-card style="min-width: 450px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Adicionar Aula</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md scroll" style="max-height: 70vh">
          <q-input v-model="formAula.name" label="Título da aula" outlined autofocus />
          <q-select v-model="formAula.disciplina" :options="disciplinas"
            label="Disciplina" outlined @update:model-value="formAula.presentes = []" />
          <q-input v-model="formAula.topicos" type="textarea" autogrow outlined
            label="Tópicos (um por linha)" />
          <q-input v-model="formAula.video" outlined label="Link do vídeo (opcional)" />
          <q-input v-model="formAula.imgs" type="textarea" autogrow outlined
            label="Links das imagens (um por linha, opcional)" />
          <q-input v-model="formAula.atividades" type="textarea" autogrow outlined
            label="Atividades (uma por linha, opcional)" />
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