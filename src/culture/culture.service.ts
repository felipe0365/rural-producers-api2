import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateCultureDto } from './dto/create-culture.dto'
import { UpdateCultureDto } from './dto/update-culture.dto'
import { Culture } from './entities/culture.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CultureService {
  constructor(
    @InjectRepository(Culture)
    private readonly cultureRepository: Repository<Culture>,
  ) {}

  async create(createCultureDto: CreateCultureDto): Promise<Culture> {
    const existingCulture = await this.cultureRepository.findOne({
      where: { name: createCultureDto.name },
    })

    if (existingCulture) {
      throw new ConflictException(`Cultura com nome: ${createCultureDto.name} já existe`)
    }

    const culture = await this.cultureRepository.create(createCultureDto)

    return this.cultureRepository.save(culture)
  }

  async findAll(): Promise<Culture[]> {
    return this.cultureRepository.find()
  }

  async findOne(id: string): Promise<Culture> {
    const culture = await this.cultureRepository.findOne({
      where: { id },
    })

    if (!culture) {
      throw new NotFoundException('Cultura não encontrada')
    }

    return culture
  }

  async update(id: string, updateCultureDto: UpdateCultureDto): Promise<Culture> {
    const culture = await this.cultureRepository.findOne({
      where: { id },
    })

    if (!culture) {
      throw new NotFoundException('Cultura não encontrada')
    }

    const updatedCulture = this.cultureRepository.merge(culture, updateCultureDto)

    return this.cultureRepository.save(updatedCulture)
  }

  async remove(id: string): Promise<void> {
    const culture = await this.cultureRepository.findOne({
      where: { id },
    })

    if (!culture) {
      throw new NotFoundException('Cultura não encontrada')
    }

    await this.cultureRepository.remove(culture)
  }
}
