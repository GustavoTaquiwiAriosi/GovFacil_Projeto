# 🚀 Desafio Full Stack - GovFácil

Este projeto foi desenvolvido como solução para o desafio técnico da GovFácil.

A aplicação consiste em um sistema de gerenciamento de tarefas (CRUD), onde é possível criar, listar, editar e excluir tarefas, além de aplicar filtros por status e período.

---

## 🧠 Funcionalidades

- Criar tarefas  
- Listar tarefas  
- Editar tarefas  
- Excluir tarefas  
- Filtrar por status  
- Filtrar por intervalo de datas  

---

## ⚙️ Validações

Foram implementadas validações tanto no frontend quanto no backend:

- Todos os campos são obrigatórios  
- Título com limite de 50 caracteres  
- Descrição com limite de 100 caracteres  
- Não permite datas no passado  
- Data final não pode ser menor que a data inicial  

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

## 📁 Estrutura do projeto
```
GovFacil/
├── BackEnd/
├── FrontEnd/
└── docker-compose.yml
```
---

## ▶️ Como rodar o projeto

### 🔹 Usando Docker (recomendado)

Com Docker instalado, execute:

```docker compose up --build```

Isso irá subir automaticamente:

- Banco de dados PostgreSQL  
- Backend (API)  
- Frontend (interface)  

Após iniciar:

- Frontend: http://localhost:5173  
- Backend: http://localhost:3000  

---

### 🔹 Rodar manualmente (sem Docker)

#### Backend
```
cd BackEnd
npm install
```
Crie um arquivo `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=senha configurada no seu banco
DB_DATABASE=govfacil_task
```
Execute:

```npm run dev```

---

#### Frontend

```cd FrontEnd
npm install
npm run dev
```
Acesse:

http://localhost:5173

---

## 🎨 Interface

O frontend foi desenvolvido com foco em usabilidade:

- Layout moderno com efeito glass  
- Organização de tarefas por status  
- Feedback visual de erros  
- Contador de caracteres  
- Interface responsiva  

---

## 📌 Observações

- O projeto utiliza um usuário fixo para simplificação do escopo  
- Validações foram implementadas no frontend e backend  
- Estrutura organizada separando responsabilidades  

---

## 🚀 Melhorias futuras

- Autenticação de usuários  
- Associação de tarefas por usuário  
- Testes automatizados  
- Deploy em produção  
- Melhorias adicionais de UI/UX  

