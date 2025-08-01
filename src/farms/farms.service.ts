import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateFarmDto } from './dto/create-farm.dto'
import { UpdateFarmDto } from './dto/update-farm.dto'
import { Farm } from './entities/farm.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Producer } from 'src/producers/entities/producer.entity'

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    const { producerId, ...farmData } = createFarmDto
    const producer = await this.producerRepository.findOne({
      where: { id: producerId },
    })

    if (!producer) {
      throw new NotFoundException(`Produtor com ID ${producerId} não encontrado`)
    }

    const farm = this.farmRepository.create({
      ...farmData,
      producer: producer,
    })

    return this.farmRepository.save(farm)
  }

  async findAll(): Promise<Farm[]> {
    return this.farmRepository.find({
      relations: ['producer'],
    })
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
      relations: ['producer'],
    })

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`)
    }

    return farm
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.farmRepository.findOne({
      where: { id },
    })

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`)
    }

    const updatedFarm = this.farmRepository.merge(farm, updateFarmDto)

    return this.farmRepository.save(updatedFarm)
  }

  async remove(id: string): Promise<void> {
    const farm = await this.farmRepository.findOne({
      where: { id },
    })

    if (!farm) {
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada`)
    }

    await this.farmRepository.remove(farm)
  }
}
