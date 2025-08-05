import { Test, TestingModule } from '@nestjs/testing'
import { CultureService } from './culture.service'
import { Repository } from 'typeorm'
import { Culture } from './entities/culture.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Culture> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
})

describe('CultureService', () => {
  let service: CultureService
  let cultureRepository: MockRepository<Culture>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CultureService,
        {
          provide: getRepositoryToken(Culture),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<CultureService>(CultureService)
    cultureRepository = module.get<MockRepository<Culture>>(getRepositoryToken(Culture))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
