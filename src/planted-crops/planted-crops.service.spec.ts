import { Test, TestingModule } from '@nestjs/testing'
import { PlantedCropsService } from './planted-crops.service'
import { Repository } from 'typeorm'
import { PlantedCrop } from './entities/planted-crop.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<PlantedCrop> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
})

describe('PlantedCropsService', () => {
  let service: PlantedCropsService
  let plantedCropRepository: MockRepository<PlantedCrop>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantedCropsService,
        {
          provide: getRepositoryToken(PlantedCrop),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<PlantedCropsService>(PlantedCropsService)
    plantedCropRepository = module.get<MockRepository<PlantedCrop>>(getRepositoryToken(PlantedCrop))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
