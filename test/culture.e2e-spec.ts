import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreateCultureDto } from 'src/culture/dto/create-culture.dto'
import { UpdateCultureDto } from 'src/culture/dto/update-culture.dto'
import { CultureController } from 'src/culture/culture.controller'
import { CultureService } from 'src/culture/culture.service'
import { DataSource } from 'typeorm'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

// Versão simplificada da entidade Culture para testes
@Entity('cultures')
class TestCulture {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string
}

describe('CultureController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([TestCulture]),
      ],
      controllers: [CultureController],
      providers: [
        {
          provide: CultureService,
          useFactory: (dataSource: DataSource) => {
            const repository = dataSource.getRepository(TestCulture)
            return new CultureService(repository as any)
          },
          inject: [DataSource],
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()

    dataSource = moduleFixture.get<DataSource>(DataSource)
  }, 30000)

  beforeEach(async () => {
    // Limpar dados entre testes
    const entities = dataSource.entityMetadatas
    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name)
      await repository.clear()
    }
  })

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  describe('POST /culture', () => {
    it('deve criar uma cultura válida', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      }

      return request(app.getHttpServer())
        .post('/api/culture')
        .send(createCultureDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: expect.any(String),
            name: createCultureDto.name,
          })
        })
    })

    it('deve retornar 400 para nome vazio', () => {
      const invalidDto = {
        name: '',
      }

      return request(app.getHttpServer())
        .post('/api/culture')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('name should not be empty')
        })
    })

    it('deve retornar 400 para nome não string', () => {
      const invalidDto = {
        name: 123,
      }

      return request(app.getHttpServer())
        .post('/api/culture')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('name must be a string')
        })
    })

    it('deve retornar 409 para nome duplicado', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Milho',
      }

      // Criar primeira cultura
      await request(app.getHttpServer()).post('/api/culture').send(createCultureDto).expect(201)

      // Tentar criar segunda cultura com mesmo nome
      return request(app.getHttpServer())
        .post('/api/culture')
        .send(createCultureDto)
        .expect(409)
        .then((response) => {
          expect(response.body.message).toContain('Cultura com nome: Milho já existe')
        })
    })
  })

  describe('GET /culture', () => {
    it('deve retornar lista vazia quando não há culturas', () => {
      return request(app.getHttpServer())
        .get('/api/culture')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([])
        })
    })

    it('deve retornar todas as culturas', async () => {
      const cultures = [{ name: 'Soja' }, { name: 'Milho' }, { name: 'Arroz' }]

      // Criar culturas
      for (const culture of cultures) {
        await request(app.getHttpServer()).post('/api/culture').send(culture).expect(201)
      }

      // Buscar todas as culturas
      return request(app.getHttpServer())
        .get('/api/culture')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(3)
          expect(response.body[0]).toHaveProperty('id')
          expect(response.body[0]).toHaveProperty('name')
        })
    })
  })

  describe('GET /culture/:id', () => {
    it('deve retornar uma cultura específica', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      }

      // Criar cultura
      const createResponse = await request(app.getHttpServer()).post('/api/culture').send(createCultureDto).expect(201)

      const cultureId = createResponse.body.id

      // Buscar cultura específica
      return request(app.getHttpServer())
        .get(`/api/culture/${cultureId}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id: cultureId,
            name: 'Soja',
          })
        })
    })

    it('deve retornar 400 para ID inválido', () => {
      return request(app.getHttpServer()).get('/api/culture/invalid-id').expect(400)
    })

    it('deve retornar 404 para cultura não encontrada', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      return request(app.getHttpServer())
        .get(`/api/culture/${fakeId}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Cultura não encontrada')
        })
    })
  })

  describe('PATCH /culture/:id', () => {
    it('deve atualizar uma cultura existente', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      }

      // Criar cultura
      const createResponse = await request(app.getHttpServer()).post('/api/culture').send(createCultureDto).expect(201)

      const cultureId = createResponse.body.id

      // Atualizar cultura
      const updateCultureDto: UpdateCultureDto = {
        name: 'Soja Transgênica',
      }

      return request(app.getHttpServer())
        .patch(`/api/culture/${cultureId}`)
        .send(updateCultureDto)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id: cultureId,
            name: 'Soja Transgênica',
          })
        })
    })

    it('deve retornar 400 para ID inválido', () => {
      const updateCultureDto = {
        name: 'Novo Nome',
      }

      return request(app.getHttpServer()).patch('/api/culture/invalid-id').send(updateCultureDto).expect(400)
    })

    it('deve retornar 404 para cultura não encontrada', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      const updateCultureDto = {
        name: 'Novo Nome',
      }

      return request(app.getHttpServer())
        .patch(`/api/culture/${fakeId}`)
        .send(updateCultureDto)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Cultura não encontrada')
        })
    })

    it('deve retornar 400 para dados inválidos na atualização', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      }

      // Criar cultura
      const createResponse = await request(app.getHttpServer()).post('/api/culture').send(createCultureDto).expect(201)

      const cultureId = createResponse.body.id

      // Tentar atualizar com dados inválidos
      const invalidUpdateDto = {
        name: '',
      }

      return request(app.getHttpServer())
        .patch(`/api/culture/${cultureId}`)
        .send(invalidUpdateDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('name should not be empty')
        })
    })
  })

  describe('DELETE /culture/:id', () => {
    it('deve remover uma cultura existente', async () => {
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      }

      // Criar cultura
      const createResponse = await request(app.getHttpServer()).post('/api/culture').send(createCultureDto).expect(201)

      const cultureId = createResponse.body.id

      // Remover cultura
      await request(app.getHttpServer()).delete(`/api/culture/${cultureId}`).expect(200)

      // Verificar se foi removida
      return request(app.getHttpServer()).get(`/api/culture/${cultureId}`).expect(404)
    })

    it('deve retornar 400 para ID inválido', () => {
      return request(app.getHttpServer()).delete('/api/culture/invalid-id').expect(400)
    })

    it('deve retornar 404 para cultura não encontrada', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      return request(app.getHttpServer())
        .delete(`/api/culture/${fakeId}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Cultura não encontrada')
        })
    })
  })

  describe('Cenários de integração', () => {
    it('deve permitir CRUD completo de uma cultura', async () => {
      // CREATE
      const createCultureDto: CreateCultureDto = {
        name: 'Soja',
      }

      const createResponse = await request(app.getHttpServer()).post('/api/culture').send(createCultureDto).expect(201)

      const cultureId = createResponse.body.id
      expect(createResponse.body.name).toBe('Soja')

      // READ
      const getResponse = await request(app.getHttpServer()).get(`/api/culture/${cultureId}`).expect(200)

      expect(getResponse.body.name).toBe('Soja')

      // UPDATE
      const updateCultureDto = {
        name: 'Soja Transgênica',
      }

      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/culture/${cultureId}`)
        .send(updateCultureDto)
        .expect(200)

      expect(updateResponse.body.name).toBe('Soja Transgênica')

      // DELETE
      await request(app.getHttpServer()).delete(`/api/culture/${cultureId}`).expect(200)

      // Verificar se foi removida
      await request(app.getHttpServer()).get(`/api/culture/${cultureId}`).expect(404)
    })

    it('deve validar nomes únicos', async () => {
      // Criar primeira cultura
      await request(app.getHttpServer()).post('/api/culture').send({ name: 'Milho' }).expect(201)

      // Tentar criar segunda cultura com mesmo nome
      await request(app.getHttpServer()).post('/api/culture').send({ name: 'Milho' }).expect(409)

      // Verificar que apenas uma foi criada
      const response = await request(app.getHttpServer()).get('/api/culture').expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0].name).toBe('Milho')
    })
  })
})
