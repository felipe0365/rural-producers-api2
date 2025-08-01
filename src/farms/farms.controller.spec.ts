import { Test, TestingModule } from '@nestjs/testing'
import { FarmsController } from './farms.controller'
import { FarmsService } from './farms.service'
import { Repository } from 'typeorm'
import { Farm } from './entities/farm.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Farm> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
})

describe('FarmsController', () => {
  let controller: FarmsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        FarmsService,
        {
          provide: getRepositoryToken(Farm),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<FarmsController>(FarmsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
