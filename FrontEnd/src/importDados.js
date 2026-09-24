// src/stores/cursoStore.js
import { reactive } from 'vue'

export const cursoState = reactive({
  aulas: [
    // --- PARTITURA ---
    { 
      id: 1, 
      name: "Partitura 1: Clave de Sol e Figuras Rítmicas", 
      disciplina: "Partitura", 
      topicos: ["Clave de Sol", "Semibreve e Mínima", "Linhas e Espaços"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Maria", "Carlos", "Fernanda"] 
    },
    { 
      id: 2, 
      name: "Partitura 2: Clave de Fá e Semínimas", 
      disciplina: "Partitura", 
      topicos: ["Clave de Fá", "Pauta dupla", "Semínima e Pausas"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Maria", "Juliana", "Carlos"] 
    },
    { 
      id: 3, 
      name: "Partitura 3: Armadura de Clave e Acidentes", 
      disciplina: "Partitura", 
      topicos: ["Sustenidos", "Bemóis", "Bequadro", "Tonalidades"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Maria", "Fernanda", "Juliana"] 
    },

    // --- TECLADO ---
    { 
      id: 4, 
      name: "Teclado 1: Postura, Digitação e Dó Central", 
      disciplina: "Teclado", 
      topicos: ["Dó Central", "Numeração dos dedos", "Exercícios de 5 dedos"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Joao", "Camila", "Lucas"] 
    },
    { 
      id: 5, 
      name: "Teclado 2: Primeiros Acordes Maiores", 
      disciplina: "Teclado", 
      topicos: ["Tríades maiores", "Acordes C, F e G", "Mão esquerda na base"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Joao", "Rafael", "Camila"] 
    },
    { 
      id: 6, 
      name: "Teclado 3: Independência das Mãos e Inversões", 
      disciplina: "Teclado", 
      topicos: ["Inversão de acordes", "Coordenação motora", "Levada pop"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Joao", "Lucas", "Rafael"] 
    }
  ],
  alunos: [
    // Alunos de Teclado
    { id: 1, name: "Joao", senha: "1234", disciplina: "Teclado", frequencia: 85 },
    { id: 3, name: "Camila", senha: "camila2024", disciplina: "Teclado", frequencia: 90 },
    { id: 4, name: "Lucas", senha: "lucas_key", disciplina: "Teclado", frequencia: 75 },
    { id: 5, name: "Rafael", senha: "rafapiano", disciplina: "Teclado", frequencia: 65 },

    // Alunos de Partitura
    { id: 2, name: "Maria", senha: "4321", disciplina: "Partitura", frequencia: 95 },
    { id: 6, name: "Carlos", senha: "carlos_part", disciplina: "Partitura", frequencia: 80 },
    { id: 7, name: "Fernanda", senha: "fer_musica", disciplina: "Partitura", frequencia: 70 },
    { id: 8, name: "Juliana", senha: "ju_solfa", disciplina: "Partitura", frequencia: 85 }
  ]
})