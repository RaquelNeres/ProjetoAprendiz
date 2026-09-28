import { ref } from 'vue'
import { createInternalNeonAuth } from '@neondatabase/neon-js/auth'

type AuthUser = {
  id: string
  email: string
  role?: string
}

const authUrl = import.meta.env.VITE_NEON_AUTH_URL
const adminUserId = import.meta.env.VITE_ADMIN_USER_ID

export const authReady = Boolean(authUrl && adminUserId)
const neonAuth = authUrl ? createInternalNeonAuth(authUrl) : null
export const authClient = neonAuth?.adapter ?? null
export const currentUser = ref<AuthUser | null>(null)

export function isAdmin(user: AuthUser | null = currentUser.value) {
  return Boolean(user && user.id === adminUserId && user.role === 'admin')
}

export async function loadSessionUser() {
  if (!authClient) {
    currentUser.value = null
    return null
  }

  try {
    const result = await authClient.getSession()
    currentUser.value = (result.data?.user as AuthUser | undefined) ?? null
    return currentUser.value
  } catch {
    currentUser.value = null
    return null
  }
}

export async function signInAdmin(email: string, password: string) {
  if (!authClient || !authReady) {
    throw new Error('Configure a URL do Neon Auth e o ID do administrador.')
  }

  const result = await authClient.signIn.email({ email, password })
  if (result.error) throw new Error(result.error.message)

  const user = await loadSessionUser()
  if (!isAdmin(user)) {
    await authClient.signOut()
    currentUser.value = null
    throw new Error('Esta conta não tem permissão para acessar a área do professor.')
  }

  return user
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  if (!authClient || !authReady) {
    throw new Error('Configure o Neon Auth antes de redefinir a senha.')
  }

  const result = await authClient.requestPasswordReset({ email, redirectTo })
  if (result.error) throw new Error(result.error.message)
}

export async function resetPassword(token: string, newPassword: string) {
  if (!authClient) throw new Error('Neon Auth não está configurado.')

  const result = await authClient.resetPassword({ token, newPassword })
  if (result.error) throw new Error(result.error.message)
}

export async function signOutAdmin() {
  await authClient?.signOut()
  currentUser.value = null
}

export async function fetchAdmin(input: RequestInfo | URL, init: RequestInit = {}) {
  const user = currentUser.value ?? await loadSessionUser()
  if (!authClient || !isAdmin(user)) {
    throw new Error('Sua sessão administrativa expirou. Entre novamente.')
  }

  const token = await neonAuth?.getJWTToken()
  if (!token) throw new Error('Não foi possível validar sua sessão. Entre novamente.')

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return fetch(input, { ...init, headers })
}