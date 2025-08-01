import { Test, TestingModule } from '@nestjs/testing'
import { ProducersController } from './producers.controller'
import { ProducersService } from './producers.service'
import { Repository } from 'typeorm'
import { Producer } from './entities/producer.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Producer> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
})

describe('ProducersController', () => {
  let controller: ProducersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<ProducersController>(ProducersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
