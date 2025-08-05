# Guia de Contribuição - Sistema de Gestão de Produtores Rurais

Obrigado por considerar contribuir para o Sistema de Gestão de Produtores Rurais! 🚀

Este documento fornece diretrizes e informações para contribuir com o projeto.

## 📋 Índice

- [🤝 Como Contribuir](#-como-contribuir)
- [🛠️ Configuração do Ambiente](#️-configuração-do-ambiente)
- [📝 Padrões de Código](#-padrões-de-código)
- [🧪 Testes](#-testes)
- [📦 Processo de Pull Request](#-processo-de-pull-request)
- [🐛 Reportando Bugs](#-reportando-bugs)
- [💡 Sugerindo Melhorias](#-sugerindo-melhorias)
- [📚 Documentação](#-documentação)
- [🎯 Áreas de Contribuição](#-áreas-de-contribuição)

## 🤝 Como Contribuir

### Tipos de Contribuição

- **🐛 Bug fixes** - Correção de problemas existentes
- **✨ Novas funcionalidades** - Adição de recursos úteis
- **📚 Documentação** - Melhoria da documentação
- **🧪 Testes** - Adição ou melhoria de testes
- **🎨 UI/UX** - Melhorias na interface do usuário
- **⚡ Performance** - Otimizações de performance
- **🔒 Segurança** - Melhorias de segurança

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **PostgreSQL** 15+
- **Docker** e **Docker Compose** (opcional, mas recomendado)
- **Git**

### Setup Local

1. **Clone o repositório**

   ```bash
   git clone https://github.com/felipe0365/rural-producers-api2.git
   ```

2. **Instale as dependências**

   ```bash
   # Backend
   npm install

   # Frontend
   cd client
   npm install
   cd ..
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Configure o banco de dados**

   ```bash
   # Com Docker (recomendado)
   docker-compose up -d postgres

   # Ou configure um PostgreSQL local
   ```

5. **Inicie o desenvolvimento**

   ```bash
   # Backend
   npm run start:dev

   # Frontend (em outro terminal)
   cd client
   npm run dev
   ```

### Com Docker (Recomendado)

```bash
# Clone e configure
git clone https://github.com/felipe0365/rural-producers-api2.git
cd rural-producers-api
cp .env.example .env

# Execute tudo com Docker
docker-compose up --build
```

## 📝 Padrões de Código

### Backend (NestJS)

#### Estrutura de Arquivos

```
src/
├── [module]/
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # Entidades TypeORM
│   ├── [module].controller.ts
│   ├── [module].service.ts
│   └── [module].module.ts
```

#### Convenções de Nomenclatura

- **Classes**: PascalCase (`ProducerService`)
- **Métodos**: camelCase (`createProducer`)
- **Variáveis**: camelCase (`producerData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_AREA_SIZE`)
- **Arquivos**: kebab-case (`producer.service.ts`)

#### Padrões de Código

```typescript
// ✅ Bom
@Injectable()
export class ProducerService {
  async createProducer(createProducerDto: CreateProducerDto): Promise<Producer> {
    // Implementação
  }
}

// ❌ Evitar
export class producerService {
  async CreateProducer(dto: any) {
    // Implementação sem tipagem
  }
}
```

### Frontend (React)

#### Estrutura de Componentes

```typescript
// ✅ Bom
interface ProducerFormProps {
  onSubmit: (data: ProducerFormData) => void
  initialData?: ProducerFormData
}

export const ProducerForm: React.FC<ProducerFormProps> = ({ onSubmit, initialData }) => {
  // Implementação
}
```

#### Convenções

- **Componentes**: PascalCase (`ProducerForm`)
- **Hooks**: camelCase (`useProducerData`)
- **Arquivos**: PascalCase (`ProducerForm.tsx`)

### Formatação e Linting

```bash
# Formatar código
npm run format

# Verificar linting
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint -- --fix
```

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
```

### Escrevendo Testes

#### Testes Unitários (Backend)

```typescript
describe('ProducerService', () => {
  let service: ProducerService
  let repository: Repository<Producer>

  beforeEach(async () => {
    // Setup
  })

  it('should create a producer', async () => {
    const dto = new CreateProducerDto()
    dto.name = 'João Silva'
    dto.cpfCnpj = '12345678901'

    const result = await service.createProducer(dto)

    expect(result.name).toBe('João Silva')
    expect(result.cpfCnpj).toBe('12345678901')
  })
})
```

#### Testes de Componentes (Frontend)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProducerForm } from './ProducerForm';

describe('ProducerForm', () => {
  it('should submit form with correct data', () => {
    const mockOnSubmit = jest.fn();
    render(<ProducerForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'João Silva' }
    });

    fireEvent.click(screen.getByText('Salvar'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'João Silva'
    });
  });
});
```

### Padrões de Teste

- **Arrange**: Preparar dados e mocks
- **Act**: Executar a ação sendo testada
- **Assert**: Verificar o resultado esperado

## 📦 Processo de Pull Request

### 1. Preparação

1. **Fork o repositório**
2. **Crie uma branch** para sua feature/fix:
   ```bash
   git checkout -b feature/nova-funcionalidade
   # ou
   git checkout -b fix/correcao-bug
   ```

### 2. Desenvolvimento

1. **Faça suas alterações** seguindo os padrões de código
2. **Adicione testes** para novas funcionalidades
3. **Atualize a documentação** se necessário
4. **Execute os testes**:
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

### 3. Commit

Use **Conventional Commits**:

```bash
# Funcionalidade
git commit -m "feat: adiciona validação de CPF/CNPJ"

# Correção
git commit -m "fix: corrige cálculo de área total"

# Documentação
git commit -m "docs: atualiza README com novas instruções"

# Testes
git commit -m "test: adiciona testes para ProducerService"

# Refatoração
git commit -m "refactor: reorganiza estrutura de DTOs"
```

### 4. Pull Request

1. **Push para sua branch**:

   ```bash
   git push origin feature/nova-funcionalidade
   ```

2. **Crie o Pull Request** no GitHub

3. **Preencha o template** do PR:
   - Descrição clara das mudanças
   - Screenshots (se aplicável)
   - Checklist de verificação

### 5. Review

- **Code Review** será realizado
- **Testes automatizados** devem passar
- **Aprovação** de pelo menos um mantenedor

## 🐛 Reportando Bugs

### Template de Bug Report

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do que é o bug.

**Passos para Reproduzir**

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar o problema.

**Ambiente:**

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

**Contexto Adicional**
Qualquer outra informação sobre o problema.
```

## 💡 Sugerindo Melhorias

### Template de Feature Request

```markdown
**Problema que a funcionalidade resolveria**
Uma descrição clara e concisa do problema.

**Solução proposta**
Uma descrição clara e concisa do que você quer que aconteça.

**Alternativas consideradas**
Uma descrição clara e concisa de quaisquer soluções alternativas ou funcionalidades que você considerou.

**Contexto adicional**
Qualquer outro contexto ou screenshots sobre a solicitação de funcionalidade.
```

## 📚 Documentação

### Tipos de Documentação

- **README.md** - Visão geral do projeto
- **API Documentation** - Documentação dos endpoints
- **Code Comments** - Comentários no código
- **Component Documentation** - Documentação de componentes React

### Padrões de Documentação

```typescript
/**
 * Cria um novo produtor rural
 * @param createProducerDto - Dados do produtor a ser criado
 * @returns Promise<Producer> - Produtor criado
 * @throws BadRequestException - Se CPF/CNPJ já existir
 */
async createProducer(createProducerDto: CreateProducerDto): Promise<Producer> {
  // Implementação
}
```

## 🎯 Áreas de Contribuição

### Prioridades Atuais

1. **🧪 Testes** - Aumentar cobertura de testes
2. **📊 Dashboard** - Melhorar visualizações e métricas
3. **🔒 Segurança** - Revisão de segurança e validações
4. **🌐 Internacionalização** - Suporte a múltiplos idiomas

### Tecnologias Utilizadas

- **Backend**: NestJS, TypeORM, PostgreSQL, JWT
- **Frontend**: React, TypeScript, Ant Design, Recharts
- **Testes**: Jest, Supertest
- **DevOps**: Docker, Docker Compose

## 📞 Contato

- **Email**: felipe0365@gmail.com
- **GitHub Issues**: Para bugs e feature requests
- **Discussions**: Para discussões gerais

---

**Obrigado por contribuir!** 🌾

_Este projeto é mantido com ❤️ pela comunidade de desenvolvedores focados em tecnologia agrícola._
