import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProducerDto } from './dto/create-producer.dto'
import { UpdateProducerDto } from './dto/update-producer.dto'
import { Producer } from './entities/producer.entity'
import { cpf, cnpj } from 'cpf-cnpj-validator'

@Injectable()
export class ProducersService {
  constructor(
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
  ) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const { document } = createProducerDto
    const normalizedDocument = createProducerDto.documentType === 'CPF' ? cpf.strip(document) : cnpj.strip(document)

    const existingProducer = await this.producerRepository.findOne({
      where: { document: normalizedDocument },
    })

    if (existingProducer) {
      throw new ConflictException(`Produtor com o documento ${document} já existe.`)
    }

    const producer = this.producerRepository.create({
      ...createProducerDto,
      document: normalizedDocument,
    })

    return this.producerRepository.save(producer)
  }

  async findAll(): Promise<Producer[]> {
    return this.producerRepository.find()
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producerRepository.findOne({ where: { id } })
    if (!producer) {
      throw new NotFoundException(`Produtor com o ID ${id} não encontrado.`)
    }
    return producer
  }

  async update(id: string, updateProducerDto: UpdateProducerDto): Promise<Producer> {
    const producer = await this.producerRepository.preload({ id, ...updateProducerDto })
    if (!producer) {
      throw new NotFoundException(`Produtor com o ID ${id} não encontrado.`)
    }
    return this.producerRepository.save({ ...producer, ...updateProducerDto })
  }

  async remove(id: string): Promise<void> {
    const producer = await this.findOne(id)
    await this.producerRepository.remove(producer)
  }
}
