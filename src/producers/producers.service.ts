import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, ILike } from 'typeorm'
import { CreateProducerDto } from './dto/create-producer.dto'
import { UpdateProducerDto } from './dto/update-producer.dto'
import { Producer } from './entities/producer.entity'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterProducerDto } from './dto/filter-producer.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@Injectable()
export class ProducersService {
  private readonly logger = new Logger(ProducersService.name)
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    this.logger.log(`Iniciando processo de criação de produtor.`)

    const { document, documentType } = createProducerDto
    const normalizedDocument = documentType === 'CPF' ? cpf.strip(document) : cnpj.strip(document)

    try {
      const existingProducer = await this.producerRepository.findOne({
        where: { document: normalizedDocument },
      })

      if (existingProducer) {
        this.logger.warn(`Produtor com documento ${document} já existe.`)
        throw new ConflictException(`Produtor com o documento ${document} já existe.`)
      }

      const producer = this.producerRepository.create({
        ...createProducerDto,
        document: normalizedDocument,
      })

      const savedProducer = await this.producerRepository.save(producer)

      this.logger.log(`Produtor ${savedProducer.producerName} (ID: ${savedProducer.id}) criado com sucesso.`)
      return savedProducer
    } catch (error) {
      this.logger.error(`Falha ao criar produtor: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(paginationDto: PaginationDto, filterDto: FilterProducerDto): Promise<PaginatedResponseDto<Producer>> {
    this.logger.log('Buscando produtores com paginação e filtros')

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto
    const skip = (page - 1) * limit

    const queryBuilder = this.producerRepository.createQueryBuilder('producer')

    if (filterDto.producerName) {
      queryBuilder.andWhere('producer.producerName ILIKE :producerName', {
        producerName: `%${filterDto.producerName}%`,
      })
    }

    if (filterDto.document) {
      queryBuilder.andWhere('producer.document ILIKE :document', {
        document: `%${filterDto.document}%`,
      })
    }

    if (filterDto.documentType) {
      queryBuilder.andWhere('producer.documentType = :documentType', {
        documentType: filterDto.documentType,
      })
    }

    queryBuilder.orderBy(`producer.${sortBy}`, sortOrder)

    queryBuilder.skip(skip).take(limit)

    const [data, total] = await queryBuilder.getManyAndCount()

    this.logger.log(`Encontrados ${total} produtores, retornando página ${page} com ${data.length} registros`)

    return new PaginatedResponseDto(data, page, limit, total)
  }

  async findOne(id: string): Promise<Producer> {
    this.logger.log(`Buscando produtor com ID: ${id}`)
    const producer = await this.producerRepository.findOne({
      where: { id },
      relations: ['farms', 'farms.plantedCrops'],
    })
    if (!producer) {
      this.logger.warn(`Produtor com o ID ${id} não encontrado.`)
      throw new NotFoundException(`Produtor com o ID ${id} não encontrado.`)
    }
    return producer
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    this.logger.log(`Atualizando produtor com ID: ${id}`)
    const producer = await this.producerRepository.preload({ id, ...updateProducerDto })
    if (!producer) {
      this.logger.warn(`Produtor com o ID ${id} não encontrado.`)
      throw new NotFoundException(`Produtor com o ID ${id} não encontrado.`)
    }
    this.logger.log(`Salvando produtor atualizado: ${id}`)
    return this.producerRepository.save({ ...producer, ...updateProducerDto })
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo produtor com ID: ${id}`)
    const producer = await this.findOne(id)
    if (!producer) {
      this.logger.warn(`Produtor com o ID ${id} não encontrado.`)
      throw new NotFoundException(`Produtor com o ID ${id} não encontrado.`)
    }
    await this.producerRepository.remove(producer)
    this.logger.log(`Produtor com o ID ${id} removido com sucesso.`)
  }
}
