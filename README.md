# Projeto Aprendiz

Aplicação web desenvolvida para facilitar a gestão de aulas, alunos, frequência e conteúdos do **Projeto Aprendiz**, iniciativa em que voluntários compartilham conhecimentos por meio de aulas.

O projeto surgiu da necessidade de substituir um controle que anteriormente era realizado manualmente através do Google Docs por uma aplicação centralizada e mais organizada.

## Sobre o projeto

O Projeto Aprendiz possui diferentes áreas de acesso para professores e alunos.

A área do professor permite gerenciar as aulas, alunos, conteúdos e frequência. Já os alunos podem acessar as aulas e consultar os materiais disponibilizados pelos professores.

Antes do desenvolvimento, as principais telas e fluxos da aplicação foram planejados utilizando o **Excalidraw**, permitindo estruturar a experiência antes da implementação.

## Funcionalidades

### Professor

- Cadastro e gerenciamento de alunos;
- Cadastro e gerenciamento de aulas;
- Organização das aulas por disciplina;
- Controle de frequência;
- Edição e exclusão de aulas;
- Adição de tópicos, vídeos e imagens aos conteúdos;
- Visualização do desempenho e frequência dos alunos.

### Aluno

- Visualização das aulas disponíveis;
- Acesso aos conteúdos das aulas;
- Visualização de tópicos abordados;
- Acesso a vídeos e imagens disponibilizados pelo professor;
- Conteúdos organizados por disciplina.

## Tecnologias

### Front-end

- **Vue.js** — construção da interface e componentes;
- **Quasar Framework** — componentes de interface e recursos para desenvolvimento da aplicação;
- **JavaScript**;
- **Vite** — ferramenta de build e desenvolvimento;
- **HTML5**;
- **Tailwind**.

### Back-end

- **Node.js**;
- **Express.js**;
- **JavaScript**;
- **Neon PostgreSQL** — banco de dados;
- **Neon Auth** — autenticação e gerenciamento de usuários.

### Ferramentas e serviços

- **Git e GitHub** — versionamento e hospedagem do código;
- **Vercel** — hospedagem da aplicação;
- **Excalidraw** — planejamento das interfaces e fluxos.

## Estrutura do projeto

O repositório está dividido em duas aplicações:

```text
ProjetoAprendiz/
│
├── FrontEnd/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── BackEnd/
│   ├── src/
│   ├── vercel.json
│   ├── package.json
│   └── ...
│
└── README.md