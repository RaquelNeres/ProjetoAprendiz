import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Index from './views/Index.vue'
import Professor from '../src/views/Professor/Home.vue'
import Aluno from '../src/views/Alunos/Aluno.vue'
import Disciplina from '../src/views/Alunos/Disciplina.vue'
import Login from './views/Professor/Login.vue'
import { isAdmin, loadSessionUser } from './auth'
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
    meta: { requiresAdmin: true },
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

router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin && to.name !== 'Login') return true

  const user = await loadSessionUser()
  const admin = isAdmin(user)

  if (to.meta.requiresAdmin && !admin) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'Login' && admin) {
    return typeof to.query.redirect === 'string' ? to.query.redirect : { name: 'Professor' }
  }

  return true
})

export default router