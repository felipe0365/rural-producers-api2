# 🌾 Sistema de Gestão de Produtores Rurais

[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Sistema completo de gestão para produtores rurais com interface moderna e API robusta

## 📋 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentação da API](#-documentação-da-api)
- [🧪 Testes](#-testes)
- [📊 Estrutura do Projeto](#-estrutura-do-projeto)
- [📄 Licença](#-licença)

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

- **Login/Registro** com validação robusta
- **JWT Authentication** com refresh tokens
- **Proteção de rotas** e middleware de segurança
- **Logout automático** e limpeza de sessão

### 📊 Dashboard Inteligente

- **Estatísticas em tempo real** de produtores e fazendas
- **Gráficos interativos** com distribuição por estado e cultura
- **Métricas de uso do solo** e produtividade
- **Indicadores de performance** agrícola

### 👥 Gestão de Produtores

- **Cadastro completo** com validação de CPF/CNPJ
- **Gestão de múltiplas fazendas** por produtor
- **Controle de culturas** e safras plantadas
- **Busca avançada** com filtros dinâmicos
- **Validação de áreas** e dados geográficos

### 🏡 Gestão de Fazendas

- **Cadastro de propriedades** com dados completos
- **Controle de área total** e área plantada
- **Mapeamento de culturas** por fazenda
- **Histórico de safras** e produtividade

### 🌱 Gestão de Culturas

- **Catálogo de culturas** disponíveis
- **Controle de safras** plantadas
- **Métricas de produção** por cultura
- **Análise de distribuição** geográfica

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

- **Docker & Docker Compose** - Containerização
- **ESLint & Prettier** - Linting e formatação
- **Jest** - Testes automatizados
- **Vite** - Build tool para frontend
- **Nginx** - Servidor web para produção

## 🚀 Quick Start

### Com Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/felipe0365/rural-producers-api2.git
cd rural-producers-api

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute com Docker Compose
docker-compose up --build
```

### Serviços Disponíveis

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api/docs

## 🔧 Desenvolvimento

### Scripts Disponíveis

#### Backend

```bash
npm run start:dev          # Desenvolvimento com hot reload
npm run start:debug        # Desenvolvimento com debug
npm run build              # Build para produção
npm run start:prod         # Executar produção
npm run test               # Executar testes unitários
npm run test:e2e           # Executar testes end-to-end
npm run test:cov           # Cobertura de testes
npm run lint               # Linting
npm run format             # Formatação de código
```

#### Frontend

```bash
cd client
npm run dev                # Desenvolvimento
npm run build              # Build para produção
npm run preview            # Preview da build
npm run lint               # Linting
```

### Estrutura do Projeto

```
rural-producers-api/
├── 📁 src/                    # Backend - NestJS
│   ├── 🔐 auth/              # Sistema de autenticação
│   ├── 👥 producers/         # Módulo de produtores
│   ├── 🏡 farms/            # Módulo de fazendas
│   ├── 🌱 culture/          # Módulo de culturas
│   ├── 📊 planted-crops/    # Módulo de safras
│   ├── 📈 dashboard/        # Módulo do dashboard
│   └── 🔧 common/           # Utilitários compartilhados
├── 📁 client/                # Frontend - React
│   ├── 📁 src/
│   │   ├── 🧩 components/   # Componentes React
│   │   ├── 🔄 contexts/     # Contextos (Auth)
│   │   ├── 🌐 services/     # Serviços de API
│   │   └── 📱 pages/        # Páginas da aplicação
│   └── 📁 public/           # Arquivos estáticos
├── 📁 test/                  # Testes automatizados
├── 🐳 docker-compose.yml     # Configuração Docker
└── 📄 README.md             # Documentação
```

### Padrões de Código

- **TypeScript** para tipagem estática
- **ESLint + Prettier** para formatação
- **Conventional Commits** para mensagens
- **Modular Architecture** com NestJS
- **Component-Based** com React
- **RESTful APIs** com documentação Swagger

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

- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

## 🧪 Testes

### Executando Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Testes de debug
npm run test:debug
```

### Estrutura de Testes

```
test/
├── 📁 helpers/              # Utilitários de teste
├── 🧪 app.e2e-spec.ts       # Testes da aplicação
├── 🧪 producer.e2e-spec.ts  # Testes de produtores
├── 🧪 farms.e2e-spec.ts     # Testes de fazendas
└── 🧪 culture.e2e-spec.ts   # Testes de culturas
```

### Padrões de Commit

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: felipe0365@gmail.com

---

<div align="center">

**Desenvolvido por Felipe Moreira**

</div>
