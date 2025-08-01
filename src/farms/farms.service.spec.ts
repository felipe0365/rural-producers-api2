import { Test, TestingModule } from '@nestjs/testing'
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

describe('FarmsService', () => {
  let service: FarmsService
  let farmRepository: MockRepository<Farm>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: getRepositoryToken(Farm),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<FarmsService>(FarmsService)
    farmRepository = module.get<MockRepository<Farm>>(getRepositoryToken(Farm))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
