import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto'
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto'
import { PlantedCrop } from './entities/planted-crop.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Farm } from 'src/farms/entities/farm.entity'
import { Culture } from 'src/culture/entities/culture.entity'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterPlantedCropDto } from './dto/filter-planted-crop.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

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

    const { harvest, cultures, plantedAreas } = createPlantedCropDto

    try {
      // Validar se as arrays têm o mesmo tamanho
      if (cultures.length !== plantedAreas.length) {
        throw new BadRequestException('O número de culturas deve ser igual ao número de áreas plantadas')
      }

      // Validar se todas as áreas são positivas
      if (plantedAreas.some((area) => area <= 0)) {
        throw new BadRequestException('Todas as áreas plantadas devem ser maiores que zero')
      }

      const newPlantedCrop = this.plantedCropRepository.create({
        harvest,
        cultures,
        plantedAreas,
      })

      const savedPlantedCrop = await this.plantedCropRepository.save(newPlantedCrop)

      this.logger.log(`Plantio criado com sucesso (ID: ${savedPlantedCrop.id}). Culturas: ${cultures.join(', ')}`)
      return savedPlantedCrop
    } catch (error) {
      this.logger.error(`Falha ao criar plantio: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(
    paginationDto: PaginationDto,
    filterDto: FilterPlantedCropDto,
  ): Promise<PaginatedResponseDto<PlantedCrop>> {
    this.logger.log('Buscando plantios com paginação e filtros')

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto
    const skip = (page - 1) * limit

    const queryBuilder = this.plantedCropRepository
      .createQueryBuilder('plantedCrop')
      .leftJoinAndSelect('plantedCrop.farm', 'farm')

    if (filterDto.farmId) {
      queryBuilder.andWhere('plantedCrop.farmId = :farmId', {
        farmId: filterDto.farmId,
      })
    }

    if (filterDto.cultureId) {
      // Buscar por cultura específica no array de culturas
      queryBuilder.andWhere('plantedCrop.cultures @> ARRAY[:cultureId]::varchar[]', {
        cultureId: filterDto.cultureId,
      })
    }

    if (filterDto.minArea) {
      // Buscar por área mínima no array de áreas plantadas
      queryBuilder.andWhere('EXISTS (SELECT 1 FROM unnest(plantedCrop.plantedAreas) AS area WHERE area >= :minArea)', {
        minArea: filterDto.minArea,
      })
    }

    if (filterDto.maxArea) {
      // Buscar por área máxima no array de áreas plantadas
      queryBuilder.andWhere('EXISTS (SELECT 1 FROM unnest(plantedCrop.plantedAreas) AS area WHERE area <= :maxArea)', {
        maxArea: filterDto.maxArea,
      })
    }

    queryBuilder.orderBy(`plantedCrop.${sortBy}`, sortOrder)

    queryBuilder.skip(skip).take(limit)

    const [data, total] = await queryBuilder.getManyAndCount()

    this.logger.log(`Encontrados ${total} plantios, retornando página ${page} com ${data.length} registros`)

    return new PaginatedResponseDto(data, page, limit, total)
  }

  async findOne(id: string): Promise<PlantedCrop> {
    this.logger.log(`Buscando plantio com ID: ${id}`)

    const plantedCrop = await this.plantedCropRepository.findOne({
      where: { id },
      relations: ['farm'],
    })

    if (!plantedCrop) {
      this.logger.warn(`Plantio com ID ${id} não encontrado.`)
      throw new NotFoundException(`Plantio com ID: ${id} não encontrado`)
    }

    this.logger.log(`Plantio (ID: ${id}) encontrado com sucesso.`)
    return plantedCrop
  }

  async update(id: string, updatePlantedCropDto: UpdatePlantedCropDto): Promise<PlantedCrop> {
    this.logger.log(`Iniciando atualização do plantio com ID: ${id}`)

    const plantedCrop = await this.findOne(id)

    try {
      const updatedPlantedCrop = this.plantedCropRepository.merge(plantedCrop, updatePlantedCropDto)
      const savedPlantedCrop = await this.plantedCropRepository.save(updatedPlantedCrop)

      this.logger.log(`Plantio (ID: ${id}) atualizado com sucesso.`)
      return savedPlantedCrop
    } catch (error) {
      this.logger.error(`Falha ao atualizar plantio: ${error.message}`, error.stack)
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Iniciando remoção do plantio com ID: ${id}`)

    const plantedCrop = await this.findOne(id)

    try {
      await this.plantedCropRepository.remove(plantedCrop)
      this.logger.log(`Plantio (ID: ${id}) removido com sucesso.`)
    } catch (error) {
      this.logger.error(`Falha ao remover plantio: ${error.message}`, error.stack)
      throw error
    }
  }
}
