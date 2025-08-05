import { Test, TestingModule } from '@nestjs/testing'
import { DashboardService } from './dashboard.service'
import { Repository } from 'typeorm'
import { Farm } from '../farms/entities/farm.entity'
import { Culture } from '../culture/entities/culture.entity'
import { Producer } from '../producers/entities/producer.entity'
import { PlantedCrop } from '../planted-crops/entities/planted-crop.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DashboardResponseDto } from './dto/dashboard-response.dto'

type MockRepository<T extends Record<string, any>> = Partial<Record<keyof Repository<T>, jest.Mock>>
const createMockRepository = (): MockRepository<Farm | Culture | Producer | PlantedCrop> => ({
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
  let producerRepository: MockRepository<Producer>
  let plantedCropRepository: MockRepository<PlantedCrop>

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
        {
          provide: getRepositoryToken(Producer),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(PlantedCrop),
          useValue: createMockRepository(),
        },
      ],
    }).compile()

    service = module.get<DashboardService>(DashboardService)
    farmRepository = module.get<MockRepository<Farm>>(getRepositoryToken(Farm))
    cultureRepository = module.get<MockRepository<Culture>>(getRepositoryToken(Culture))
    producerRepository = module.get<MockRepository<Producer>>(getRepositoryToken(Producer))
    plantedCropRepository = module.get<MockRepository<PlantedCrop>>(getRepositoryToken(PlantedCrop))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getDashboardData', () => {
    it('deve retornar dados do dashboard com sucesso', async () => {
      const mockDashboardData: DashboardResponseDto = {
        totalProducers: 0,
        totalFarms: 0,
        totalArea: 0,
        byState: [],
        byCulture: [
          { name: 'Soja', value: 0 },
          { name: 'Milho', value: 0 },
          { name: 'Café', value: 0 },
        ],
        byLandUse: {
          arableArea: 0,
          vegetationArea: 0,
        },
      }

      producerRepository.count!.mockResolvedValue(mockDashboardData.totalProducers)
      farmRepository.count!.mockResolvedValue(mockDashboardData.totalFarms)
      plantedCropRepository.count!.mockResolvedValue(0) // Nenhum plantio para simplicidade

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

      mockQueryBuilder.getRawOne!.mockResolvedValueOnce({ totalAreaSum: mockDashboardData.totalArea })

      mockQueryBuilder.getRawMany!.mockResolvedValueOnce(mockDashboardData.byState)

      mockQueryBuilder.getRawMany!.mockResolvedValueOnce([
        { name: 'Soja', value: 0 },
        { name: 'Milho', value: 0 },
        { name: 'Café', value: 0 },
      ])

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
