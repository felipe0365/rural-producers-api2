import { Test, TestingModule } from '@nestjs/testing'
import { ProducersService } from './producers.service'
import { Repository } from 'typeorm'
import { DocumentType, Producer } from './entities/producer.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateProducerDto } from './dto/create-producer.dto'
import { UpdateProducerDto } from './dto/update-producer.dto'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Producer> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
  preload: jest.fn(),
  remove: jest.fn(),
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

    it('deve criar um produtor com CNPJ', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '12345678000195',
        documentType: DocumentType.CNPJ,
        producerName: 'Empresa Teste',
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
    })
  })

  describe('findAll', () => {
    it('deve retornar lista paginada de produtores', async () => {
      const paginationDto = { page: 1, limit: 10 }
      const filterDto = {}
      const mockProducers = [
        { id: '1', producerName: 'Produtor 1' },
        { id: '2', producerName: 'Produtor 2' },
      ] as Producer[]
      const total = 2

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockProducers, total]),
      }

      producerRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder)

      const result = await service.findAll(paginationDto, filterDto)

      expect(result).toBeInstanceOf(PaginatedResponseDto)
      expect(result.data).toEqual(mockProducers)
      expect(result.meta.total).toBe(total)
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0)
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10)
    })

    it('deve aplicar filtros corretamente', async () => {
      const paginationDto = { page: 1, limit: 10 }
      const filterDto = {
        producerName: 'Teste',
        document: '123',
        documentType: DocumentType.CPF,
      }
      const mockProducers = [] as Producer[]
      const total = 0

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockProducers, total]),
      }

      producerRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder)

      await service.findAll(paginationDto, filterDto)

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('producer.producerName ILIKE :producerName', {
        producerName: '%Teste%',
      })
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('producer.document ILIKE :document', { document: '%123%' })
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('producer.documentType = :documentType', {
        documentType: DocumentType.CPF,
      })
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
        relations: ['farms', 'farms.plantedCrops'],
      })
    })

    it('deve lançar um NotFoundException se o produtor não for encontrado', async () => {
      producerRepository.findOne!.mockResolvedValue(null)

      await expect(service.findOne('57b79ca2-8d98-4b3f-90c2-131e39ff189f')).rejects.toThrow(
        new NotFoundException('Produtor com o ID 57b79ca2-8d98-4b3f-90c2-131e39ff189f não encontrado.'),
      )
    })
  })

  describe('update', () => {
    it('deve atualizar um produtor com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateProducerDto: UpdateProducerDto = {
        producerName: 'Produtor Atualizado',
      }
      const existingProducer = { id, producerName: 'Produtor Original' } as Producer
      const updatedProducer = { ...existingProducer, ...updateProducerDto }

      producerRepository.preload!.mockResolvedValue(existingProducer)
      producerRepository.save!.mockResolvedValue(updatedProducer)

      const result = await service.update(id, updateProducerDto)

      expect(result).toEqual(updatedProducer)
      expect(producerRepository.preload).toHaveBeenCalledWith({ id, ...updateProducerDto })
      expect(producerRepository.save).toHaveBeenCalledWith({ ...existingProducer, ...updateProducerDto })
    })

    it('deve lançar NotFoundException se produtor não for encontrado', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateProducerDto: UpdateProducerDto = {
        producerName: 'Produtor Atualizado',
      }

      producerRepository.preload!.mockResolvedValue(null)

      await expect(service.update(id, updateProducerDto)).rejects.toThrow(
        new NotFoundException(`Produtor com o ID ${id} não encontrado.`),
      )
      expect(producerRepository.preload).toHaveBeenCalledWith({ id, ...updateProducerDto })
    })
  })

  describe('remove', () => {
    it('deve remover um produtor com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const producer = {
        id,
        producerName: 'Produtor para Remover',
        farms: [],
        document: '12345678901',
        documentType: DocumentType.CPF,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Producer

      producerRepository.findOne!.mockResolvedValue(producer)
      producerRepository.remove!.mockResolvedValue(producer)

      await service.remove(id)

      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['farms', 'farms.plantedCrops'],
      })
      expect(producerRepository.remove).toHaveBeenCalledWith(producer)
    })

    it('deve lançar NotFoundException se produtor não for encontrado', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      producerRepository.findOne!.mockResolvedValue(null)

      await expect(service.remove(id)).rejects.toThrow(new NotFoundException(`Produtor com o ID ${id} não encontrado.`))
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['farms', 'farms.plantedCrops'],
      })
    })

    it('deve tratar erros durante a remoção', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const error = new Error('Erro de banco de dados')

      producerRepository.findOne!.mockRejectedValue(error)

      await expect(service.remove(id)).rejects.toThrow(error)
    })
  })
})
