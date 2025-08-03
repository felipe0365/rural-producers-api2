# Sistema de Gestão de Produtores Rurais

Sistema completo para gerenciamento de produtores rurais, fazendas, culturas e safras plantadas, com sistema de autenticação integrado.

## 🚀 Funcionalidades

### Autenticação

- ✅ Login com username e password
- ✅ Registro de novos usuários
- ✅ Proteção de rotas com JWT
- ✅ Logout automático
- ✅ Interface moderna com design Frosted Glass UI

### Dashboard

- 📊 Estatísticas em tempo real
- 📈 Gráficos de distribuição por estado e cultura
- 🎯 Resumo de uso do solo

### Gestão de Produtores

- 👥 Cadastro completo de produtores (CPF/CNPJ)
- 🏡 Gestão de múltiplas fazendas por produtor
- 🌾 Controle de culturas plantadas por safra
- 📋 Validação de áreas e dados
- 🔍 Busca e filtros avançados

## 🛠️ Tecnologias

### Backend

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **JWT** - Autenticação
- **Passport** - Estratégias de autenticação
- **bcryptjs** - Hash de senhas
- **Swagger** - Documentação da API

### Frontend

- **React 19** com TypeScript
- **Ant Design** - Componentes UI
- **Framer Motion** - Animações
- **React Router DOM** - Navegação
- **Axios** - Comunicação com API
- **React Hook Form** - Formulários
- **Zod** - Validação

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <repository-url>
cd rural-producers-api
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações de banco de dados.

### 3. Instale as dependências

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 4. Configure o banco de dados

```bash
# Crie o banco de dados PostgreSQL
createdb rural_producers
```

### 5. Execute o projeto

```bash
# Backend
npm run start:dev

# Frontend (em outro terminal)
cd client
npm run dev
```

## 🐳 Docker

Para executar com Docker Compose:

```bash
docker-compose up --build
```

## 🔐 Autenticação

### Endpoints da API

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "senha123"
}
```

#### Registro

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nome Completo",
  "username": "usuario",
  "password": "senha123"
}
```

### Uso no Frontend

O sistema de autenticação está integrado ao frontend com:

- **Contexto de Autenticação**: Gerencia estado do usuário
- **Rotas Protegidas**: Redireciona para login se não autenticado
- **Interceptor de Token**: Adiciona automaticamente o token JWT nas requisições
- **Logout**: Limpa dados locais e redireciona para login

## 🎨 Design System

O projeto utiliza o design system **Frosted Glass UI** com:

- **Glassmorphism**: Efeito de vidro fosco
- **Animações Suaves**: Transições fluidas com Framer Motion
- **Paleta de Cores**: Cores modernas e acessíveis
- **Tipografia**: Fonte Inter para melhor legibilidade
- **Responsividade**: Interface adaptável a diferentes dispositivos

## 📱 Rotas da Aplicação

- `/login` - Página de autenticação
- `/` - Dashboard principal
- `/produtores` - Lista de produtores
- `/produtores/novo` - Cadastro de produtor
- `/produtores/editar/:id` - Edição de produtor
- `/produtores/detalhes/:id` - Detalhes do produtor

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
├── src/
│   ├── auth/                 # Sistema de autenticação
│   ├── producers/            # Módulo de produtores
│   ├── farms/               # Módulo de fazendas
│   ├── culture/             # Módulo de culturas
│   ├── planted-crops/       # Módulo de safras
│   └── dashboard/           # Módulo do dashboard
├── client/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Contextos (Auth)
│   │   ├── services/        # Serviços de API
│   │   └── ...
└── test/                    # Testes automatizados
```

### Scripts Disponíveis

```bash
# Backend
npm run start:dev          # Desenvolvimento
npm run build              # Build para produção
npm run start:prod         # Executar produção
npm run test               # Executar testes
npm run test:e2e           # Testes end-to-end

# Frontend
cd client
npm run dev                # Desenvolvimento
npm run build              # Build para produção
npm run preview            # Preview da build
```

## 📊 API Documentation

A documentação da API está disponível em:

- **Swagger UI**: http://localhost:3000/api/docs
- **OpenAPI JSON**: http://localhost:3000/api/docs-json

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🚀 Deploy

### Produção

1. Configure as variáveis de ambiente para produção
2. Execute `npm run build` no backend
3. Execute `npm run build` no frontend
4. Configure um servidor web para servir os arquivos estáticos

### Docker

```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no repositório.
