import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Index from './views/Index.vue'
import Professor from '../src/views/Professor/Home.vue'
import Aluno from '../src/views/Alunos/Aluno.vue'
import Disciplina from '../src/views/Alunos/Disciplina.vue'
import Login from './views/Professor/Login.vue'
// import Erro from './views/Professor/Erro.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  { 
    path: '/professor', 
    name: 'Professor',
    component: Professor,
  },
  { 
    path: '/aluno', 
    name: 'Aluno',
    component: Aluno 
  },
  {
    path: '/:disciplina',
    name: 'Disciplina',
    component: Disciplina
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router