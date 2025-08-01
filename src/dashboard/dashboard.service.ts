import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Culture } from 'src/culture/entities/culture.entity'
import { Farm } from 'src/farms/entities/farm.entity'
import { PlantedCrop } from 'src/planted-crops/entities/planted-crop.entity'
import { Repository } from 'typeorm'
import { DashboardResponseDto } from './dto/dashboard-response.dto'

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name)

  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(Culture)
    private cultureRepository: Repository<Culture>,
  ) {}

  async getDashboardData(): Promise<DashboardResponseDto> {
    this.logger.log('Iniciando busca de dados do dashboard')

    try {
      const [totalFarms, totalArea, byState, byCulture, byLandUse] = await Promise.all([
        this.getTotalFarms(),
        this.getTotalArea(),
        this.getFarmsByState(),
        this.getCultureByPlantedArea(),
        this.getTotalLandUse(),
      ])

      const dashboardData = {
        totalFarms,
        totalArea,
        byState,
        byCulture,
        byLandUse,
      }

      this.logger.log(
        `Dashboard gerado com sucesso: ${totalFarms} fazendas, ${totalArea}ha total, ${byState.length} estados, ${byCulture.length} culturas`,
      )
      return dashboardData
    } catch (error) {
      this.logger.error(`Falha ao gerar dados do dashboard: ${error.message}`, error.stack)
      throw error
    }
  }

  private async getTotalFarms(): Promise<number> {
    this.logger.debug('Buscando total de fazendas')
    const count = await this.farmRepository.count()
    this.logger.debug(`Total de fazendas encontradas: ${count}`)
    return count
  }

  private async getTotalArea(): Promise<number> {
    this.logger.debug('Buscando área total das fazendas')
    const { totalAreaSum } = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.totalArea)', 'totalAreaSum')
      .getRawOne()
    const totalArea = Number(totalAreaSum) || 0
    this.logger.debug(`Área total das fazendas: ${totalArea}ha`)
    return totalArea
  }

  private async getFarmsByState(): Promise<{ name: string; value: number }[]> {
    this.logger.debug('Buscando fazendas por estado')
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy('farm.state')
      .getRawMany()

    const farmsByState = result.map((item) => ({ ...item, value: Number(item.value) }))
    this.logger.debug(`Fazendas por estado encontradas: ${farmsByState.length} estados`)
    return farmsByState
  }

  private async getCultureByPlantedArea(): Promise<{ name: string; value: number }[]> {
    this.logger.debug('Buscando culturas por área plantada')
    const result = await this.cultureRepository
      .createQueryBuilder('culture')
      .leftJoin('culture.plantedCrops', 'plantedCrop')
      .select('culture.name', 'name')
      .addSelect('SUM(plantedCrop.plantedArea)', 'value')
      .groupBy('culture.name')
      .having('COUNT(plantedCrop.id) > 0')
      .getRawMany()

    const cultureByArea = result.map((item) => ({ ...item, value: Number(item.value) }))
    this.logger.debug(`Culturas por área plantada encontradas: ${cultureByArea.length} culturas`)
    return cultureByArea
  }

  private async getTotalLandUse(): Promise<{ arableArea: number; vegetationArea: number }> {
    this.logger.debug('Buscando uso total do solo')
    const { totalArable, totalVegetation } = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.arableArea)', 'totalArable')
      .addSelect('SUM(farm.vegetationArea)', 'totalVegetation')
      .getRawOne()

    const landUse = {
      arableArea: Number(totalArable) || 0,
      vegetationArea: Number(totalVegetation) || 0,
    }

    this.logger.debug(`Uso do solo: ${landUse.arableArea}ha agricultável, ${landUse.vegetationArea}ha vegetação`)
    return landUse
  }
}
