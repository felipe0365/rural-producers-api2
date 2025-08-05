# Sistema de Exceções

Este diretório contém a implementação do sistema de tratamento de exceções da API.

## Estrutura

```
src/common/
├── exceptions/
│   ├── domain.exception.ts    # Exceções customizadas do domínio
│   └── index.ts              # Exportações das exceções
├── filters/
│   ├── http-exception.filter.ts  # Filtro global de exceções
│   └── index.ts              # Exportações dos filtros
└── README.md                 # Esta documentação
```

## Filtro Global de Exceções

O `HttpExceptionFilter` é registrado globalmente e padroniza todas as respostas de erro:

### Formato da Resposta de Erro

```json
{
  "statusCode": 400,
  "message": "Mensagem de erro descritiva",
  "error": "Tipo do erro",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

### Funcionalidades

- ✅ Captura todas as exceções (HttpException e outras)
- ✅ Padroniza formato de resposta JSON
- ✅ Adiciona timestamp e path da requisição
- ✅ Log automático de erros
- ✅ Preserva códigos de status HTTP apropriados

## Exceções Disponíveis

### Exceções do NestJS (Recomendadas)

```typescript
import {
  BadRequestException, // 400 - Dados inválidos
  UnauthorizedException, // 401 - Não autorizado
  ForbiddenException, // 403 - Proibido
  NotFoundException, // 404 - Não encontrado
  ConflictException, // 409 - Conflito
  InternalServerErrorException, // 500 - Erro interno
} from '@nestjs/common'

// Exemplo de uso
throw new NotFoundException('Recurso não encontrado')
throw new ConflictException('Dados já existem')
```

### Exceção Customizada do Domínio

```typescript
import { DomainException } from '../common/exceptions/domain.exception'

// Exemplo de uso
throw new DomainException('Regra de negócio violada', HttpStatus.BAD_REQUEST)
```

## Exemplos de Uso

### Em Serviços

```typescript
@Injectable()
export class ExampleService {
  async findOne(id: string) {
    const item = await this.repository.findOne({ where: { id } })

    if (!item) {
      throw new NotFoundException(`Item com ID ${id} não encontrado`)
    }

    return item
  }

  async create(data: CreateDto) {
    const existing = await this.repository.findOne({
      where: { email: data.email },
    })

    if (existing) {
      throw new ConflictException('Email já cadastrado')
    }

    // Validação de regra de negócio
    if (data.area > 1000) {
      throw new DomainException('Área máxima permitida é 1000 hectares')
    }

    return this.repository.save(data)
  }
}
```

## Configuração

O filtro é registrado automaticamente no `main.ts`:

```typescript
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

// No bootstrap()
app.useGlobalFilters(new HttpExceptionFilter())
```

## Logs

Todos os erros são automaticamente logados com:

- Método HTTP
- URL da requisição
- Status code
- Mensagem de erro
- Stack trace (quando disponível)
