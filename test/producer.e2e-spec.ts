import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CreateProducerDto } from 'src/producers/dto/create-producer.dto'
import { UpdateProducerDto } from 'src/producers/dto/update-producer.dto'
import { DocumentType } from 'src/producers/entities/producer.entity'
import { ProducersController } from 'src/producers/producers.controller'
import { ProducersService } from 'src/producers/producers.service'
import { DataSource } from 'typeorm'
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('producers')
class TestProducer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  producerName: string

  @Column({ unique: true, nullable: false })
  document: string

  @Column({ type: 'varchar', length: 10, nullable: false })
  documentType: DocumentType
}

describe('ProducerController (e2e)', () => {
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
        TypeOrmModule.forFeature([TestProducer]),
      ],
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useFactory: (dataSource: DataSource) => {
            const repository = dataSource.getRepository(TestProducer)
            return new ProducersService(repository as any)
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

  describe('POST /producers', () => {
    it('deve criar um produtor com CPF válido', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: expect.any(String),
            document: '01166995585',
            documentType: DocumentType.CPF,
            producerName: 'João Silva',
          })
        })
    })

    it('deve criar um produtor com CNPJ válido', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '12345678000195',
        documentType: DocumentType.CNPJ,
        producerName: 'Empresa Rural LTDA',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: expect.any(String),
            document: '12345678000195',
            documentType: DocumentType.CNPJ,
            producerName: 'Empresa Rural LTDA',
          })
        })
    })

    it('deve retornar 400 para CPF inválido', () => {
      const invalidDto = {
        document: '12345678901',
        documentType: DocumentType.CPF,
        producerName: 'Produtor Inválido',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('O documento deve ser um CPF ou CNPJ válido')
        })
    })

    it('deve retornar 400 para CNPJ inválido', () => {
      const invalidDto = {
        document: '12345678901234',
        documentType: DocumentType.CNPJ,
        producerName: 'Empresa Inválida',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('O documento deve ser um CPF ou CNPJ válido')
        })
    })

    it('deve retornar 400 para documento vazio', () => {
      const invalidDto = {
        document: '',
        documentType: DocumentType.CPF,
        producerName: 'Produtor Teste',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('O documento não pode estar vazio')
        })
    })

    it('deve retornar 400 para nome vazio', () => {
      const invalidDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: '',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('O nome do produtor não pode estar vazio')
        })
    })

    it('deve retornar 400 para tipo de documento inválido', () => {
      const invalidDto = {
        document: '01166995585',
        documentType: 'INVALID',
        producerName: 'Produtor Teste',
      }

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(invalidDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('O tipo de documento deve ser um CPF ou CNPJ')
        })
    })

    it('deve retornar 409 para documento duplicado', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      await request(app.getHttpServer()).post('/api/producers').send(createProducerDto).expect(201)

      return request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(409)
        .then((response) => {
          expect(response.body.message).toContain('Produtor com o documento 01166995585 já existe')
        })
    })
  })

  describe('GET /producers', () => {
    it('deve retornar lista vazia quando não há produtores', () => {
      return request(app.getHttpServer())
        .get('/api/producers')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([])
        })
    })

    it('deve retornar todos os produtores', async () => {
      const producers = [
        {
          document: '01166995585',
          documentType: DocumentType.CPF,
          producerName: 'João Silva',
        },
        {
          document: '12345678000195',
          documentType: DocumentType.CNPJ,
          producerName: 'Empresa Rural LTDA',
        },
      ]

      for (const producer of producers) {
        await request(app.getHttpServer()).post('/api/producers').send(producer).expect(201)
      }

      return request(app.getHttpServer())
        .get('/api/producers')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2)
          expect(response.body[0]).toHaveProperty('id')
          expect(response.body[0]).toHaveProperty('document')
          expect(response.body[0]).toHaveProperty('documentType')
          expect(response.body[0]).toHaveProperty('producerName')
        })
    })
  })

  describe('GET /producers/:id', () => {
    it('deve retornar um produtor específico', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      const producerId = createResponse.body.id

      return request(app.getHttpServer())
        .get(`/api/producers/${producerId}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id: producerId,
            document: '01166995585',
            documentType: DocumentType.CPF,
            producerName: 'João Silva',
          })
        })
    })

    it('deve retornar 400 para ID inválido', () => {
      return request(app.getHttpServer()).get('/api/producers/invalid-id').expect(400)
    })

    it('deve retornar 404 para produtor não encontrado', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      return request(app.getHttpServer())
        .get(`/api/producers/${fakeId}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain(
            'Produtor com o ID 123e4567-e89b-12d3-a456-426614174000 não encontrado',
          )
        })
    })
  })

  describe('PATCH /producers/:id', () => {
    it('deve atualizar um produtor existente', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      const producerId = createResponse.body.id

      const updateProducerDto: UpdateProducerDto = {
        producerName: 'João Silva Atualizado',
      }

      return request(app.getHttpServer())
        .patch(`/api/producers/${producerId}`)
        .send(updateProducerDto)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual({
            id: producerId,
            document: '01166995585',
            documentType: DocumentType.CPF,
            producerName: 'João Silva Atualizado',
          })
        })
    })

    it('deve atualizar apenas o nome do produtor', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      const producerId = createResponse.body.id

      const updateProducerDto = {
        producerName: 'Novo Nome',
      }

      return request(app.getHttpServer())
        .patch(`/api/producers/${producerId}`)
        .send(updateProducerDto)
        .expect(200)
        .then((response) => {
          expect(response.body.producerName).toBe('Novo Nome')
          expect(response.body.document).toBe('01166995585')
          expect(response.body.documentType).toBe(DocumentType.CPF)
        })
    })

    it('deve retornar 400 para ID inválido', () => {
      const updateProducerDto = {
        producerName: 'Novo Nome',
      }

      return request(app.getHttpServer()).patch('/api/producers/invalid-id').send(updateProducerDto).expect(400)
    })

    it('deve retornar 404 para produtor não encontrado', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      const updateProducerDto = {
        producerName: 'Novo Nome',
      }

      return request(app.getHttpServer())
        .patch(`/api/producers/${fakeId}`)
        .send(updateProducerDto)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain(
            'Produtor com o ID 123e4567-e89b-12d3-a456-426614174000 não encontrado',
          )
        })
    })

    it('deve retornar 400 para dados inválidos na atualização', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      const producerId = createResponse.body.id

      const invalidUpdateDto = {
        producerName: '',
      }

      return request(app.getHttpServer())
        .patch(`/api/producers/${producerId}`)
        .send(invalidUpdateDto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('O nome do produtor não pode estar vazio')
        })
    })
  })

  describe('DELETE /producers/:id', () => {
    it('deve remover um produtor existente', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      const producerId = createResponse.body.id

      await request(app.getHttpServer()).delete(`/api/producers/${producerId}`).expect(200)

      return request(app.getHttpServer()).get(`/api/producers/${producerId}`).expect(404)
    })

    it('deve retornar 400 para ID inválido', () => {
      return request(app.getHttpServer()).delete('/api/producers/invalid-id').expect(400)
    })

    it('deve retornar 404 para produtor não encontrado', () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      return request(app.getHttpServer())
        .delete(`/api/producers/${fakeId}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain(
            'Produtor com o ID 123e4567-e89b-12d3-a456-426614174000 não encontrado',
          )
        })
    })
  })

  describe('Cenários de integração', () => {
    it('deve permitir CRUD completo de um produtor', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '01166995585',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      const producerId = createResponse.body.id
      expect(createResponse.body.producerName).toBe('João Silva')

      const getResponse = await request(app.getHttpServer()).get(`/api/producers/${producerId}`).expect(200)

      expect(getResponse.body.producerName).toBe('João Silva')

      const updateProducerDto = {
        producerName: 'João Silva Atualizado',
      }

      const updateResponse = await request(app.getHttpServer())
        .patch(`/api/producers/${producerId}`)
        .send(updateProducerDto)
        .expect(200)

      expect(updateResponse.body.producerName).toBe('João Silva Atualizado')

      await request(app.getHttpServer()).delete(`/api/producers/${producerId}`).expect(200)

      await request(app.getHttpServer()).get(`/api/producers/${producerId}`).expect(404)
    })

    it('deve validar documentos com formatação', async () => {
      const cpfWithFormatting = {
        document: '011.669.955-85',
        documentType: DocumentType.CPF,
        producerName: 'João Silva',
      }

      const response1 = await request(app.getHttpServer()).post('/api/producers').send(cpfWithFormatting).expect(201)

      expect(response1.body.document).toBe('01166995585')

      const cnpjWithFormatting = {
        document: '12.345.678/0001-95',
        documentType: DocumentType.CNPJ,
        producerName: 'Empresa LTDA',
      }

      const response2 = await request(app.getHttpServer()).post('/api/producers').send(cnpjWithFormatting).expect(201)

      expect(response2.body.document).toBe('12345678000195')
    })
  })
})
