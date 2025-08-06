# 🌾 Rural Producer API

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Sistema completo de gestão para produtores rurais com interface moderna e API robusta

## 📋 Índice

-   [✨ Funcionalidades](#-funcionalidades)
-   [🛠️ Stack Tecnológica](#️-stack-tecnológica)
-   [🚀 Quick Start](#-quick-start)
-   [📚 Documentação da API](#-documentação-da-api)
-   [🧪 Testes](#-testes)
-   [📊 Estrutura do Projeto](#-estrutura-do-projeto)
-   [📄 Licença](#-licença)

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

-   **Login/Registro** com validação robusta
-   **JWT Authentication** com refresh tokens
-   **Proteção de rotas** e middleware de segurança
-   **Logout automático** e limpeza de sessão

### 📊 Dashboard Inteligente

-   **Estatísticas em tempo real** de produtores e fazendas
-   **Gráficos interativos** com distribuição por estado e cultura
-   **Métricas de uso do solo** e produtividade
-   **Indicadores de performance** agrícola

### 👥 Gestão de Produtores

-   **Cadastro completo** com validação de CPF/CNPJ
-   **Gestão de múltiplas fazendas** por produtor
-   **Controle de culturas** e safras plantadas
-   **Busca avançada** com filtros dinâmicos
-   **Validação de áreas** e dados geográficos

### 🏡 Gestão de Fazendas

-   **Cadastro de propriedades** com dados completos
-   **Controle de área total** e área plantada
-   **Mapeamento de culturas** por fazenda
-   **Histórico de safras** e produtividade

### 🌱 Gestão de Culturas

-   **Catálogo de culturas** disponíveis
-   **Controle de safras** plantadas
-   **Métricas de produção** por cultura
-   **Análise de distribuição** geográfica

## 🛠️ Stack Tecnológica

### Backend

| Tecnologia     | Versão | Propósito                   |
| -------------- | ------ | --------------------------- |
| **NestJS**     | 11.0.1 | Framework Node.js para APIs |
| **TypeORM**    | 0.3.25 | ORM para banco de dados     |
| **PostgreSQL** | 15+    | Banco de dados principal    |
| **JWT**        | 9.0.2  | Autenticação e autorização  |
| **Passport**   | 0.7.0  | Estratégias de autenticação |
| **Swagger**    | 11.2.0 | Documentação da API         |
| **bcryptjs**   | 3.0.2  | Hash de senhas              |

### Frontend

| Tecnologia          | Versão   | Propósito                    |
| ------------------- | -------- | ---------------------------- |
| **React**           | 19.1.0   | Biblioteca UI                |
| **TypeScript**      | 5.8.3    | Tipagem estática             |
| **Ant Design**      | 5.26.7   | Componentes UI               |
| **Framer Motion**   | 12.23.12 | Animações                    |
| **React Router**    | 7.7.1    | Navegação                    |
| **Axios**           | 1.11.0   | Cliente HTTP                 |
| **React Hook Form** | 7.62.0   | Gerenciamento de formulários |
| **Zod**             | 4.0.14   | Validação de schemas         |
| **Recharts**        | 3.1.0    | Gráficos e visualizações     |

### DevOps & Ferramentas

-   **Docker & Docker Compose** - Containerização
-   **ESLint & Prettier** - Linting e formatação
-   **Jest** - Testes automatizados
-   **Vite** - Build tool para frontend
-   **Nginx** - Servidor web para produção

## 🚀 Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/felipe0365/rural-producers-api2.git

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute com Docker Compose
docker-compose up --build
```

### 🌐 Produção

O projeto está disponível em produção através da plataforma Vercel:

-   **URL Principal**: https://rural-producers-api2.vercel.app/

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
rural-producer-api/
├── 📁 rural-producers-api/     # Backend - NestJS
│   ├── 📁 src/                # Código fonte do backend
│   ├── 📁 test/               # Testes automatizados
│   └── 📄 README.md           # Documentação do backend
│
├── 📁 rural-producers-frontend/ # Frontend - React
│   ├── 📁 src/                # Código fonte do frontend
│   ├── 📁 public/             # Arquivos estáticos
│   └── 📄 README.md           # Documentação do frontend
│
├── 🐳 docker-compose.yml      # Configuração Docker
├── 📄 README.md              # Documentação principal
├── 📄 CONTRIBUTING.md        # Guia de contribuição
├── 📄 CODE_OF_CONDUCT.md     # Código de conduta
├── 📄 LICENSE                # Licença do projeto
└── 📄 .env.example           # Exemplo de variáveis de ambiente
```

### Padrões de Código

-   **TypeScript** para tipagem estática
-   **ESLint + Prettier** para formatação
-   **Conventional Commits** para mensagens
-   **Modular Architecture** com NestJS
-   **Component-Based** com React
-   **RESTful APIs** com documentação Swagger

## 📚 Documentação da API

### Endpoints Principais

#### Autenticação

```http
POST /api/auth/login          # Login de usuário
POST /api/auth/register       # Registro de usuário
GET  /api/auth/profile        # Perfil do usuário
```

#### Produtores

```http
GET    /api/producers         # Listar produtores
POST   /api/producers         # Criar produtor
GET    /api/producers/:id     # Buscar produtor
PUT    /api/producers/:id     # Atualizar produtor
DELETE /api/producers/:id     # Deletar produtor
```

#### Fazendas

```http
GET    /api/farms             # Listar fazendas
POST   /api/farms             # Criar fazenda
GET    /api/farms/:id         # Buscar fazenda
PUT    /api/farms/:id         # Atualizar fazenda
DELETE /api/farms/:id         # Deletar fazenda
```

#### Dashboard

```http
GET /api/dashboard/stats      # Estatísticas gerais
GET /api/dashboard/charts     # Dados para gráficos
```

### Documentação Interativa

Acesse a documentação completa da API em:

-   **Swagger UI**: http://localhost:3000/api/docs
-   **OpenAPI JSON**: http://localhost:3000/api/docs-json

## 🧪 Testes

### Executando Testes

```bash
# Backend - Testes unitários
cd rural-producers-api
npm run test

# Backend - Testes em modo watch
npm run test:watch

# Backend - Testes end-to-end
npm run test:e2e

# Frontend - Testes
cd rural-producers-frontend
npm run test
```

### Estrutura de Testes

```
rural-producers-api/test/
├── 📁 helpers/              # Utilitários de teste
├── 🧪 app.e2e-spec.ts       # Testes da aplicação
├── 🧪 producer.e2e-spec.ts  # Testes de produtores
├── 🧪 farms.e2e-spec.ts     # Testes de fazendas
└── 🧪 culture.e2e-spec.ts   # Testes de culturas
```

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

-   **Email**: felipe0365@gmail.com

---

<div align="center">

**Desenvolvido por Felipe Moreira**

</div>
