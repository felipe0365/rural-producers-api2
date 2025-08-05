import { Test, TestingModule } from '@nestjs/testing'
import { FarmsController } from './farms.controller'
import { FarmsService } from './farms.service'
import { Repository } from 'typeorm'
import { Farm } from './entities/farm.entity'
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
})

describe('FarmsController', () => {
  let controller: FarmsController
  let service: FarmsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmsController],
      providers: [
        {
          provide: FarmsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Farm),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<FarmsController>(FarmsController)
    service = module.get<FarmsService>(FarmsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('deve criar uma fazenda com sucesso', async () => {
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

      jest.spyOn(service, 'create').mockResolvedValue(expectedFarm as Farm)

      const result = await controller.create(createFarmDto)

      expect(result).toEqual(expectedFarm)
      expect(service.create).toHaveBeenCalledWith(createFarmDto)
    })
  })

  describe('findAll', () => {
    it('deve retornar lista paginada de fazendas', async () => {
      const paginationDto = { page: 1, limit: 10 }
      const filterDto = { farmName: 'Teste' }
      const expectedResponse = new PaginatedResponseDto([], 1, 10, 0)

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResponse)

      const result = await controller.findAll(paginationDto, filterDto)

      expect(result).toEqual(expectedResponse)
      expect(service.findAll).toHaveBeenCalledWith(paginationDto, filterDto)
    })
  })

  describe('findOne', () => {
    it('deve retornar uma fazenda por ID', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const expectedFarm = { id, farmName: 'Fazenda Teste' } as Farm

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedFarm)

      const result = await controller.findOne(id)

      expect(result).toEqual(expectedFarm)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })

    it('deve propagar erro de não encontrado', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException(`Fazenda com o ID ${id} não encontrada.`))

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('deve atualizar uma fazenda com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateFarmDto: UpdateFarmDto = {
        farmName: 'Fazenda Atualizada',
      }
      const expectedFarm = { id, ...updateFarmDto } as Farm

      jest.spyOn(service, 'update').mockResolvedValue(expectedFarm)

      const result = await controller.update(id, updateFarmDto)

      expect(result).toEqual(expectedFarm)
      expect(service.update).toHaveBeenCalledWith(id, updateFarmDto)
    })

    it('deve propagar erro de não encontrado na atualização', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'
      const updateFarmDto: UpdateFarmDto = {
        farmName: 'Fazenda Atualizada',
      }

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException(`Fazenda com o ID ${id} não encontrada.`))

      await expect(controller.update(id, updateFarmDto)).rejects.toThrow(NotFoundException)
      expect(service.update).toHaveBeenCalledWith(id, updateFarmDto)
    })
  })

  describe('remove', () => {
    it('deve remover uma fazenda com sucesso', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      jest.spyOn(service, 'remove').mockResolvedValue(undefined)

      const result = await controller.remove(id)

      expect(result).toBeUndefined()
      expect(service.remove).toHaveBeenCalledWith(id)
    })

    it('deve propagar erro de não encontrado na remoção', async () => {
      const id = '57b79ca2-8d98-4b3f-90c2-131e39ff189f'

      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException(`Fazenda com o ID ${id} não encontrada.`))

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
