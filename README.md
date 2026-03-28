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

```bash
GovFacil/
├── BackEnd/
└── FrontEnd/
```
🔹 Backend
```bash
cd BackEnd
npm install
```
Crie um arquivo .env dentro da pasta BackEnd com:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=SUA_SENHA
DB_DATABASE=govfacil_task
```
Depois execute:
```bash
npm run dev
```

O backend estará disponível em:  
http://localhost:3000

---

### 🔹 Frontend
```bash
cd FrontEnd
npm install
npm run dev
```

O frontend estará disponível em:  
http://localhost:5173

---

## 🎨 Interface

O frontend foi desenvolvido com foco em usabilidade, incluindo:

- Layout moderno  
- Organização das tarefas por status  
- Feedback visual de erros  
- Contador de caracteres nos campos  
- Interface responsiva  

---

## 📌 Observações

- Para simplificar o escopo, foi utilizado um usuário fixo  
- A aplicação possui validações no frontend e backend  
- O projeto foi organizado separando responsabilidades (rotas, controllers, etc.)  

---

## 🚀 Melhorias futuras

- Autenticação de usuários  
- Associação de tarefas por usuário  
- Testes automatizados  
- Dockerização do projeto  
- Melhorias visuais adicionais  

---

## 👨‍💻 Autor

Desenvolvido por Gustavo Ariosi para o processo seletivo da GovFácil.
