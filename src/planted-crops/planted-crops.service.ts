import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto'
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto'
import { PlantedCrop } from './entities/planted-crop.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Farm } from 'src/farms/entities/farm.entity'
import { Culture } from 'src/culture/entities/culture.entity'

@Injectable()
export class PlantedCropsService {
  constructor(
    @InjectRepository(PlantedCrop)
    private readonly plantedCropRepository: Repository<PlantedCrop>,
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Culture)
    private readonly cultureRepository: Repository<Culture>,
  ) {}

  async create(createPlantedCropDto: CreatePlantedCropDto): Promise<PlantedCrop> {
    const { farmID, cultureID, plantedArea, harvestYear } = createPlantedCropDto

    const farm = await this.farmRepository.findOne({ where: { id: farmID }, relations: ['plantedCrops'] })

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID: ${farmID} não encontrada`)
    }

    const culture = await this.cultureRepository.findOne({ where: { id: cultureID } })

    if (!culture) {
      throw new NotFoundException(`Cultura com ID: ${cultureID} não encontrada`)
    }

    const totalPlantedArea = farm.plantedCrops.reduce((sum, crop) => sum + Number(crop.plantedArea), 0)

    if (totalPlantedArea + plantedArea > farm.totalArea) {
      throw new BadRequestException('Área total plantada excede a área total da fazenda')
    }

    const newPlantedCrop = this.plantedCropRepository.create({
      ...createPlantedCropDto,
      farm: farm,
      culture: culture,
    })

    return this.plantedCropRepository.save(newPlantedCrop)
  }

  async findAll(): Promise<PlantedCrop[]> {
    return this.plantedCropRepository.find()
  }

  async findOne(id: string): Promise<PlantedCrop> {
    const plantedCrop = await this.plantedCropRepository.findOne({ where: { id }, relations: ['farm', 'culture'] })

    if (!plantedCrop) {
      throw new NotFoundException(`PlantedCrop com ID: ${id} não encontrada`)
    }

    return plantedCrop
  }

  async update(id: string, updatePlantedCropDto: UpdatePlantedCropDto): Promise<PlantedCrop> {
    const plantedCrop = await this.plantedCropRepository.findOne({ where: { id }, relations: ['farm', 'culture'] })

    if (!plantedCrop) {
      throw new NotFoundException(`PlantedCrop com ID: ${id} não encontrada`)
    }

    return this.plantedCropRepository.save(updatePlantedCropDto)
  }

  async remove(id: string): Promise<void> {
    const plantedCrop = await this.plantedCropRepository.findOne({ where: { id }, relations: ['farm', 'culture'] })

    if (!plantedCrop) {
      throw new NotFoundException(`PlantedCrop com ID: ${id} não encontrada`)
    }

    await this.plantedCropRepository.remove(plantedCrop)
  }
}
