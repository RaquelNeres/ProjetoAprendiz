// src/stores/cursoStore.js
import { reactive } from 'vue'

export const cursoState = reactive({
  aulas: [
    { 
      id: 1, 
      name: "Aula Partitura", 
      disciplina: "Partitura", 
      topicos: ["tag1", "tag2"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Joao", "Maria"] 
    },
    { 
      id: 2, 
      name: "Aula Teclado", 
      disciplina: "Teclado", 
      topicos: ["tag1", "tag2"], 
      video: "https://www.youtube.com/watch?v=0slN9AKaD_4", 
      imgs: "https://dailyverses.net/images/pt/arc/salmos-32-8-3.jpg", 
      atividades: "https://www.superpartituras.com/Content/demonstracoes/apostila-1.jpg", 
      presentes: ["Joao", "Maria"] 
    }
  ],
  alunos: [
    { id: 1, name: "Joao", senha: "1234", frequencia: 75 },
    { id: 2, name: "Maria", senha: "4321", frequencia: 60 }
  ]
})