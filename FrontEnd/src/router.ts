import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import Home from '../src/App.vue'
import Index from './views/Index.vue'
import Professor from '../src/views/Professor/Home.vue'
import Aluno from '../src/views/Alunos/Home.vue'
import Login from './views/Professor/Login.vue'
import Erro from './views/Professor/Erro.vue'
import Teclado from './views/Alunos/Teclado.vue'
import Partitura from './views/Alunos/Partitura.vue'

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
    path: '/erro',
    name: 'Erro',
    component: Erro
  },
  { 
    path: '/professor', 
    name: 'Professor',
    component: Professor 
  },
  { 
    path: '/aluno', 
    name: 'Aluno',
    component: Aluno 
  },
  {
    path: '/teclado',
    name: 'Teclado',
    component: Teclado
  },
  {
    path: '/partitura',
    name: 'Partitura',
    component: Partitura
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router