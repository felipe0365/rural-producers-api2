import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Culture } from 'src/culture/entities/culture.entity'
import { Farm } from 'src/farms/entities/farm.entity'
import { PlantedCrop } from 'src/planted-crops/entities/planted-crop.entity'
import { Repository } from 'typeorm'
import { DashboardResponseDto } from './dto/dashboard-response.dto'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(Culture)
    private cultureRepository: Repository<Culture>,
  ) {}

  async getDashboardData(): Promise<DashboardResponseDto> {
    const [totalFarms, totalArea, byState, byCulture, byLandUse] = await Promise.all([
      this.getTotalFarms(),
      this.getTotalArea(),
      this.getFarmsByState(),
      this.getCultureByPlantedArea(),
      this.getTotalLandUse(),
    ])

    return {
      totalFarms,
      totalArea,
      byState,
      byCulture,
      byLandUse,
    }
  }

  private async getTotalFarms(): Promise<number> {
    return this.farmRepository.count()
  }

  private async getTotalArea(): Promise<number> {
    const { totalAreaSum } = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.totalArea)', 'totalAreaSum')
      .getRawOne()
    return Number(totalAreaSum) || 0
  }

  private async getFarmsByState(): Promise<{ name: string; value: number }[]> {
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy('farm.state')
      .getRawMany()

    return result.map((item) => ({ ...item, value: Number(item.value) }))
  }

  private async getCultureByPlantedArea(): Promise<{ name: string; value: number }[]> {
    const result = await this.cultureRepository
      .createQueryBuilder('culture')
      .leftJoin('culture.plantedCrops', 'plantedCrop')
      .select('culture.name', 'name')
      .addSelect('SUM(plantedCrop.plantedArea)', 'value')
      .groupBy('culture.name')
      .having('COUNT(plantedCrop.id) > 0')
      .getRawMany()

    return result.map((item) => ({ ...item, value: Number(item.value) }))
  }

  private async getTotalLandUse(): Promise<{ arableArea: number; vegetationArea: number }> {
    const { totalArable, totalVegetation } = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.arableArea)', 'totalArable')
      .addSelect('SUM(farm.vegetationArea)', 'totalVegetation')
      .getRawOne()

    return {
      arableArea: Number(totalArable) || 0,
      vegetationArea: Number(totalVegetation) || 0,
    }
  }
}
