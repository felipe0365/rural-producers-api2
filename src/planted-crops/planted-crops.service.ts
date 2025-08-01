import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto'
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto'
import { PlantedCrop } from './entities/planted-crop.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Farm } from 'src/farms/entities/farm.entity'
import { Culture } from 'src/culture/entities/culture.entity'

@Injectable()
export class PlantedCropsService {
  private readonly logger = new Logger(PlantedCropsService.name)

  constructor(
    @InjectRepository(PlantedCrop)
    private readonly plantedCropRepository: Repository<PlantedCrop>,
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Culture)
    private readonly cultureRepository: Repository<Culture>,
  ) {}

  async create(createPlantedCropDto: CreatePlantedCropDto): Promise<PlantedCrop> {
    this.logger.log(`Iniciando processo de criação de plantio.`)

    const { farmID, cultureID, plantedArea, harvestYear } = createPlantedCropDto

    try {
      const farm = await this.farmRepository.findOne({ where: { id: farmID }, relations: ['plantedCrops'] })

      if (!farm) {
        this.logger.warn(`Fazenda com ID ${farmID} não encontrada para criar plantio.`)
        throw new NotFoundException(`Fazenda com ID: ${farmID} não encontrada`)
      }

      const culture = await this.cultureRepository.findOne({ where: { id: cultureID } })

      if (!culture) {
        this.logger.warn(`Cultura com ID ${cultureID} não encontrada para criar plantio.`)
        throw new NotFoundException(`Cultura com ID: ${cultureID} não encontrada`)
      }

      const totalPlantedArea = farm.plantedCrops.reduce((sum, crop) => sum + Number(crop.plantedArea), 0)

      if (totalPlantedArea + plantedArea > farm.totalArea) {
        this.logger.warn(
          `Área plantada (${plantedArea}ha) + área total existente (${totalPlantedArea}ha) excede área da fazenda (${farm.totalArea}ha).`,
        )
        throw new BadRequestException('Área total plantada excede a área total da fazenda')
      }

      const newPlantedCrop = this.plantedCropRepository.create({
        ...createPlantedCropDto,
        farm: farm,
        culture: culture,
      })

      const savedPlantedCrop = await this.plantedCropRepository.save(newPlantedCrop)

      this.logger.log(
        `Plantio de ${culture.name} (${plantedArea}ha) criado com sucesso na fazenda ${farm.farmName} (ID: ${savedPlantedCrop.id}).`,
      )
      return savedPlantedCrop
    } catch (error) {
      this.logger.error(`Falha ao criar plantio: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(): Promise<PlantedCrop[]> {
    this.logger.log('Buscando todos os plantios')
    return this.plantedCropRepository.find()
  }

  async findOne(id: string): Promise<PlantedCrop> {
    this.logger.log(`Buscando plantio com ID: ${id}`)

    const plantedCrop = await this.plantedCropRepository.findOne({ where: { id }, relations: ['farm', 'culture'] })

    if (!plantedCrop) {
      this.logger.warn(`Plantio com o ID ${id} não encontrado.`)
      throw new NotFoundException(`PlantedCrop com ID: ${id} não encontrada`)
    }

    this.logger.log(`Plantio ${plantedCrop.culture.name} (ID: ${id}) encontrado com sucesso.`)
    return plantedCrop
  }

  async update(id: string, updatePlantedCropDto: UpdatePlantedCropDto): Promise<PlantedCrop> {
    this.logger.log(`Atualizando plantio com ID: ${id}`)

    try {
      const plantedCrop = await this.plantedCropRepository.findOne({ where: { id }, relations: ['farm', 'culture'] })

      if (!plantedCrop) {
        this.logger.warn(`Plantio com o ID ${id} não encontrado para atualização.`)
        throw new NotFoundException(`PlantedCrop com ID: ${id} não encontrada`)
      }

      const updatedPlantedCrop = await this.plantedCropRepository.save(updatePlantedCropDto)

      this.logger.log(`Plantio ${plantedCrop.culture.name} (ID: ${id}) atualizado com sucesso.`)
      return updatedPlantedCrop
    } catch (error) {
      this.logger.error(`Falha ao atualizar plantio ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo plantio com ID: ${id}`)

    try {
      const plantedCrop = await this.plantedCropRepository.findOne({ where: { id }, relations: ['farm', 'culture'] })

      if (!plantedCrop) {
        this.logger.warn(`Plantio com o ID ${id} não encontrado para remoção.`)
        throw new NotFoundException(`PlantedCrop com ID: ${id} não encontrada`)
      }

      await this.plantedCropRepository.remove(plantedCrop)
      this.logger.log(`Plantio ${plantedCrop.culture.name} (ID: ${id}) removido com sucesso.`)
    } catch (error) {
      this.logger.error(`Falha ao remover plantio ${id}: ${error.message}`, error.stack)
      throw error
    }
  }
}
