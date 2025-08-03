import request from 'supertest'
import {
  createTestApp,
  cleanupTestDatabase,
  closeTestApp,
  testData,
  expectValidationError,
  expectNotFoundError,
  createTestProducer,
  createTestFarm,
  createTestCulture,
  TestApp,
} from './helpers/test-setup'

describe('PlantedCropsController (e2e)', () => {
  let testApp: TestApp
  let producerId: string
  let farmId: string
  let cultureId: string

  beforeAll(async () => {
    testApp = await createTestApp()
  }, 30000)

  beforeEach(async () => {
    await cleanupTestDatabase(testApp.dataSource)

    const producer = await createTestProducer(testApp.app)
    producerId = producer.id

    const farm = await createTestFarm(testApp.app, producerId)
    farmId = farm.id

    const culture = await createTestCulture(testApp.app)
    cultureId = culture.id
  })

  afterAll(async () => {
    await closeTestApp(testApp)
  })

  describe('POST /api/planted-crops', () => {
    it('deve criar um plantio válido', async () => {
      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        farmId,
        cultureId,
      }

      const response = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send(createPlantedCropDto)
        .expect(201)

      expect(response.body).toEqual({
        id: expect.any(String),
        cropYear: createPlantedCropDto.cropYear,
        plantedArea: createPlantedCropDto.plantedArea,
        farmId,
        cultureId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve rejeitar plantio com fazenda inexistente', async () => {
      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        farmId: '123e4567-e89b-12d3-a456-426614174000',
        cultureId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send(createPlantedCropDto)

      expectNotFoundError(response, 'Fazenda')
    })

    it('deve rejeitar plantio com cultura inexistente', async () => {
      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        farmId,
        cultureId: '123e4567-e89b-12d3-a456-426614174000',
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send(createPlantedCropDto)

      expectNotFoundError(response, 'Cultura')
    })

    it('deve rejeitar dados obrigatórios ausentes', async () => {
      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send({})

      expectValidationError(response, 'farmId')
      expectValidationError(response, 'cultureId')
      expectValidationError(response, 'cropYear')
      expectValidationError(response, 'plantedArea')
    })

    it('deve rejeitar ano de plantio inválido', async () => {
      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        cropYear: 1800,
        farmId,
        cultureId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send(createPlantedCropDto)

      expectValidationError(response, 'cropYear')
    })

    it('deve rejeitar área plantada negativa', async () => {
      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        plantedArea: -10,
        farmId,
        cultureId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send(createPlantedCropDto)

      expectValidationError(response, 'plantedArea')
    })

    it('deve rejeitar área plantada zero', async () => {
      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        plantedArea: 0,
        farmId,
        cultureId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send(createPlantedCropDto)

      expectValidationError(response, 'plantedArea')
    })

    it('deve rejeitar área plantada maior que área da fazenda', async () => {
      const smallFarm = await createTestFarm(testApp.app, producerId, {
        ...testData.farms.valid,
        farmName: 'Fazenda Pequena',
        totalArea: 10,
        arableArea: 10,
        vegetationArea: 0,
      })

      const createPlantedCropDto = {
        ...testData.plantedCrops.valid,
        plantedArea: 20,
        farmId: smallFarm.id,
        cultureId,
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/planted-crops').send(createPlantedCropDto)

      expectValidationError(response, 'plantedArea')
    })
  })

  describe('GET /api/planted-crops', () => {
    beforeEach(async () => {
      await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })

      await request(testApp.app.getHttpServer()).post('/api/planted-crops').send({
        cropYear: 2023,
        plantedArea: 30.0,
        farmId,
        cultureId,
      })
    })

    it('deve retornar lista paginada de plantios', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/planted-crops').expect(200)

      expect(response.body).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            cropYear: expect.any(Number),
            plantedArea: expect.any(Number),
            farmId: expect.any(String),
            cultureId: expect.any(String),
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

    it('deve filtrar por ano de plantio', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/planted-crops?cropYear=2024').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].cropYear).toBe(2024)
    })

    it('deve filtrar por fazenda', async () => {
      const response = await request(testApp.app.getHttpServer()).get(`/api/planted-crops?farmId=${farmId}`).expect(200)

      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0].farmId).toBe(farmId)
    })

    it('deve filtrar por cultura', async () => {
      const response = await request(testApp.app.getHttpServer())
        .get(`/api/planted-crops?cultureId=${cultureId}`)
        .expect(200)

      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0].cultureId).toBe(cultureId)
    })

    it('deve paginar corretamente', async () => {
      for (let i = 0; i < 5; i++) {
        await request(testApp.app.getHttpServer())
          .post('/api/planted-crops')
          .send({
            cropYear: 2024 + i,
            plantedArea: 50.0 + i,
            farmId,
            cultureId,
          })
      }

      const response = await request(testApp.app.getHttpServer()).get('/api/planted-crops?page=1&limit=3').expect(200)

      expect(response.body.data).toHaveLength(3)
      expect(response.body.meta).toEqual({
        page: 1,
        limit: 3,
        total: 7,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      })
    })
  })

  describe('GET /api/planted-crops/:id', () => {
    let plantedCropId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })
        .expect(201)

      plantedCropId = response.body.id
    })

    it('deve retornar um plantio por ID', async () => {
      const response = await request(testApp.app.getHttpServer()).get(`/api/planted-crops/${plantedCropId}`).expect(200)

      expect(response.body).toEqual({
        id: plantedCropId,
        cropYear: testData.plantedCrops.valid.cropYear,
        plantedArea: testData.plantedCrops.valid.plantedArea,
        farmId,
        cultureId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).get(`/api/planted-crops/${fakeId}`)

      expectNotFoundError(response, 'Plantio')
    })

    it('deve rejeitar ID inválido', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/planted-crops/invalid-id')

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/planted-crops/:id', () => {
    let plantedCropId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })
        .expect(201)

      plantedCropId = response.body.id
    })

    it('deve atualizar um plantio', async () => {
      const updateData = {
        cropYear: 2025,
        plantedArea: 75.0,
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/planted-crops/${plantedCropId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({
        id: plantedCropId,
        cropYear: updateData.cropYear,
        plantedArea: updateData.plantedArea,
        farmId,
        cultureId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve atualizar apenas o ano de plantio', async () => {
      const updateData = {
        cropYear: 2025,
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/planted-crops/${plantedCropId}`)
        .send(updateData)
        .expect(200)

      expect(response.body.cropYear).toBe(updateData.cropYear)
      expect(response.body.plantedArea).toBe(testData.plantedCrops.valid.plantedArea)
    })

    it('deve rejeitar atualização com dados inválidos', async () => {
      const updateData = {
        cropYear: 1800,
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/planted-crops/${plantedCropId}`)
        .send(updateData)

      expectValidationError(response, 'cropYear')
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData = { cropYear: 2025 }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/planted-crops/${fakeId}`).send(updateData)

      expectNotFoundError(response, 'Plantio')
    })

    it('deve rejeitar área plantada maior que área da fazenda', async () => {
      const updateData = {
        plantedArea: 1000,
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/planted-crops/${plantedCropId}`)
        .send(updateData)

      expectValidationError(response, 'plantedArea')
    })
  })

  describe('DELETE /api/planted-crops/:id', () => {
    let plantedCropId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })
        .expect(201)

      plantedCropId = response.body.id
    })

    it('deve remover um plantio', async () => {
      await request(testApp.app.getHttpServer()).delete(`/api/planted-crops/${plantedCropId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/planted-crops/${plantedCropId}`).expect(404)
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).delete(`/api/planted-crops/${fakeId}`)

      expectNotFoundError(response, 'Plantio')
    })
  })

  describe('Fluxos de integração', () => {
    it('deve permitir CRUD completo de um plantio', async () => {
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })
        .expect(201)

      const plantedCropId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer())
        .get(`/api/planted-crops/${plantedCropId}`)
        .expect(200)

      expect(readResponse.body.id).toBe(plantedCropId)

      const updateData = { cropYear: 2025 }
      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/api/planted-crops/${plantedCropId}`)
        .send(updateData)
        .expect(200)

      expect(updateResponse.body.cropYear).toBe(updateData.cropYear)

      await request(testApp.app.getHttpServer()).delete(`/api/planted-crops/${plantedCropId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/planted-crops/${plantedCropId}`).expect(404)
    })

    it('deve validar relacionamentos corretamente', async () => {
      const producer2 = await createTestProducer(testApp.app, testData.producers.validCNPJ)
      const farm2 = await createTestFarm(testApp.app, producer2.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda 2',
      })
      const culture2 = await createTestCulture(testApp.app, {
        cultureName: 'Milho',
        description: 'Cultura de milho',
      })

      const plantedCrop1 = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })
        .expect(201)

      const plantedCrop2 = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          cropYear: 2023,
          plantedArea: 30.0,
          farmId: farm2.id,
          cultureId: culture2.id,
        })
        .expect(201)

      expect(plantedCrop1.body.farmId).toBe(farmId)
      expect(plantedCrop1.body.cultureId).toBe(cultureId)
      expect(plantedCrop2.body.farmId).toBe(farm2.id)
      expect(plantedCrop2.body.cultureId).toBe(culture2.id)
    })

    it('deve calcular estatísticas corretamente', async () => {
      await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })

      await request(testApp.app.getHttpServer()).post('/api/planted-crops').send({
        cropYear: 2023,
        plantedArea: 30.0,
        farmId,
        cultureId,
      })

      const response = await request(testApp.app.getHttpServer()).get('/api/planted-crops').expect(200)

      expect(response.body.data).toHaveLength(2)
      expect(response.body.meta.total).toBe(2)

      const filteredResponse = await request(testApp.app.getHttpServer())
        .get('/api/planted-crops?cropYear=2024')
        .expect(200)

      expect(filteredResponse.body.data).toHaveLength(1)
      expect(filteredResponse.body.data[0].cropYear).toBe(2024)
    })

    it('deve manter integridade dos dados', async () => {
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/planted-crops')
        .send({
          ...testData.plantedCrops.valid,
          farmId,
          cultureId,
        })
        .expect(201)

      const plantedCropId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer())
        .get(`/api/planted-crops/${plantedCropId}`)
        .expect(200)

      expect(readResponse.body.cropYear).toBe(testData.plantedCrops.valid.cropYear)
      expect(readResponse.body.plantedArea).toBe(testData.plantedCrops.valid.plantedArea)
      expect(readResponse.body.farmId).toBe(farmId)
      expect(readResponse.body.cultureId).toBe(cultureId)
      expect(readResponse.body.id).toBe(plantedCropId)
    })
  })
})
