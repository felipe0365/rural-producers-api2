import { Test, TestingModule } from '@nestjs/testing'
import { CultureController } from './culture.controller'
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

describe('CultureController', () => {
  let controller: CultureController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultureController],
      providers: [
        CultureService,
        {
          provide: getRepositoryToken(Culture),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<CultureController>(CultureController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
