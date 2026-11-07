<template>

    <div v-if="aulas.length" v-for="aula in aulas" :key="aula.id" 
        class="mb-2 bg-[#a5d8ff] 
            border-2 rounded-2xl pb-5 pt-5 mt-5
            border-b-5 border-r-5">

        <details class="">
            <summary class="text-2xl sm:text-4xl ml-5"><q-icon name="expand_more" class="rounded-full bg-amber-300 border"/> {{ aula.name }}</summary>

            <div class="bg-amber-50 border rounded-2xl ml-5 mt-5 mr-5 pb-8">
                <div v-if="aula.topicos" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl border-b-4 border-r-4 bg-blue-50 border"/> 
                        Assuntos abordados
                    </h4>
                    <!-- <ul></ul>  pra tirar o ponto antes -->
                    <li v-for="topico in aula.topicos" class="ml-6 sm:ml-15 mt-1">{{ topico }}</li>
                </div>
    
                <div v-if="obterVideos(aula).length" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl  border-b-4 border-r-4 bg-blue-50 border"/> 
                        Videos
                    </h4>
                    <div class="ml-6 sm:ml-17 flex flex-wrap gap-3">
                        <a v-for="(video, idx) in obterVideos(aula)" :key="idx"
                           class="border border-blue-300 rounded-lg pt-2 pb-2 pr-5 pl-5 inline-block"  
                           :href="video.url" target="_blank" rel="noopener noreferrer">
                            {{ obterTituloExibicaoVideo(video) }}
                        </a>
                    </div>
                </div>
    
                <div v-if="obterImagens(aula).length" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl  border-b-4 border-r-4 bg-blue-50 border"/> 
                        Imagens</h4>
                    <div class="ml-6 sm:ml-17 flex flex-wrap gap-4">
                        <img v-for="(img, idx) in obterImagens(aula)" :key="idx"
                             :src="img.url" :alt="img.nome"
                             class="max-h-48 w-auto rounded-lg border border-blue-300 cursor-pointer"
                             @click="maximizarImagem(img)" />
                    </div>
                </div>
    
                <div v-if="obterAtividades(aula).length" class="mt-5">
                    <h4 class="ml-5 mt-3 mb-5">
                        <q-icon name="keyboard_arrow_right" 
                        class="rounded-xl  border-b-4 border-r-4 bg-blue-50 border"/> 
                        Atividades
                    </h4>
                    <div class="ml-6 sm:ml-17 flex flex-wrap gap-3">
                        <a v-for="(ativ, idx) in obterAtividades(aula)" :key="idx"
                           class="border border-blue-300 rounded-lg pt-2 pb-2 pr-5 pl-5 inline-block" 
                           :href="ativ.url" target="_blank" rel="noopener noreferrer">
                            {{ ativ.nome }}
                        </a>
                    </div>
                </div>
            </div>
        </details>

    </div>

    <q-dialog v-model="modalImagemAberto">
      <q-card class="bg-white rounded-2xl overflow-hidden" style="max-width: 92vw; max-height: 92vh;">
        <q-card-section class="flex items-center justify-between py-3 px-4 border-b">
          <span class="font-medium truncate max-w-[60vw]">
            {{ imagemMaximizada?.nome || 'Imagem' }}
          </span>
          <div class="flex items-center gap-2">
            <q-btn
              color="primary"
              icon="download"
              label="Baixar"
              size="sm"
              :loading="baixandoImagem"
              @click="baixarImagem(imagemMaximizada)"
            />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="p-4 flex items-center justify-center">
          <img
            v-if="imagemMaximizada"
            :src="imagemMaximizada.url"
            :alt="imagemMaximizada.nome"
            class="max-w-[85vw] max-h-[75vh] object-contain"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup>
    import { ref, watch } from 'vue'
    import {
      extrairListaMidia,
      extrairNomeDaUrl,
      buscarTituloVideo
    } from '../midiaUtils'

    const props = defineProps({
       aulas: Array
    })

    const titulosVideos = ref({})
    const modalImagemAberto = ref(false)
    const imagemMaximizada = ref(null)
    const baixandoImagem = ref(false)

    function obterVideos(aula) {
      return extrairListaMidia(aula?.video, false)
    }

    function obterImagens(aula) {
      return extrairListaMidia(aula?.imgs, true)
    }

    function obterAtividades(aula) {
      return extrairListaMidia(aula?.atividades, true)
    }

    function obterTituloExibicaoVideo(video) {
      if (video.nome && video.nome.trim()) {
        return video.nome.trim()
      }
      return titulosVideos.value[video.url] || extrairNomeDaUrl(video.url, 'Vídeo')
    }

    async function carregarTitulosDosVideos() {
      if (!Array.isArray(props.aulas)) return
      for (const aula of props.aulas) {
        const listaVideos = obterVideos(aula)
        for (const video of listaVideos) {
          if (!video.nome && video.url && !titulosVideos.value[video.url]) {
            buscarTituloVideo(video.url).then(titulo => {
              titulosVideos.value = {
                ...titulosVideos.value,
                [video.url]: titulo
              }
            })
          }
        }
      }
    }

    watch(() => props.aulas, () => {
      carregarTitulosDosVideos()
    }, { immediate: true, deep: true })

    function maximizarImagem(img) {
      imagemMaximizada.value = img
      modalImagemAberto.value = true
    }

    async function baixarImagem(img) {
      if (!img || !img.url) return
      baixandoImagem.value = true
      const nomeArquivo = img.nome || extrairNomeDaUrl(img.url, 'imagem.jpg')

      try {
        const resposta = await fetch(img.url, { mode: 'cors' })
        if (!resposta.ok) throw new Error('Falha ao buscar imagem')
        const blob = await resposta.blob()
        const blobUrl = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = nomeArquivo
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
      } catch {
        const link = document.createElement('a')
        link.href = img.url
        link.download = nomeArquivo
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } finally {
        baixandoImagem.value = false
      }
    }
    
</script>
