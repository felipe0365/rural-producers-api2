import request from 'supertest'
import {
  createTestApp,
  cleanupTestDatabase,
  closeTestApp,
  testData,
  expectValidationError,
  expectNotFoundError,
  expectConflictError,
  TestApp,
} from './helpers/test-setup'

describe('ProducerController (e2e)', () => {
  let testApp: TestApp

  beforeAll(async () => {
    testApp = await createTestApp()
  }, 30000)

  beforeEach(async () => {
    await cleanupTestDatabase(testApp.dataSource)
  })

  afterAll(async () => {
    await closeTestApp(testApp)
  })

  describe('POST /api/producers', () => {
    it('deve criar um produtor com CPF válido', async () => {
      const createProducerDto = testData.producers.validCPF

      const response = await request(testApp.app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      expect(response.body).toEqual({
        id: expect.any(String),
        producerName: createProducerDto.producerName,
        document: createProducerDto.document,
        documentType: createProducerDto.documentType,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve criar um produtor com CNPJ válido', async () => {
      const createProducerDto = testData.producers.validCNPJ

      const response = await request(testApp.app.getHttpServer())
        .post('/api/producers')
        .send(createProducerDto)
        .expect(201)

      expect(response.body).toEqual({
        id: expect.any(String),
        producerName: createProducerDto.producerName,
        document: createProducerDto.document,
        documentType: createProducerDto.documentType,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve rejeitar documento inválido', async () => {
      const createProducerDto = testData.producers.invalidDocument

      const response = await request(testApp.app.getHttpServer()).post('/api/producers').send(createProducerDto)

      expectValidationError(response, 'document', 'Documento inválido')
    })

    it('deve rejeitar documento duplicado', async () => {
      const createProducerDto = testData.producers.validCPF

      await request(testApp.app.getHttpServer()).post('/api/producers').send(createProducerDto).expect(201)

      const response = await request(testApp.app.getHttpServer()).post('/api/producers').send(createProducerDto)

      expectConflictError(response, 'já existe')
    })

    it('deve rejeitar dados obrigatórios ausentes', async () => {
      const response = await request(testApp.app.getHttpServer()).post('/api/producers').send({})

      expectValidationError(response, 'producerName')
      expectValidationError(response, 'document')
      expectValidationError(response, 'documentType')
    })

    it('deve rejeitar nome muito curto', async () => {
      const createProducerDto = {
        ...testData.producers.validCPF,
        producerName: 'Jo',
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/producers').send(createProducerDto)

      expectValidationError(response, 'producerName')
    })

    it('deve rejeitar nome muito longo', async () => {
      const createProducerDto = {
        ...testData.producers.validCPF,
        producerName: 'A'.repeat(256),
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/producers').send(createProducerDto)

      expectValidationError(response, 'producerName')
    })
  })

  describe('GET /api/producers', () => {
    beforeEach(async () => {
      await request(testApp.app.getHttpServer()).post('/api/producers').send(testData.producers.validCPF)

      await request(testApp.app.getHttpServer()).post('/api/producers').send(testData.producers.validCNPJ)
    })

    it('deve retornar lista paginada de produtores', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/producers').expect(200)

      expect(response.body).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            producerName: expect.any(String),
            document: expect.any(String),
            documentType: expect.any(String),
          }),
        ]),
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
    })

    it('deve filtrar por nome do produtor', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/producers?producerName=João').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].producerName).toBe('João Silva')
    })

    it('deve filtrar por documento', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/producers?document=01166995585').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].document).toBe('01166995585')
    })

    it('deve filtrar por tipo de documento', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/producers?documentType=CNPJ').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].documentType).toBe('CNPJ')
    })

    it('deve paginar corretamente', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/producers?page=1&limit=1').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.meta).toEqual({
        page: 1,
        limit: 1,
        total: 2,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      })
    })
  })

  describe('GET /api/producers/:id', () => {
    let producerId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/producers')
        .send(testData.producers.validCPF)
        .expect(201)

      producerId = response.body.id
    })

    it('deve retornar um produtor por ID', async () => {
      const response = await request(testApp.app.getHttpServer()).get(`/api/producers/${producerId}`).expect(200)

      expect(response.body).toEqual({
        id: producerId,
        producerName: testData.producers.validCPF.producerName,
        document: testData.producers.validCPF.document,
        documentType: testData.producers.validCPF.documentType,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).get(`/api/producers/${fakeId}`)

      expectNotFoundError(response, 'Produtor')
    })

    it('deve rejeitar ID inválido', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/producers/invalid-id')

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/producers/:id', () => {
    let producerId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/producers')
        .send(testData.producers.validCPF)
        .expect(201)

      producerId = response.body.id
    })

    it('deve atualizar um produtor', async () => {
      const updateData = {
        producerName: 'João Silva Atualizado',
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/producers/${producerId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({
        id: producerId,
        producerName: updateData.producerName,
        document: testData.producers.validCPF.document,
        documentType: testData.producers.validCPF.documentType,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve rejeitar atualização com dados inválidos', async () => {
      const updateData = {
        producerName: 'Jo',
      }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/producers/${producerId}`).send(updateData)

      expectValidationError(response, 'producerName')
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData = { producerName: 'Teste' }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/producers/${fakeId}`).send(updateData)

      expectNotFoundError(response, 'Produtor')
    })
  })

  describe('DELETE /api/producers/:id', () => {
    let producerId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/producers')
        .send(testData.producers.validCPF)
        .expect(201)

      producerId = response.body.id
    })

    it('deve remover um produtor', async () => {
      await request(testApp.app.getHttpServer()).delete(`/api/producers/${producerId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/producers/${producerId}`).expect(404)
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).delete(`/api/producers/${fakeId}`)

      expectNotFoundError(response, 'Produtor')
    })
  })

  describe('Fluxos de integração', () => {
    it('deve permitir CRUD completo de um produtor', async () => {
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/producers')
        .send(testData.producers.validCPF)
        .expect(201)

      const producerId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer()).get(`/api/producers/${producerId}`).expect(200)

      expect(readResponse.body.id).toBe(producerId)

      const updateData = { producerName: 'Nome Atualizado' }
      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/api/producers/${producerId}`)
        .send(updateData)
        .expect(200)

      expect(updateResponse.body.producerName).toBe(updateData.producerName)

      await request(testApp.app.getHttpServer()).delete(`/api/producers/${producerId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/producers/${producerId}`).expect(404)
    })
  })
})
