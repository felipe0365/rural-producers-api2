import { Test, TestingModule } from '@nestjs/testing'
import { ProducersService } from './producers.service'
import { Repository } from 'typeorm'
import { DocumentType, Producer } from './entities/producer.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateProducerDto } from './dto/create-producer.dto'
import { ConflictException, NotFoundException } from '@nestjs/common'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Producer> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
})

describe('ProducersService', () => {
  let service: ProducersService
  let producerRepository: MockRepository<Producer>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: getRepositoryToken(Producer),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<ProducersService>(ProducersService)
    producerRepository = module.get<MockRepository<Producer>>(getRepositoryToken(Producer))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('deve criar um produtor', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '47449630567',
        documentType: DocumentType.CPF,
        producerName: 'Teste Producer',
      }
      const expectedProducer = { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f', ...createProducerDto }

      producerRepository.findOne!.mockResolvedValue(null)
      producerRepository.save!.mockResolvedValue(expectedProducer)
      producerRepository.create!.mockReturnValue(expectedProducer)

      const result = await service.create(createProducerDto)

      expect(result).toEqual(expectedProducer)
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { document: createProducerDto.document },
      })
      expect(producerRepository.save).toHaveBeenCalledWith(expectedProducer)
      expect(producerRepository.create).toHaveBeenCalledWith(createProducerDto)
    })

    it('deve lançar um erro se o produtor já existe', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '47449630567',
        documentType: DocumentType.CPF,
        producerName: 'Teste Producer',
      }
      const existingProducer = { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f', ...createProducerDto }

      producerRepository.findOne!.mockResolvedValue(existingProducer)

      await expect(service.create(createProducerDto)).rejects.toThrow(
        new ConflictException('Produtor com o documento 47449630567 já existe.'),
      )
    })
  })

  describe('findOne', () => {
    it('deve retornar um produtor', async () => {
      const producer = { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f', producerName: 'Teste' } as Producer
      producerRepository.findOne!.mockResolvedValue(producer)

      const result = await service.findOne('57b79ca2-8d98-4b3f-90c2-131e39ff189f')

      expect(result).toEqual(producer)
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f' },
      })
    })

    it('deve lançar um NotFoundException se o produtor não for encontrado', async () => {
      producerRepository.findOne!.mockResolvedValue(null)

      await expect(service.findOne('57b79ca2-8d98-4b3f-90c2-131e39ff189f')).rejects.toThrow(
        new NotFoundException('Produtor com o ID 57b79ca2-8d98-4b3f-90c2-131e39ff189f não encontrado.'),
      )
    })
  })
})
