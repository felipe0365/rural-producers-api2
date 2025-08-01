import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProducerDto } from './dto/create-producer.dto'
import { UpdateProducerDto } from './dto/update-producer.dto'
import { Producer } from './entities/producer.entity'
import { cpf, cnpj } from 'cpf-cnpj-validator'

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

  async findAll(): Promise<Producer[]> {
    this.logger.log('Buscando todos os produtores')
    return this.producerRepository.find()
  }

  async findOne(id: string): Promise<Producer> {
    this.logger.log(`Buscando produtor com ID: ${id}`)
    const producer = await this.producerRepository.findOne({ where: { id } })
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
