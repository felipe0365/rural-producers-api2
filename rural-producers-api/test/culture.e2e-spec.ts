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

describe('CultureController (e2e)', () => {
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

  describe('POST /api/cultures', () => {
    it('deve criar uma cultura válida', async () => {
      const createCultureDto = testData.cultures.valid

      const response = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(createCultureDto)
        .expect(201)

      expect(response.body).toEqual({
        id: expect.any(String),
        name: createCultureDto.cultureName,
        description: createCultureDto.description,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve rejeitar cultura com nome duplicado', async () => {
      const createCultureDto = testData.cultures.valid

      await request(testApp.app.getHttpServer()).post('/api/cultures').send(createCultureDto).expect(201)

      const response = await request(testApp.app.getHttpServer()).post('/api/cultures').send(createCultureDto)

      expectConflictError(response, 'já existe')
    })

    it('deve rejeitar dados obrigatórios ausentes', async () => {
      const response = await request(testApp.app.getHttpServer()).post('/api/cultures').send({})

      expectValidationError(response, 'name')
    })

    it('deve rejeitar nome muito curto', async () => {
      const createCultureDto = {
        ...testData.cultures.valid,
        cultureName: 'So',
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/cultures').send(createCultureDto)

      expectValidationError(response, 'name')
    })

    it('deve rejeitar nome muito longo', async () => {
      const createCultureDto = {
        ...testData.cultures.valid,
        cultureName: 'A'.repeat(256),
      }

      const response = await request(testApp.app.getHttpServer()).post('/api/cultures').send(createCultureDto)

      expectValidationError(response, 'name')
    })

    it('deve aceitar cultura sem descrição', async () => {
      const createCultureDto = {
        cultureName: 'Milho',
      }

      const response = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(createCultureDto)
        .expect(201)

      expect(response.body.name).toBe('Milho')
      expect(response.body.description).toBeNull()
    })
  })

  describe('GET /api/cultures', () => {
    beforeEach(async () => {
      await request(testApp.app.getHttpServer()).post('/api/cultures').send(testData.cultures.valid)

      await request(testApp.app.getHttpServer()).post('/api/cultures').send({
        cultureName: 'Milho',
        description: 'Cultura de milho',
      })
    })

    it('deve retornar lista paginada de culturas', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/cultures').expect(200)

      expect(response.body).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
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

    it('deve filtrar por nome da cultura', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/cultures?name=Soja').expect(200)

      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].name).toBe('Soja')
    })

    it('deve paginar corretamente', async () => {
      for (let i = 0; i < 5; i++) {
        await request(testApp.app.getHttpServer())
          .post('/api/cultures')
          .send({
            cultureName: `Cultura ${i + 3}`,
            description: `Descrição ${i + 3}`,
          })
      }

      const response = await request(testApp.app.getHttpServer()).get('/api/cultures?page=1&limit=3').expect(200)

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

  describe('GET /api/cultures/:id', () => {
    let cultureId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(testData.cultures.valid)
        .expect(201)

      cultureId = response.body.id
    })

    it('deve retornar uma cultura por ID', async () => {
      const response = await request(testApp.app.getHttpServer()).get(`/api/cultures/${cultureId}`).expect(200)

      expect(response.body).toEqual({
        id: cultureId,
        name: testData.cultures.valid.cultureName,
        description: testData.cultures.valid.description,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).get(`/api/cultures/${fakeId}`)

      expectNotFoundError(response, 'Cultura')
    })

    it('deve rejeitar ID inválido', async () => {
      const response = await request(testApp.app.getHttpServer()).get('/api/cultures/invalid-id')

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /api/cultures/:id', () => {
    let cultureId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(testData.cultures.valid)
        .expect(201)

      cultureId = response.body.id
    })

    it('deve atualizar uma cultura', async () => {
      const updateData = {
        name: 'Soja Atualizada',
        description: 'Descrição atualizada',
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/cultures/${cultureId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({
        id: cultureId,
        name: updateData.name,
        description: updateData.description,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('deve atualizar apenas o nome', async () => {
      const updateData = {
        name: 'Novo Nome',
      }

      const response = await request(testApp.app.getHttpServer())
        .patch(`/api/cultures/${cultureId}`)
        .send(updateData)
        .expect(200)

      expect(response.body.name).toBe(updateData.name)
      expect(response.body.description).toBe(testData.cultures.valid.description)
    })

    it('deve rejeitar atualização com dados inválidos', async () => {
      const updateData = {
        name: 'So',
      }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/cultures/${cultureId}`).send(updateData)

      expectValidationError(response, 'name')
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'
      const updateData = { name: 'Teste' }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/cultures/${fakeId}`).send(updateData)

      expectNotFoundError(response, 'Cultura')
    })

    it('deve rejeitar atualização com nome duplicado', async () => {
      await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send({
          cultureName: 'Milho',
          description: 'Cultura de milho',
        })
        .expect(201)

      const updateData = { name: 'Milho' }

      const response = await request(testApp.app.getHttpServer()).patch(`/api/cultures/${cultureId}`).send(updateData)

      expectConflictError(response, 'já existe')
    })
  })

  describe('DELETE /api/cultures/:id', () => {
    let cultureId: string

    beforeEach(async () => {
      const response = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(testData.cultures.valid)
        .expect(201)

      cultureId = response.body.id
    })

    it('deve remover uma cultura', async () => {
      await request(testApp.app.getHttpServer()).delete(`/api/cultures/${cultureId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/cultures/${cultureId}`).expect(404)
    })

    it('deve retornar 404 para ID inexistente', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const response = await request(testApp.app.getHttpServer()).delete(`/api/cultures/${fakeId}`)

      expectNotFoundError(response, 'Cultura')
    })
  })

  describe('Fluxos de integração', () => {
    it('deve permitir CRUD completo de uma cultura', async () => {
      // CREATE
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(testData.cultures.valid)
        .expect(201)

      const cultureId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer()).get(`/api/cultures/${cultureId}`).expect(200)

      expect(readResponse.body.id).toBe(cultureId)

      const updateData = { name: 'Cultura Atualizada' }
      const updateResponse = await request(testApp.app.getHttpServer())
        .patch(`/api/cultures/${cultureId}`)
        .send(updateData)
        .expect(200)

      expect(updateResponse.body.name).toBe(updateData.name)

      await request(testApp.app.getHttpServer()).delete(`/api/cultures/${cultureId}`).expect(200)

      await request(testApp.app.getHttpServer()).get(`/api/cultures/${cultureId}`).expect(404)
    })

    it('deve validar unicidade de nomes', async () => {
      await request(testApp.app.getHttpServer()).post('/api/cultures').send(testData.cultures.valid).expect(201)

      const response = await request(testApp.app.getHttpServer()).post('/api/cultures').send(testData.cultures.valid)

      expectConflictError(response, 'já existe')

      const listResponse = await request(testApp.app.getHttpServer()).get('/api/cultures').expect(200)

      expect(listResponse.body.data).toHaveLength(1)
      expect(listResponse.body.data[0].name).toBe('Soja')
    })

    it('deve manter integridade dos dados', async () => {
      const createResponse = await request(testApp.app.getHttpServer())
        .post('/api/cultures')
        .send(testData.cultures.valid)
        .expect(201)

      const cultureId = createResponse.body.id

      const readResponse = await request(testApp.app.getHttpServer()).get(`/api/cultures/${cultureId}`).expect(200)

      expect(readResponse.body.name).toBe(testData.cultures.valid.cultureName)
      expect(readResponse.body.description).toBe(testData.cultures.valid.description)
      expect(readResponse.body.id).toBe(cultureId)
    })
  })
})
