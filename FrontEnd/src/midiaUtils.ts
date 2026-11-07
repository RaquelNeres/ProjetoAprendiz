// Utilitários para manipulação de múltiplos vídeos, imagens e atividades das aulas

export interface ItemMidia {
  nome: string
  url: string
}

// Cache em memória para títulos de vídeos buscados via oEmbed
const cacheTitulosVideo = new Map<string, string>()

/**
 * Extrai o nome do arquivo ou identificador legível a partir de uma URL
 */
export function extrairNomeDaUrl(url: string, prefixoPadrao = 'Arquivo'): string {
  if (!url) return prefixoPadrao
  try {
    const urlObj = new URL(url.trim())
    const partesCaminho = urlObj.pathname.split('/').filter(Boolean)
    const ultimoSegmento = partesCaminho[partesCaminho.length - 1]

    if (ultimoSegmento && ultimoSegmento !== 'watch') {
      return decodeURIComponent(ultimoSegmento)
    }

    // Caso seja link do YouTube com parâmetro v=
    const videoId = urlObj.searchParams.get('v')
    if (videoId) {
      return `Vídeo (${videoId})`
    }

    return urlObj.hostname.replace(/^www\./, '')
  } catch {
    const partes = url.split('/').filter(Boolean)
    return partes[partes.length - 1] || prefixoPadrao
  }
}

/**
 * Converte qualquer formato vindo do banco (string única, múltiplas linhas, array Postgres, JSON ou Array)
 * em uma lista padronizada de objetos { nome, url }
 */
export function extrairListaMidia(valor: unknown, definirNomeAutomatico = false): ItemMidia[] {
  if (!valor) return []

  let linhasBrutas: unknown[] = []

  if (Array.isArray(valor)) {
    linhasBrutas = valor
  } else if (typeof valor === 'string') {
    const texto = valor.trim()
    if (!texto) return []

    // Verifica se é um JSON array
    if (texto.startsWith('[') && texto.endsWith(']')) {
      try {
        const parsed = JSON.parse(texto)
        if (Array.isArray(parsed)) {
          linhasBrutas = parsed
        }
      } catch {
        linhasBrutas = texto.split('\n')
      }
    } else if (texto.startsWith('{') && texto.endsWith('}')) {
      // Formato de array do PostgreSQL convertido em texto: {"url1","url2"}
      const conteudo = texto.slice(1, -1)
      linhasBrutas = conteudo
        .split(',')
        .map(item => item.trim().replace(/^"(.*)"$/, '$1'))
    } else {
      // Múltiplas linhas separadas por quebra de linha
      linhasBrutas = texto.split('\n')
    }
  }

  const resultado: ItemMidia[] = []

  for (const item of linhasBrutas) {
    if (!item) continue

    if (typeof item === 'object' && item !== null && 'url' in item) {
      const obj = item as { nome?: string; url?: string }
      const urlLimpa = (obj.url || '').trim()
      if (!urlLimpa) continue
      const nomeLimpo = (obj.nome || '').trim() || (definirNomeAutomatico ? extrairNomeDaUrl(urlLimpa) : '')
      resultado.push({ nome: nomeLimpo, url: urlLimpa })
    } else if (typeof item === 'string') {
      const linha = item.trim()
      if (!linha) continue

      // Suporta o formato "Nome personalizado | https://url..."
      if (linha.includes(' | ')) {
        const indiceSeparador = linha.lastIndexOf(' | ')
        const nomeParte = linha.slice(0, indiceSeparador).trim()
        const urlParte = linha.slice(indiceSeparador + 3).trim()
        if (urlParte) {
          resultado.push({
            nome: nomeParte || (definirNomeAutomatico ? extrairNomeDaUrl(urlParte) : ''),
            url: urlParte
          })
        }
      } else {
        resultado.push({
          nome: definirNomeAutomatico ? extrairNomeDaUrl(linha) : '',
          url: linha
        })
      }
    }
  }

  return resultado
}

/**
 * Serializa uma lista de itens { nome, url } em uma string separada por quebras de linha
 * compatível com o banco de dados PostgreSQL
 */
export function serializarListaMidia(itens: ItemMidia[]): string | null {
  if (!Array.isArray(itens)) return null

  const linhas = itens
    .map(item => {
      const url = (item?.url || '').trim()
      const nome = (item?.nome || '').trim()
      if (!url) return ''
      return nome ? `${nome} | ${url}` : url
    })
    .filter(Boolean)

  return linhas.length > 0 ? linhas.join('\n') : null
}

/**
 * Busca o título real de um vídeo (YouTube, Vimeo, etc.) usando o serviço público noembed
 */
export async function buscarTituloVideo(url: string): Promise<string> {
  const urlLimpa = (url || '').trim()
  if (!urlLimpa) return 'Vídeo'

  if (cacheTitulosVideo.has(urlLimpa)) {
    return cacheTitulosVideo.get(urlLimpa)!
  }

  try {
    const resposta = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(urlLimpa)}`)
    if (resposta.ok) {
      const dados = await resposta.json()
      if (dados && typeof dados.title === 'string' && dados.title.trim()) {
        const titulo = dados.title.trim()
        cacheTitulosVideo.set(urlLimpa, titulo)
        return titulo
      }
    }
  } catch {
    // Silencia erro de rede e usa fallback
  }

  const fallback = extrairNomeDaUrl(urlLimpa, 'Vídeo')
  cacheTitulosVideo.set(urlLimpa, fallback)
  return fallback
}
