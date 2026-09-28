# Projeto Aprendiz

## Implantacao na Vercel

Crie dois projetos Vercel usando este mesmo repositorio, cada um com seu proprio **Root Directory**:

- Frontend: `FrontEnd` (Vercel detecta Vite; comando de build `npm run build`, saida `dist`).
- Backend: `BackEnd` (usa a configuracao `vercel.json` desta pasta).

Configure estas variaveis no projeto **BackEnd**:

- `DATABASE_URL`
- `NEON_AUTH_BASE_URL`
- `ADMIN_USER_ID`

Configure estas variaveis no projeto **FrontEnd**:

- `VITE_API_URL`: URL publica do projeto Backend, sem `/` no final.
- `VITE_NEON_AUTH_URL`: URL do Neon Auth.
- `VITE_ADMIN_USER_ID`: ID do usuario administrador.

Inclua o dominio publicado do FrontEnd nas origens permitidas do Neon Auth. Depois de alterar variaveis `VITE_*`, crie um novo deploy para incorpora-las ao build.

## Desenvolvimento local

O frontend usa o proxy do Vite para encaminhar `/api` a `http://localhost:3000`. Inicie o backend com `npm run dev` dentro de `BackEnd` e o frontend com `npm run dev` dentro de `FrontEnd`.
