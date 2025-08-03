import request from 'supertest'
import {
  createTestApp,
  cleanupTestDatabase,
  closeTestApp,
  testData,
  createTestProducer,
  createTestFarm,
  TestApp,
} from './helpers/test-setup'

describe('DashboardController (e2e)', () => {
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

  describe('GET /api/dashboard', () => {
    it('deve retornar dashboard vazio quando não há dados', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body).toEqual({
        totalProducers: 0,
        totalFarms: 0,
        totalArea: 0,
        totalArableArea: 0,
        totalVegetationArea: 0,
        farmsByState: [],
        farmsByCrop: [],
      })
    })

    it('deve retornar estatísticas corretas com dados', async () => {
      const producer1 = await createTestProducer(testApp.app)
      const producer2 = await createTestProducer(testApp.app, testData.producers.validCNPJ)

      const farm1 = await createTestFarm(testApp.app, producer1.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda 1',
        state: 'SP',
        totalArea: 100,
        arableArea: 70,
        vegetationArea: 30,
      })

      const farm2 = await createTestFarm(testApp.app, producer2.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda 2',
        state: 'RJ',
        totalArea: 200,
        arableArea: 150,
        vegetationArea: 50,
      })

      const response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body).toEqual({
        totalProducers: 2,
        totalFarms: 2,
        totalArea: 300,
        totalArableArea: 220,
        totalVegetationArea: 80,
        farmsByState: expect.arrayContaining([
          expect.objectContaining({
            state: 'SP',
            count: 1,
          }),
          expect.objectContaining({
            state: 'RJ',
            count: 1,
          }),
        ]),
        farmsByCrop: [],
      })
    })

    it('deve calcular estatísticas por estado corretamente', async () => {
      const producer = await createTestProducer(testApp.app)

      await createTestFarm(testApp.app, producer.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda SP 1',
        state: 'SP',
      })

      await createTestFarm(testApp.app, producer.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda SP 2',
        state: 'SP',
      })

      await createTestFarm(testApp.app, producer.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda RJ',
        state: 'RJ',
      })

      const response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalFarms).toBe(3)
      expect(response.body.farmsByState).toHaveLength(2)

      const spState = response.body.farmsByState.find((s: any) => s.state === 'SP')
      const rjState = response.body.farmsByState.find((s: any) => s.state === 'RJ')

      expect(spState.count).toBe(2)
      expect(rjState.count).toBe(1)
    })

    it('deve calcular áreas corretamente', async () => {
      const producer = await createTestProducer(testApp.app)

      await createTestFarm(testApp.app, producer.id, {
        ...testData.farms.valid,
        totalArea: 100,
        arableArea: 60,
        vegetationArea: 40,
      })

      await createTestFarm(testApp.app, producer.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda 2',
        totalArea: 150,
        arableArea: 100,
        vegetationArea: 50,
      })

      const response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalArea).toBe(250)
      expect(response.body.totalArableArea).toBe(160)
      expect(response.body.totalVegetationArea).toBe(90)
    })

    it('deve lidar com fazendas sem áreas definidas', async () => {
      const producer = await createTestProducer(testApp.app)

      await createTestFarm(testApp.app, producer.id, {
        ...testData.farms.valid,
        totalArea: 0,
        arableArea: 0,
        vegetationArea: 0,
      })

      const response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalArea).toBe(0)
      expect(response.body.totalArableArea).toBe(0)
      expect(response.body.totalVegetationArea).toBe(0)
    })

    it('deve retornar dados consistentes em múltiplas chamadas', async () => {
      const producer = await createTestProducer(testApp.app)
      await createTestFarm(testApp.app, producer.id, testData.farms.valid)

      const response1 = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      const response2 = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response1.body).toEqual(response2.body)
      expect(response1.body.totalProducers).toBe(1)
      expect(response1.body.totalFarms).toBe(1)
    })
  })

  describe('Fluxos de integração', () => {
    it('deve atualizar estatísticas após criar/remover entidades', async () => {
      let response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalProducers).toBe(0)
      expect(response.body.totalFarms).toBe(0)

      const producer = await createTestProducer(testApp.app)

      response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalProducers).toBe(1)
      expect(response.body.totalFarms).toBe(0)

      await createTestFarm(testApp.app, producer.id, testData.farms.valid)

      response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalProducers).toBe(1)
      expect(response.body.totalFarms).toBe(1)
      expect(response.body.totalArea).toBe(testData.farms.valid.totalArea)
    })

    it('deve calcular estatísticas com dados complexos', async () => {
      const producer1 = await createTestProducer(testApp.app, testData.producers.validCPF)
      const producer2 = await createTestProducer(testApp.app, testData.producers.validCNPJ)

      await createTestFarm(testApp.app, producer1.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda Grande',
        state: 'SP',
        totalArea: 500,
        arableArea: 400,
        vegetationArea: 100,
      })

      await createTestFarm(testApp.app, producer2.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda Média',
        state: 'RJ',
        totalArea: 300,
        arableArea: 200,
        vegetationArea: 100,
      })

      await createTestFarm(testApp.app, producer1.id, {
        ...testData.farms.valid,
        farmName: 'Fazenda Pequena',
        state: 'SP',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
      })

      const response = await request(testApp.app.getHttpServer()).get('/api/dashboard').expect(200)

      expect(response.body.totalProducers).toBe(2)
      expect(response.body.totalFarms).toBe(3)
      expect(response.body.totalArea).toBe(900) // 500 + 300 + 100
      expect(response.body.totalArableArea).toBe(680) // 400 + 200 + 80
      expect(response.body.totalVegetationArea).toBe(220) // 100 + 100 + 20

      expect(response.body.farmsByState).toHaveLength(2)

      const spState = response.body.farmsByState.find((s: any) => s.state === 'SP')
      const rjState = response.body.farmsByState.find((s: any) => s.state === 'RJ')

      expect(spState.count).toBe(2)
      expect(rjState.count).toBe(1)
    })
  })
})
