# 🌾 Sistema de Gestão de Produtores Rurais

<p align="center">
  <img src="public/favicon.svg" width="120" alt="Rural Producers API Logo" />
</p>

<p align="center">
  <strong>API REST para gerenciamento de produtores rurais, fazendas, culturas plantadas e dashboard de dados agrícolas</strong>
</p>

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Setup Local](#setup-local)
- [Setup com Docker](#setup-com-docker)
- [Testes](#testes)
- [API Endpoints](#api-endpoints)
- [Exemplos de Uso](#exemplos-de-uso)
- [Documentação da API](#documentação-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Sistema completo para gestão de produtores rurais desenvolvido com NestJS e React. Permite o cadastro, gerenciamento e visualização de dados agrícolas através de uma API REST robusta e um frontend moderno.

### 🌱 Funcionalidades

- **👨‍🌾 Produtores Rurais**: Cadastro e gestão com validação de CPF/CNPJ
- **🏡 Fazendas**: Controle de propriedades rurais com áreas cultiváveis
- **🌾 Culturas Plantadas**: Registro de plantios por safra e cultura
- **📊 Dashboard**: Visualização de dados e estatísticas agrícolas
- **🔍 Filtros Avançados**: Busca e paginação de dados
- **✅ Validações**: Custom validators para documentos e áreas
- **📈 Gráficos**: Visualização de dados em tempo real

### 🛠 Tecnologias

**Backend:**

- NestJS (Framework)
- TypeScript
- TypeORM (ORM)
- PostgreSQL (Banco de dados)
- class-validator (Validação)
- Swagger/OpenAPI (Documentação)

**Frontend:**

- React
- TypeScript
- Ant Design (UI Components)
- Vite (Build tool)
- Recharts (Gráficos)

**DevOps:**

- Docker & Docker Compose
- Nginx (Proxy reverso)

## 🚀 Setup Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/rural-producers-api2.git
cd rural-producers-api
```

## 🐳 Setup com Docker

### Pré-requisitos

- Docker
- Docker Compose

### 1. Clone e configure

```bash
git clone https://github.com/seu-usuario/rural-producers-api.git
cd rural-producers-api

cp .env.example .env
```

### 2. Execute com Docker Compose

```bash
docker-compose up -d

docker-compose ps

docker-compose logs -f backend
```

### 3. Acesse as aplicações

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api

## 🧪 Testes

### Executar todos os testes

```bash
npm run test

npm run test:e2e
```

### Executar testes específicos

```bash
npm run test -- producers

npm run test -- farms

npm run test:watch
```

### Coverage Report

```bash
npm run test:cov

open coverage/lcov-report/index.html
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Principais Endpoints

#### 👨‍🌾 Produtores (`/producers`)

| Método   | Endpoint         | Descrição                         |
| -------- | ---------------- | --------------------------------- |
| `GET`    | `/producers`     | Listar produtores (com paginação) |
| `POST`   | `/producers`     | Criar novo produtor               |
| `GET`    | `/producers/:id` | Buscar produtor por ID            |
| `PATCH`  | `/producers/:id` | Atualizar produtor                |
| `DELETE` | `/producers/:id` | Excluir produtor                  |

#### 🏡 Fazendas (`/farms`)

| Método   | Endpoint     | Descrição             |
| -------- | ------------ | --------------------- |
| `GET`    | `/farms`     | Listar fazendas       |
| `POST`   | `/farms`     | Criar nova fazenda    |
| `GET`    | `/farms/:id` | Buscar fazenda por ID |
| `PATCH`  | `/farms/:id` | Atualizar fazenda     |
| `DELETE` | `/farms/:id` | Excluir fazenda       |

#### 🌾 Culturas (`/culture`)

| Método   | Endpoint       | Descrição             |
| -------- | -------------- | --------------------- |
| `GET`    | `/culture`     | Listar culturas       |
| `POST`   | `/culture`     | Criar nova cultura    |
| `GET`    | `/culture/:id` | Buscar cultura por ID |
| `PATCH`  | `/culture/:id` | Atualizar cultura     |
| `DELETE` | `/culture/:id` | Excluir cultura       |

#### 🌱 Plantios (`/planted-crops`)

| Método   | Endpoint             | Descrição             |
| -------- | -------------------- | --------------------- |
| `GET`    | `/planted-crops`     | Listar plantios       |
| `POST`   | `/planted-crops`     | Criar novo plantio    |
| `GET`    | `/planted-crops/:id` | Buscar plantio por ID |
| `PATCH`  | `/planted-crops/:id` | Atualizar plantio     |
| `DELETE` | `/planted-crops/:id` | Excluir plantio       |

#### 📊 Dashboard (`/dashboard`)

| Método | Endpoint     | Descrição          |
| ------ | ------------ | ------------------ |
| `GET`  | `/dashboard` | Dados do dashboard |

## 📝 Exemplos de Uso

### Criar um Produtor

```bash
curl -X POST http://localhost:3000/api/producers \
  -H "Content-Type: application/json" \
  -d '{
    "document": "12345678901",
    "documentType": "CPF",
    "producerName": "João Silva",
    "farms": [
      {
        "farmName": "Fazenda São João",
        "city": "São Paulo",
        "state": "SP",
        "totalArea": 1000,
        "arableArea": 800,
        "vegetationArea": 200,
        "plantedCrops": [
          {
            "harvest": "Safra 2024",
            "cultures": ["Soja", "Milho"],
            "plantedAreas": [300, 200]
          }
        ]
      }
    ]
  }'
```

### Listar Produtores

```bash
curl -X GET "http://localhost:3000/api/producers?page=1&limit=10&producerName=João"
```

### Buscar Produtor por ID

```bash
curl -X GET http://localhost:3000/api/producers/123e4567-e89b-12d3-a456-426614174000
```

### Atualizar Produtor

```bash
curl -X PATCH http://localhost:3000/api/producers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "producerName": "João Silva Santos"
  }'
```

### Excluir Produtor

```bash
curl -X DELETE http://localhost:3000/api/producers/123e4567-e89b-12d3-a456-426614174000
```

### Dashboard

```bash
curl -X GET http://localhost:3000/api/dashboard
```

## 📚 Documentação da API

### Swagger UI

Acesse a documentação interativa da API:

```
http://localhost:3000/api
```

### Estrutura de Dados

#### Produtor

```json
{
  "id": "uuid",
  "document": "12345678901",
  "documentType": "CPF",
  "producerName": "João Silva",
  "farms": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Fazenda

```json
{
  "id": "uuid",
  "farmName": "Fazenda São João",
  "city": "São Paulo",
  "state": "SP",
  "totalArea": 1000,
  "arableArea": 800,
  "vegetationArea": 200,
  "producerId": "uuid",
  "plantedCrops": [...]
}
```

#### Plantio

```json
{
  "id": "uuid",
  "harvest": "Safra 2024",
  "cultures": ["Soja", "Milho"],
  "plantedAreas": [300, 200],
  "farmId": "uuid"
}
```

### Validações

- **CPF/CNPJ**: Validação automática de documentos brasileiros
- **Áreas**: Validação de áreas (total = agricultável + vegetação)
- **Culturas**: Validação de arrays de culturas e áreas plantadas
- **Estados**: Validação de siglas de estados brasileiros

## 🔧 Comandos Úteis

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  <strong>🌾 Desenvolvido por Felipe Moreira</strong>
</p>
