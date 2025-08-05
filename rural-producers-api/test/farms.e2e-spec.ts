import request from 'supertest'
import {
  createTestApp,
  cleanupTestDatabase,
  closeTestApp,
  testData,
  expectValidationError,
  expectNotFoundError,
  createTestProducer,
  TestApp,
} from './helpers/test-setup'

describe('FarmsController (e2e)', () => {
  let testApp: TestApp
  let producerId: string

  beforeAll(async () => {
    testApp = await createTestApp()
  }, 30000)

  beforeEach(async () => {
    await cleanupTestDatabase(testApp.dataSource)

    const producer = await createTestProducer(testApp.app)
    producerId = producer.id
  })

  afterAll(async () => {
    await closeTestApp(testApp)
  })

  describe('POST /api/farms', () => {
    it('deve criar uma fazenda válida', async () => {
      const createFarmDto = {
        ...testData.farms.valid,
        producerId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(createFarmDto).expect(201)

      expect(response.body).toEqual({
        id: expect.any(String),
        farmName: createFarmDto.farmName,
        city: createFarmDto.city,
        state: createFarmDto.state,
        totalArea: createFarmDto.totalArea,
        arableArea: createFarmDto.arableArea,
        vegetationArea: createFarmDto.vegetationArea,
        producer: expect.objectContaining({
          id: producerId,
          producerName: expect.any(String),
          document: expect.any(String),
          documentType: expect.any(String),
        }),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve rejeitar fazenda com áreas inválidas', async () => {
      const createFarmDto = {
        ...testData.farms.invalidArea,
        producerId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(createFarmDto)

      expectValidationError(response, 'arableArea', 'não pode ser maior')
    })

    it('deve rejeitar produtor inexistente', async () => {
      const createFarmDto = {
        ...testData.farms.valid,
        producerId: '123e4567-e89b-12d3-a456-426614174000',
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(createFarmDto)

      expectNotFoundError(response, 'Produtor')
    })

    it('deve rejeitar dados obrigatórios ausentes', async () => {
      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send({})

      expectValidationError(response, 'farmName')
      expectValidationError(response, 'city')
      expectValidationError(response, 'state')
      expectValidationError(response, 'totalArea')
      expectValidationError(response, 'arableArea')
      expectValidationError(response, 'vegetationArea')
      expectValidationError(response, 'producerId')
    })

    it('deve rejeitar área total negativa', async () => {
      const createFarmDto = {
        ...testData.farms.valid,
        producerId,
        totalArea: -10,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(createFarmDto)

      expectValidationError(response, 'totalArea')
    })

    it('deve rejeitar área agricultável negativa', async () => {
      const createFarmDto = {
        ...testData.farms.valid,
        producerId,
        arableArea: -5,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(createFarmDto)

      expectValidationError(response, 'arableArea')
    })

    it('deve rejeitar área de vegetação negativa', async () => {
      const createFarmDto = {
        ...testData.farms.valid,
        producerId,
        vegetationArea: -3,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(createFarmDto)

      expectValidationError(response, 'vegetationArea')
    })
  })

  describe('GET /api/farms', () => {
    let farmId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          producerId,
        })
        .expect(201)

      farmId = response.body.id
    })

    it('deve retornar lista paginada de fazendas', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/farms').expect(200)

      expect(response.body).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            farmName: expect.any(String),
            city: expect.any(String),
            state: expect.any(String),
            totalArea: expect.any(Number),
            arableArea: expect.any(Number),
            vegetationArea: expect.any(Number),
            producerId: expect.any(String),
          }),
        ]),
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
    })

    it('deve filtrar por nome da fazenda', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/farms?farmName=Teste').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].farmName).toBe('Fazenda Teste')
    })

    it('deve filtrar por cidade', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/farms?city=São Paulo').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].city).toBe('São Paulo')
    })

    it('deve filtrar por estado', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/farms?state=SP').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].state).toBe('SP')
    })

    it('deve paginar corretamente', async () => {
      await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          farmName: 'Fazenda 2',
          producerId,
        })
        .expect(201)

      const response = await request(testApp.app.getHttpServer()).get('/api/farms?page=1&limit=1').expect(200)

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

  describe('GET /api/farms/:id', () => {
    let farmId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          producerId,
        })
        .expect(201)

      farmId = response.body.id
    })

    it('deve retornar uma fazenda por ID', async () => {
      const response = await request(testApp.app.getHttpServer()).get(`/api/farms/${farmId}`).expect(200)

      expect(response.body).toEqual({
        id: farmId,
        farmName: testData.farms.valid.farmName,
        city: testData.farms.valid.city,
        state: testData.farms.valid.state,
        totalArea: testData.farms.valid.totalArea,
        arableArea: testData.farms.valid.arableArea,
        vegetationArea: testData.farms.valid.vegetationArea,
        producerId: producerId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        producer: expect.objectContaining({
          id: producerId,
          producerName: expect.any(String),
        }),
      })
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).get(`/api/farms/${fakeId}`)

      expectNotFoundError(response, 'Fazenda')
    })

    it('deve rejeitar ID inválido', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/farms/invalid-id')

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/farms/:id', () => {
    let farmId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          producerId,
        })
        .expect(201)

      farmId = response.body.id
    })

    it('deve atualizar uma fazenda', async () => {
      const updateData = {
        farmName: 'Fazenda Atualizada',
        city: 'Rio de Janeiro',
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/farms/${farmId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({
        id: farmId,
        farmName: updateData.farmName,
        city: updateData.city,
        state: testData.farms.valid.state,
        totalArea: testData.farms.valid.totalArea,
        arableArea: testData.farms.valid.arableArea,
        vegetationArea: testData.farms.valid.vegetationArea,
        producerId: producerId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve rejeitar atualização com áreas inválidas', async () => {
      const updateData = {
        arableArea: 90,
        vegetationArea: 20,
      }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/farms/${farmId}`).send(updateData)

      expectValidationError(response, 'arableArea', 'não pode ser maior')
    })

    it('deve rejeitar atualização com dados inválidos', async () => {
      const updateData = {
        farmName: 'Fa',
      }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/farms/${farmId}`).send(updateData)

      expectValidationError(response, 'farmName')
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData = { farmName: 'Teste' }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/farms/${fakeId}`).send(updateData)

      expectNotFoundError(response, 'Fazenda')
    })
  })

  describe('DELETE /api/farms/:id', () => {
    let farmId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          producerId,
        })
        .expect(201)

      farmId = response.body.id
    })

    it('deve remover uma fazenda', async () => {
      await request(testApp.app.getHttpServer()).delete(`/api/farms/${farmId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/farms/${farmId}`).expect(404)
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).delete(`/api/farms/${fakeId}`)

      expectNotFoundError(response, 'Fazenda')
    })
  })

  describe('Fluxos de integração', () => {
    it('deve permitir CRUD completo de uma fazenda', async () => {
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          producerId,
        })
        .expect(201)

      const farmId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer()).get(`/api/farms/${farmId}`).expect(200)

      expect(readResponse.body.id).toBe(farmId)

      const updateData = { farmName: 'Fazenda Atualizada' }
      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/api/farms/${farmId}`)
        .send(updateData)
        .expect(200)

      expect(updateResponse.body.farmName).toBe(updateData.farmName)

      await request(testApp.app.getHttpServer()).delete(`/api/farms/${farmId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/farms/${farmId}`).expect(404)
    })

    it('deve manter integridade referencial com produtor', async () => {
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/farms')
        .send({
          ...testData.farms.valid,
          producerId,
        })
        .expect(201)

      const farmId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer()).get(`/api/farms/${farmId}`).expect(200)

      expect(readResponse.body.producerId).toBe(producerId)
      expect(readResponse.body.producer.id).toBe(producerId)
    })

    it('deve validar áreas corretamente', async () => {
      const validFarmData = {
        ...testData.farms.valid,
        producerId,
        totalArea: 100,
        arableArea: 70,
        vegetationArea: 30,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/farms').send(validFarmData).expect(201)

      expect(response.body.totalArea).toBe(100)
      expect(response.body.arableArea).toBe(70)
      expect(response.body.vegetationArea).toBe(30)
    })
  })
})
