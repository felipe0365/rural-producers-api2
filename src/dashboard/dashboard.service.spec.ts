import { Test, TestingModule } from '@nestjs/testing'
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

describe('DashboardService', () => {
  let service: DashboardService
  let farmRepository: MockRepository<Farm>
  let cultureRepository: MockRepository<Culture>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<DashboardService>(DashboardService)
    farmRepository = module.get<MockRepository<Farm>>(getRepositoryToken(Farm))
    cultureRepository = module.get<MockRepository<Culture>>(getRepositoryToken(Culture))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getDashboardData', () => {
    it('deve retornar dados do dashboard com sucesso', async () => {
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

      // Mock dos métodos privados através dos repositórios
      farmRepository.count!.mockResolvedValue(mockDashboardData.totalFarms)

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        getRawOne: jest.fn(),
        getRawMany: jest.fn(),
      }

      farmRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder)
      cultureRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder)

      // Mock para getTotalArea
      mockQueryBuilder.getRawOne!.mockResolvedValueOnce({ totalAreaSum: mockDashboardData.totalArea })

      // Mock para getFarmsByState
      mockQueryBuilder.getRawMany!.mockResolvedValueOnce(mockDashboardData.byState)

      // Mock para getCultureByPlantedArea
      mockQueryBuilder.getRawMany!.mockResolvedValueOnce(mockDashboardData.byCulture)

      // Mock para getTotalLandUse
      mockQueryBuilder.getRawOne!.mockResolvedValueOnce({
        totalArable: mockDashboardData.byLandUse.arableArea,
        totalVegetation: mockDashboardData.byLandUse.vegetationArea,
      })

      const result = await service.getDashboardData()

      expect(result).toEqual(mockDashboardData)
      expect(farmRepository.count).toHaveBeenCalled()
      expect(farmRepository.createQueryBuilder).toHaveBeenCalled()
      expect(cultureRepository.createQueryBuilder).toHaveBeenCalled()
    })

    it('deve lançar erro quando falhar ao buscar dados', async () => {
      const error = new Error('Erro de banco de dados')
      farmRepository.count!.mockRejectedValue(error)

      await expect(service.getDashboardData()).rejects.toThrow('Erro de banco de dados')
    })
  })
})
