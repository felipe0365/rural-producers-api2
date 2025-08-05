import { Test, TestingModule } from '@nestjs/testing'
import { FarmsService } from './farms.service'
import { Repository } from 'typeorm'
import { Farm } from './entities/farm.entity'
import { Producer } from '../producers/entities/producer.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateFarmDto } from './dto/create-farm.dto'
import { UpdateFarmDto } from './dto/update-farm.dto'
import { NotFoundException } from '@nestjs/common'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Farm> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  })),
  preload: jest.fn(),
  remove: jest.fn(),
  merge: jest.fn(),
})

describe('FarmsService', () => {
  let service: FarmsService
  let farmRepository: MockRepository<Farm>
  let producerRepository: MockRepository<Producer>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: getRepositoryToken(Farm),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<FarmsService>(FarmsService)
    farmRepository = module.get<MockRepository<Farm>>(getRepositoryToken(Farm))
    producerRepository = module.get<MockRepository<Producer>>(getRepositoryToken(Producer))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('deve criar uma fazenda', async () => {
      const createFarmDto: CreateFarmDto = {
        farmName: 'Fazenda Teste',
        city: 'São Paulo',
        state: 'SP',
        totalArea: 100.5,
        arableArea: 80.0,
        vegetationArea: 20.5,
        producerId: '57b79ca2-8d98-4b3f-90c2-131e39ff189f',
      }
      const expectedFarm = { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f', ...createFarmDto }
      const mockProducer = { id: createFarmDto.producerId, producerName: 'Produtor Teste' }
      const { producerId, ...farmData } = createFarmDto
      const createdFarm = { ...farmData, producer: mockProducer }

      producerRepository.findOne!.mockResolvedValue(mockProducer)
      farmRepository.save!.mockResolvedValue(expectedFarm)
      farmRepository.create!.mockReturnValue(createdFarm)

      const result = await service.create(createFarmDto)

      expect(result).toEqual(expectedFarm)
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        where: { id: createFarmDto.producerId },
      })
      expect(farmRepository.save).toHaveBeenCalledWith(createdFarm)
      expect(farmRepository.create).toHaveBeenCalledWith(createdFarm)
    })
  })

  describe('findAll', () => {
    it('deve retornar lista paginada de fazendas', async () => {
      const paginationDto = { page: 1, limit: 10 }
      const filterDto = {}
      const mockFarms = [
        { id: '1', farmName: 'Fazenda 1' },
        { id: '2', farmName: 'Fazenda 2' },
      ] as Farm[]
      const total = 2

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockFarms, total]),
      }

      farmRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder)

      const result = await service.findAll(paginationDto, filterDto)

      expect(result).toBeInstanceOf(PaginatedResponseDto)
      expect(result.data).toEqual(mockFarms)
      expect(result.meta.total).toBe(total)
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0)
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10)
    })

    it('deve aplicar filtros corretamente', async () => {
      const paginationDto = { page: 1, limit: 10 }
      const filterDto = {
        farmName: 'Teste',
        producerId: '123e4567-e89b-12d3-a456-426614174000',
        minArea: 100,
        maxArea: 1000,
      }
      const mockFarms = [] as Farm[]
      const total = 0

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockFarms, total]),
      }

      farmRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder)

      await service.findAll(paginationDto, filterDto)

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('farm.farmName ILIKE :farmName', { farmName: '%Teste%' })
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('farm.producerId = :producerId', {
        producerId: '123e4567-e89b-12d3-a456-426614174000',
      })
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('farm.area >= :minArea', { minArea: 100 })
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('farm.area <= :maxArea', { maxArea: 1000 })
    })
  })

  describe('findOne', () => {
    it('deve retornar uma fazenda', async () => {
      const farm = { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f', farmName: 'Teste' } as Farm
      farmRepository.findOne!.mockResolvedValue(farm)

      const result = await service.findOne('57b79ca2-8d98-4b3f-90c2-131e39ff189f')

      expect(result).toEqual(farm)
      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '57b79ca2-8d98-4b3f-90c2-131e39ff189f' },
        relations: ['producer'],
      })
    })

    it('deve lançar um NotFoundException se a fazenda não for encontrada', async () => {
      farmRepository.findOne!.mockResolvedValue(null)

      await expect(service.findOne('57b79ca2-8d98-4b3f-90c2-131e39ff189f')).rejects.toThrow(
        new NotFoundException('Fazenda com ID 57b79ca2-8d98-4b3f-90c2-131e39ff189f não encontrada'),
      )
    })
  })

  describe('update', () => {
    it('deve atualizar uma fazenda com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateFarmDto: UpdateFarmDto = {
        farmName: 'Fazenda Atualizada',
      }
      const existingFarm = { id, farmName: 'Fazenda Original' } as Farm
      const updatedFarm = { ...existingFarm, ...updateFarmDto }

      farmRepository.findOne!.mockResolvedValue(existingFarm)
      farmRepository.merge!.mockReturnValue(updatedFarm)
      farmRepository.save!.mockResolvedValue(updatedFarm)

      const result = await service.update(id, updateFarmDto)

      expect(result).toEqual(updatedFarm)
      expect(farmRepository.findOne).toHaveBeenCalledWith({ where: { id } })
      expect(farmRepository.merge).toHaveBeenCalledWith(existingFarm, updateFarmDto)
      expect(farmRepository.save).toHaveBeenCalledWith(updatedFarm)
    })

    it('deve lançar NotFoundException se fazenda não for encontrada', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateFarmDto: UpdateFarmDto = {
        farmName: 'Fazenda Atualizada',
      }

      farmRepository.findOne!.mockResolvedValue(null)

      await expect(service.update(id, updateFarmDto)).rejects.toThrow(
        new NotFoundException(`Fazenda com ID ${id} não encontrada`),
      )
      expect(farmRepository.findOne).toHaveBeenCalledWith({ where: { id } })
    })
  })

  describe('remove', () => {
    it('deve remover uma fazenda com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const farm = { id, farmName: 'Fazenda para Remover' } as Farm

      farmRepository.findOne!.mockResolvedValue(farm)
      farmRepository.remove!.mockResolvedValue(farm)

      await service.remove(id)

      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      })
      expect(farmRepository.remove).toHaveBeenCalledWith(farm)
    })

    it('deve lançar NotFoundException se fazenda não for encontrada', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      farmRepository.findOne!.mockResolvedValue(null)

      await expect(service.remove(id)).rejects.toThrow(new NotFoundException(`Fazenda com ID ${id} não encontrada`))
      expect(farmRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      })
    })
  })
})
