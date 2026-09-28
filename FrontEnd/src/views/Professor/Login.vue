<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authReady, requestPasswordReset, resetPassword, signInAdmin } from '../../auth'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const submitting = ref(false)
const resetLinkExpired = route.query.error === 'INVALID_TOKEN'
const errorMessage = ref(resetLinkExpired
  ? 'O link de redefinição está inválido ou expirou. Solicite outro.'
  : '')
const successMessage = ref('')
const mode = ref<'login' | 'forgot' | 'reset'>(
  typeof route.query.token === 'string' ? 'reset' : resetLinkExpired ? 'forgot' : 'login'
)

async function entrar() {
  errorMessage.value = ''
  successMessage.value = ''
  submitting.value = true

  try {
    await signInAdmin(email.value.trim(), password.value)
    const destination = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/professor'
    await router.replace(destination)
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Não foi possível entrar. Confira seus dados e tente novamente.'
  } finally {
    submitting.value = false
  }
}

async function solicitarRedefinicao() {
  errorMessage.value = ''
  successMessage.value = ''
  submitting.value = true

  try {
    await requestPasswordReset(email.value.trim(), `${window.location.origin}/login`)
    successMessage.value = 'Se o email estiver cadastrado, enviaremos um link para redefinir a senha.'
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Não foi possível solicitar a redefinição da senha.'
  } finally {
    submitting.value = false
  }
}

async function salvarNovaSenha() {
  errorMessage.value = ''
  successMessage.value = ''

  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    errorMessage.value = 'O link de redefinição está inválido ou expirou. Solicite outro.'
    return
  }
  if (newPassword.value.length < 8) {
    errorMessage.value = 'A nova senha precisa ter pelo menos 8 caracteres.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }

  submitting.value = true
  try {
    await resetPassword(token, newPassword.value)
    await router.replace({ name: 'Login' })
    mode.value = 'login'
    newPassword.value = ''
    confirmPassword.value = ''
    successMessage.value = 'Senha redefinida. Entre com a nova senha.'
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Não foi possível redefinir a senha. Solicite um novo link.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-layout">
      <section class="login-intro" aria-labelledby="login-title">
        <div class="brand-mark" aria-hidden="true">
          <q-icon name="music_note" size="30px" />
        </div>
        <p class="login-kicker">Q-Acadêmico Web</p>
        <h1 id="login-title">Área do professor</h1>
        <p class="intro-copy">Aulas, alunos e acompanhamento em um só lugar.</p>
        <div class="access-note">
          <span class="access-dot"></span>
          Acesso privado
        </div>
      </section>

      <section class="login-panel" aria-labelledby="form-title">
        <div class="panel-heading">
          <div>
            <p class="login-kicker">{{ mode === 'login' ? 'Bem-vinda de volta' : 'Acesso à conta' }}</p>
            <h2 id="form-title">
              {{ mode === 'login' ? 'Entrar' : mode === 'forgot' ? 'Recuperar senha' : 'Nova senha' }}
            </h2>
          </div>
          <q-icon class="lock-icon" name="lock_outline" size="22px" aria-hidden="true" />
        </div>

        <p v-if="!authReady" class="form-error" role="alert">
          Configure VITE_NEON_AUTH_URL e VITE_ADMIN_USER_ID para ativar o acesso.
        </p>

        <form v-else-if="mode === 'login'" class="login-form" @submit.prevent="entrar">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="username"
            placeholder="voce@exemplo.com"
            required
          />

          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Sua senha"
            required
          />

          <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

          <button class="submit-button" type="submit" :disabled="submitting">
            <q-spinner v-if="submitting" size="18px" />
            <span>{{ submitting ? 'Verificando...' : 'Acessar painel' }}</span>
            <q-icon v-if="!submitting" name="arrow_forward" size="18px" />
          </button>
          <button class="text-button" type="button" @click="mode = 'forgot'; errorMessage = ''; successMessage = ''">
            Esqueci minha senha
          </button>
        </form>

        <form v-else-if="mode === 'forgot'" class="login-form" @submit.prevent="solicitarRedefinicao">
          <p class="form-description">Informe o email da conta para receber um link de redefinição.</p>
          <label for="reset-email">Email</label>
          <input
            id="reset-email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="voce@exemplo.com"
            required
          />
          <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
          <p v-if="successMessage" class="form-success" role="status">{{ successMessage }}</p>
          <button class="submit-button" type="submit" :disabled="submitting">
            <q-spinner v-if="submitting" size="18px" />
            <span>{{ submitting ? 'Enviando...' : 'Enviar link' }}</span>
            <q-icon v-if="!submitting" name="mail_outline" size="18px" />
          </button>
          <button class="text-button" type="button" @click="mode = 'login'; errorMessage = ''; successMessage = ''">
            Voltar ao login
          </button>
        </form>

        <form v-else class="login-form" @submit.prevent="salvarNovaSenha">
          <p class="form-description">Escolha uma nova senha para sua conta.</p>
          <label for="new-password">Nova senha</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            autocomplete="new-password"
            minlength="8"
            required
          />
          <label for="confirm-password">Confirmar nova senha</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            minlength="8"
            required
          />
          <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
          <button class="submit-button" type="submit" :disabled="submitting">
            <q-spinner v-if="submitting" size="18px" />
            <span>{{ submitting ? 'Salvando...' : 'Salvar nova senha' }}</span>
            <q-icon v-if="!submitting" name="check" size="18px" />
          </button>
        </form>

        <p v-if="mode === 'login' && successMessage" class="form-success" role="status">
          {{ successMessage }}
        </p>

        <p class="panel-footnote">Área restrita à conta administradora.</p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  --ink: #242923;
  --muted: #6c7168;
  --paper: #f7f7f1;
  --line: #d9ddd1;
  --green: #516a52;
  --coral: #c7654f;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px 24px;
  color: var(--ink);
  background-color: var(--paper);
  background-image: repeating-linear-gradient(0deg, transparent 0 31px, #616d5209 32px);
  font-family: Georgia, 'Times New Roman', serif;
}

.login-layout {
  width: min(100%, 1000px);
  min-height: 560px;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  align-items: center;
  gap: clamp(40px, 8vw, 100px);
}

.login-intro {
  padding: 24px 0;
}

.brand-mark {
  width: 58px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 1px solid var(--green);
  border-radius: 50%;
  color: var(--green);
}

.login-kicker {
  margin: 0;
  color: var(--green);
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.login-intro .login-kicker {
  margin-top: 30px;
}

.login-intro h1 {
  max-width: 480px;
  margin: 12px 0 16px;
  font-size: 62px;
  font-weight: 400;
  line-height: 1.04;
}

.intro-copy {
  max-width: 330px;
  margin: 0;
  color: var(--muted);
  font-size: 18px;
  line-height: 1.6;
}

.access-note {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 48px;
  color: var(--muted);
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 13px;
}

.access-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--coral);
}

.login-panel {
  padding: 48px;
  border: 1px solid var(--line);
  border-top: 3px solid var(--green);
  background: #fffefa;
  box-shadow: 0 18px 48px #303b2610;
}

.panel-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 34px;
}

.panel-heading h2 {
  margin: 8px 0 0;
  font-size: 34px;
  font-weight: 400;
}

.lock-icon {
  color: var(--green);
}

.login-form {
  display: grid;
  gap: 10px;
}

.login-form label {
  margin-top: 10px;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 13px;
  font-weight: 700;
}

.login-form input {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 3px;
  outline: none;
  background: white;
  color: var(--ink);
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 15px;
}

.login-form input:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px #516a521c;
}

.submit-button {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  border: 0;
  border-radius: 3px;
  background: var(--green);
  color: white;
  cursor: pointer;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 14px;
  font-weight: 700;
}

.submit-button:hover:not(:disabled) {
  background: #405541;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.form-error {
  margin: 16px 0 0;
  color: #a43f35;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

.form-success,
.form-description {
  margin: 8px 0;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 13px;
  line-height: 1.5;
}

.form-success {
  color: var(--green);
}

.form-description {
  color: var(--muted);
}

.text-button {
  justify-self: start;
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--green);
  cursor: pointer;
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.panel-footnote {
  margin: 28px 0 0;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 12px;
}

@media (max-width: 700px) {
  .login-page {
    padding: 28px 18px;
  }

  .login-layout {
    min-height: auto;
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .login-intro {
    padding: 0;
  }

  .login-intro .login-kicker {
    margin-top: 18px;
  }

  .login-intro h1 {
    font-size: 42px;
  }

  .intro-copy {
    font-size: 16px;
  }

  .access-note {
    margin-top: 20px;
  }

  .login-panel {
    padding: 28px;
  }
}
</style>