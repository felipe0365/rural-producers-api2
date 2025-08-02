import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { DomainException } from '../common/exceptions/domain.exception'
import { CreateFarmDto } from './dto/create-farm.dto'
import { UpdateFarmDto } from './dto/update-farm.dto'
import { Farm } from './entities/farm.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Producer } from 'src/producers/entities/producer.entity'

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

  async findAll(): Promise<Farm[]> {
    this.logger.log('Buscando todas as fazendas')
    return this.farmRepository.find({
      relations: ['producer'],
    })
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
