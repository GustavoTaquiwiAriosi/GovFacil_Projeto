# 🚀 Desafio Full Stack - GovFácil

Aplicação full stack desenvolvida como solução para o desafio técnico da GovFácil.

O sistema permite o gerenciamento de tarefas (CRUD), com validações no frontend e backend, filtros por status e período, e persistência em banco de dados.

---

## 🧠 Funcionalidades

- ✅ Criar tarefas
- 📋 Listar tarefas
- ✏️ Editar tarefas
- ❌ Excluir tarefas
- 🔎 Filtrar por status
- 📅 Filtrar por intervalo de datas

---

## ⚙️ Validações implementadas

### Frontend e Backend

- Campos obrigatórios
- Título: máximo de 50 caracteres
- Descrição: máximo de 100 caracteres
- Não permite datas no passado
- Data final não pode ser menor que a inicial

---

## 🧩 Tecnologias utilizadas

### Backend
- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL

### Frontend
- React
- TypeScript
- Vite
- Axios

---

## 🏗️ Estrutura do projeto

```bash
GovFacil/
├── BackEnd/
└── FrontEnd/
