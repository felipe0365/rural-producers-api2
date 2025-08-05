import { Test, TestingModule } from '@nestjs/testing'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { Repository } from 'typeorm'
import { Farm } from '../farms/entities/farm.entity'
import { Culture } from '../culture/entities/culture.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DashboardResponseDto } from './dto/dashboard-response.dto'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Farm | Culture> => ({
  count: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
  })),
})

describe('DashboardController', () => {
  let controller: DashboardController
  let dashboardService: DashboardService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Farm),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Culture),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    controller = module.get<DashboardController>(DashboardController)
    dashboardService = module.get<DashboardService>(DashboardService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getDashboardData', () => {
    it('deve retornar dados do dashboard', async () => {
      const mockDashboardData: DashboardResponseDto = {
        totalFarms: 10,
        totalArea: 1000,
        byState: [
          { name: 'SP', value: 5 },
          { name: 'MG', value: 3 },
          { name: 'RJ', value: 2 },
        ],
        byCulture: [
          { name: 'Soja', value: 500 },
          { name: 'Milho', value: 300 },
          { name: 'Café', value: 200 },
        ],
        byLandUse: {
          arableArea: 800,
          vegetationArea: 200,
        },
      }

      jest.spyOn(dashboardService, 'getDashboardData').mockResolvedValue(mockDashboardData)

      const result = await controller.getDashboardData()

      expect(result).toEqual(mockDashboardData)
      expect(dashboardService.getDashboardData).toHaveBeenCalled()
    })

    it('deve propagar erro do service', async () => {
      const error = new Error('Erro interno do servidor')
      jest.spyOn(dashboardService, 'getDashboardData').mockRejectedValue(error)

      await expect(controller.getDashboardData()).rejects.toThrow('Erro interno do servidor')
    })
  })
})
