import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { DomainException } from '../common/exceptions/domain.exception'
import { CreateFarmDto } from './dto/create-farm.dto'
import { UpdateFarmDto } from './dto/update-farm.dto'
import { Farm } from './entities/farm.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Producer } from 'src/producers/entities/producer.entity'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterFarmDto } from './dto/filter-farm.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@Injectable()
export class FarmsService {
  private readonly logger = new Logger(FarmsService.name)

  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    this.logger.log(`Iniciando processo de criação de fazenda.`)

    const { producerId, ...farmData } = createFarmDto

    try {
      const producer = await this.producerRepository.findOne({
        where: { id: producerId },
      })

      if (!producer) {
        this.logger.warn(`Produtor com ID ${producerId} não encontrado para criar fazenda.`)
        throw new NotFoundException(`Produtor com ID ${producerId} não encontrado`)
      }

      const farm = this.farmRepository.create({
        ...farmData,
        producer: producer,
      })

      const savedFarm = await this.farmRepository.save(farm)

      this.logger.log(
        `Fazenda ${savedFarm.farmName} (ID: ${savedFarm.id}) criada com sucesso para o produtor ${producer.producerName}.`,
      )
      return savedFarm
    } catch (error) {
      this.logger.error(`Falha ao criar fazenda: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(
    paginationDto: PaginationDto,
    filterDto: FilterFarmDto,
  ): Promise<PaginatedResponseDto<Farm>> {
    this.logger.log('Buscando fazendas com paginação e filtros')
    
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto
    const skip = (page - 1) * limit

    // Construir query builder
    const queryBuilder = this.farmRepository.createQueryBuilder('farm')
      .leftJoinAndSelect('farm.producer', 'producer')

    // Aplicar filtros
    if (filterDto.farmName) {
      queryBuilder.andWhere('farm.farmName ILIKE :farmName', {
        farmName: `%${filterDto.farmName}%`,
      })
    }

    if (filterDto.producerId) {
      queryBuilder.andWhere('farm.producerId = :producerId', {
        producerId: filterDto.producerId,
      })
    }

    if (filterDto.minArea) {
      queryBuilder.andWhere('farm.area >= :minArea', {
        minArea: filterDto.minArea,
      })
    }

    if (filterDto.maxArea) {
      queryBuilder.andWhere('farm.area <= :maxArea', {
        maxArea: filterDto.maxArea,
      })
    }

    // Aplicar ordenação
    queryBuilder.orderBy(`farm.${sortBy}`, sortOrder)

    // Aplicar paginação
    queryBuilder.skip(skip).take(limit)

    // Executar query
    const [data, total] = await queryBuilder.getManyAndCount()

    this.logger.log(`Encontradas ${total} fazendas, retornando página ${page} com ${data.length} registros`)

    return new PaginatedResponseDto(data, page, limit, total)
  }

  async findOne(id: string): Promise<Farm> {
    this.logger.log(`Buscando fazenda com ID: ${id}`)

    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer'],
    })

    if (!farm) {
      this.logger.warn(`Fazenda com o ID ${id} não encontrada.`)
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`)
    }

    this.logger.log(`Fazenda ${farm.farmName} (ID: ${id}) encontrada com sucesso.`)
    return farm
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    this.logger.log(`Atualizando fazenda com ID: ${id}`)

    try {
      const farm = await this.farmRepository.findOne({
        where: { id },
      })

      if (!farm) {
        this.logger.warn(`Fazenda com o ID ${id} não encontrada para atualização.`)
        throw new NotFoundException(`Fazenda com ID ${id} não encontrada`)
      }

      const updatedFarm = this.farmRepository.merge(farm, updateFarmDto)
      const savedFarm = await this.farmRepository.save(updatedFarm)

      this.logger.log(`Fazenda ${savedFarm.farmName} (ID: ${id}) atualizada com sucesso.`)
      return savedFarm
    } catch (error) {
      this.logger.error(`Falha ao atualizar fazenda ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo fazenda com ID: ${id}`)

    try {
      const farm = await this.farmRepository.findOne({
        where: { id },
      })

      if (!farm) {
        this.logger.warn(`Fazenda com o ID ${id} não encontrada para remoção.`)
        throw new NotFoundException(`Fazenda com ID ${id} não encontrada`)
      }

      await this.farmRepository.remove(farm)
      this.logger.log(`Fazenda ${farm.farmName} (ID: ${id}) removida com sucesso.`)
    } catch (error) {
      this.logger.error(`Falha ao remover fazenda ${id}: ${error.message}`, error.stack)
      throw error
    }
  }
}
