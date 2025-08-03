# Sistema de Gestão de Produtores Rurais - Frontend

Este é o frontend da aplicação de gestão de produtores rurais, desenvolvido com React, TypeScript e Ant Design.

## 🚀 Como Acessar

A aplicação está disponível em:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Ant Design** para componentes UI
- **React Router DOM** para navegação
- **React Hook Form** com **Zod** para validação
- **Recharts** para gráficos
- **Axios** para comunicação com API
- **Vite** como bundler

## 📱 Funcionalidades

### Dashboard (`/`)

- Cards de estatísticas (Total de Fazendas, Área Total, Total de Produtores)
- Gráficos de pizza (Fazendas por Estado, Culturas por Área, Uso do Solo)
- Interface responsiva e moderna

### Lista de Produtores (`/produtores`)

- Tabela com paginação
- Busca por nome do produtor
- Ações: Visualizar, Editar, Excluir
- Confirmação antes de excluir

### Formulário de Produtor (`/produtores/novo` e `/produtores/editar/:id`)

- Dados do produtor (CPF/CNPJ, nome)
- Sistema de fazendas dinâmicas (accordion)
- Validação de áreas (soma não pode ultrapassar área total)
- Culturas plantadas por safra
- Validação em tempo real com Zod

### Detalhes do Produtor (`/produtores/detalhes/:id`)

- Visualização completa dos dados
- Resumo das fazendas
- Detalhes de cada fazenda e culturas

## 🎨 Interface e UX

- Layout responsivo com sidebar de navegação
- Design moderno e limpo
- Feedback visual para ações do usuário
- Validação em tempo real
- Mensagens de erro claras
- Loading states apropriados

## 🔧 Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
cd client
npm install
```

### Execução em Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

## 🐳 Docker

Para executar com Docker:

```bash
docker-compose up --build
```

## 📋 Rotas Disponíveis

- `/` - Dashboard
- `/produtores` - Lista de produtores
- `/produtores/novo` - Cadastrar novo produtor
- `/produtores/editar/:id` - Editar produtor
- `/produtores/detalhes/:id` - Ver detalhes do produtor

## 🔗 Integração com Backend

O frontend se comunica com o backend através da API REST em `http://localhost:3000/api/`.

### Endpoints Principais:

- `GET /api/dashboard` - Dados do dashboard
- `GET /api/producers` - Lista de produtores
- `POST /api/producers` - Criar produtor
- `GET /api/producers/:id` - Buscar produtor
- `PATCH /api/producers/:id` - Atualizar produtor
- `DELETE /api/producers/:id` - Excluir produtor
