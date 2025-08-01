import { Test, TestingModule } from '@nestjs/testing'
import { PlantedCropsController } from './planted-crops.controller'
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

describe('PlantedCropsController', () => {
  let controller: PlantedCropsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantedCropsController],
      providers: [
        PlantedCropsService,
        {
          provide: getRepositoryToken(PlantedCrop),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<PlantedCropsController>(PlantedCropsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
