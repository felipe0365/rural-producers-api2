import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { ConfigModule } from '@nestjs/config'
import { ProducersModule } from '../../src/producers/producers.module'
import { FarmsModule } from '../../src/farms/farms.module'
import { CultureModule } from '../../src/culture/culture.module'
import { PlantedCropsModule } from '../../src/planted-crops/planted-crops.module'
import { DashboardModule } from '../../src/dashboard/dashboard.module'
import { AppController } from '../../src/app.controller'
import { AppService } from '../../src/app.service'

export interface TestApp {
  app: INestApplication
  dataSource: DataSource
  moduleFixture: TestingModule
}

export async function createTestApp(): Promise<TestApp> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [
          () => ({
            DB_HOST: undefined,
            DB_USERNAME: undefined,
          }),
        ],
      }),
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        autoLoadEntities: true,
        synchronize: true,
        dropSchema: true,
        logging: false,
      }),
      ProducersModule,
      FarmsModule,
      CultureModule,
      PlantedCropsModule,
      DashboardModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  }).compile()

  const app = moduleFixture.createNestApplication()

  // Configurar pipes globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  // Configurar prefixo da API
  app.setGlobalPrefix('api')

  await app.init()

  const dataSource = moduleFixture.get<DataSource>(DataSource)

  return {
    app,
    dataSource,
    moduleFixture,
  }
}

export async function cleanupTestDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name)
    await repository.clear()
  }
}

export async function closeTestApp(testApp: TestApp): Promise<void> {
  if (testApp.app) {
    await testApp.app.close()
  }
}

// Helper para criar dados de teste
export const testData = {
  producers: {
    validCPF: {
      document: '01166995585',
      documentType: 'CPF' as const,
      producerName: 'João Silva',
    },
    validCNPJ: {
      document: '12345678000195',
      documentType: 'CNPJ' as const,
      producerName: 'Empresa Teste LTDA',
    },
    invalidDocument: {
      document: '12345678901',
      documentType: 'CPF' as const,
      producerName: 'Produtor Inválido',
    },
  },
  farms: {
    valid: {
      farmName: 'Fazenda Teste',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100.5,
      arableArea: 80.0,
      vegetationArea: 20.5,
    },
    invalidArea: {
      farmName: 'Fazenda Inválida',
      city: 'São Paulo',
      state: 'SP',
      totalArea: 100.0,
      arableArea: 80.0,
      vegetationArea: 30.0, // Soma > totalArea
    },
  },
  cultures: {
    valid: {
      cultureName: 'Soja',
      description: 'Cultura de soja',
    },
  },
  plantedCrops: {
    valid: {
      cropYear: 2024,
      plantedArea: 50.0,
    },
  },
}

// Helper para validações comuns
export const expectValidationError = (response: any, field: string, message?: string) => {
  expect(response.status).toBe(400)

  // Verificar se a mensagem contém o campo ou a mensagem específica
  const hasFieldError = response.body.message.some(
    (msg: string) =>
      msg.toLowerCase().includes(field.toLowerCase()) ||
      msg.toLowerCase().includes('deve') ||
      msg.toLowerCase().includes('não pode'),
  )

  expect(hasFieldError).toBe(true)

  if (message) {
    const hasSpecificMessage = response.body.message.some((msg: string) =>
      msg.toLowerCase().includes(message.toLowerCase()),
    )
    expect(hasSpecificMessage).toBe(true)
  }
}

export const expectNotFoundError = (response: any, resource: string) => {
  expect(response.status).toBe(404)
  expect(response.body.message).toContain(resource)
}

export const expectConflictError = (response: any, message?: string) => {
  expect(response.status).toBe(409)
  if (message) {
    expect(response.body.message).toContain(message)
  }
}

// Helper para criar entidades relacionadas
export async function createTestProducer(app: INestApplication, producerData: any = testData.producers.validCPF) {
  const response = await request(app.getHttpServer()).post('/api/producers').send(producerData).expect(201)

  return response.body
}

export async function createTestFarm(app: INestApplication, producerId: string, farmData = testData.farms.valid) {
  const response = await request(app.getHttpServer())
    .post('/api/farms')
    .send({
      ...farmData,
      producerId,
    })
    .expect(201)

  return response.body
}

export async function createTestCulture(app: INestApplication, cultureData: any = testData.cultures.valid) {
  const response = await request(app.getHttpServer()).post('/api/cultures').send(cultureData).expect(201)

  return response.body
}
