import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
// import Home from '../src/App.vue'
import Index from './views/Index.vue'
import Professor from '../src/views/Professor/Home.vue'
import Aluno from '../src/views/Alunos/Home.vue'
import Login from './views/Alunos/Login.vue'
import Erro from './views/Professor/Erro.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router