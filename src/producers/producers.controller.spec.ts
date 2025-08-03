import { Test, TestingModule } from '@nestjs/testing'
import { ProducersController } from './producers.controller'
import { ProducersService } from './producers.service'
import { Repository } from 'typeorm'
import { Producer, DocumentType } from './entities/producer.entity'
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
})

describe('ProducersController', () => {
  let controller: ProducersController
  let service: ProducersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        {
          provide: ProducersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<ProducersController>(ProducersController)
    service = module.get<ProducersService>(ProducersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('deve criar um produtor com sucesso', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '47449630567',
        documentType: DocumentType.CPF,
        producerName: 'Teste Producer',
      }
      const expectedProducer = { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f', ...createProducerDto }

      jest.spyOn(service, 'create').mockResolvedValue(expectedProducer as Producer)

      const result = await controller.create(createProducerDto)

      expect(result).toEqual(expectedProducer)
      expect(service.create).toHaveBeenCalledWith(createProducerDto)
    })

    it('deve propagar erro de conflito', async () => {
      const createProducerDto: CreateProducerDto = {
        document: '47449630567',
        documentType: DocumentType.CPF,
        producerName: 'Teste Producer',
      }

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new ConflictException('Produtor com o documento 47449630567 já existe.'))

      await expect(controller.create(createProducerDto)).rejects.toThrow(ConflictException)
      expect(service.create).toHaveBeenCalledWith(createProducerDto)
    })
  })

  describe('findAll', () => {
    it('deve retornar lista paginada de produtores', async () => {
      const paginationDto = { page: 1, limit: 10 }
      const filterDto = { producerName: 'Teste' }
      const expectedResponse = new PaginatedResponseDto([], 1, 10, 0)

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResponse)

      const result = await controller.findAll(paginationDto, filterDto)

      expect(result).toEqual(expectedResponse)
      expect(service.findAll).toHaveBeenCalledWith(paginationDto, filterDto)
    })
  })

  describe('findOne', () => {
    it('deve retornar um produtor por ID', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const expectedProducer = { id, producerName: 'Teste Producer' } as Producer

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedProducer)

      const result = await controller.findOne(id)

      expect(result).toEqual(expectedProducer)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })

    it('deve propagar erro de não encontrado', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException(`Produtor com o ID ${id} não encontrado.`))

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('deve atualizar um produtor com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateProducerDto: UpdateProducerDto = {
        producerName: 'Produtor Atualizado',
      }
      const expectedProducer = { id, ...updateProducerDto } as Producer

      jest.spyOn(service, 'update').mockResolvedValue(expectedProducer)

      const result = await controller.update(id, updateProducerDto)

      expect(result).toEqual(expectedProducer)
      expect(service.update).toHaveBeenCalledWith(id, updateProducerDto)
    })

    it('deve propagar erro de não encontrado na atualização', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateProducerDto: UpdateProducerDto = {
        producerName: 'Produtor Atualizado',
      }

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException(`Produtor com o ID ${id} não encontrado.`))

      await expect(controller.update(id, updateProducerDto)).rejects.toThrow(NotFoundException)
      expect(service.update).toHaveBeenCalledWith(id, updateProducerDto)
    })
  })

  describe('remove', () => {
    it('deve remover um produtor com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      jest.spyOn(service, 'remove').mockResolvedValue(undefined)

      const result = await controller.remove(id)

      expect(result).toBeUndefined()
      expect(service.remove).toHaveBeenCalledWith(id)
    })

    it('deve propagar erro de não encontrado na remoção', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException(`Produtor com o ID ${id} não encontrado.`))

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
