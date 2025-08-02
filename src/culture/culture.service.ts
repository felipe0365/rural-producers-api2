import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCultureDto } from './dto/create-culture.dto'
import { UpdateCultureDto } from './dto/update-culture.dto'
import { Culture } from './entities/culture.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterCultureDto } from './dto/filter-culture.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@Injectable()
export class CultureService {
  private readonly logger = new Logger(CultureService.name)

  constructor(
    @InjectRepository(Culture)
    private readonly cultureRepository: Repository<Culture>,
  ) {}

  async create(createCultureDto: CreateCultureDto): Promise<Culture> {
    this.logger.log(`Iniciando processo de criação de cultura: ${createCultureDto.name}`)

    try {
      const existingCulture = await this.cultureRepository.findOne({
        where: { name: createCultureDto.name },
      })

      if (existingCulture) {
        this.logger.warn(`Cultura com nome ${createCultureDto.name} já existe.`)
        throw new ConflictException(`Cultura com nome: ${createCultureDto.name} já existe`)
      }

      const culture = await this.cultureRepository.create(createCultureDto)
      const savedCulture = await this.cultureRepository.save(culture)

      this.logger.log(`Cultura ${savedCulture.name} (ID: ${savedCulture.id}) criada com sucesso.`)
      return savedCulture
    } catch (error) {
      this.logger.error(`Falha ao criar cultura ${createCultureDto.name}: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(paginationDto: PaginationDto, filterDto: FilterCultureDto): Promise<PaginatedResponseDto<Culture>> {
    this.logger.log('Buscando culturas com paginação e filtros')

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto
    const skip = (page - 1) * limit

    const queryBuilder = this.cultureRepository.createQueryBuilder('culture')

    if (filterDto.cultureName) {
      queryBuilder.andWhere('culture.name ILIKE :cultureName', {
        cultureName: `%${filterDto.cultureName}%`,
      })
    }

    queryBuilder.orderBy(`culture.${sortBy}`, sortOrder)

    queryBuilder.skip(skip).take(limit)

    const [data, total] = await queryBuilder.getManyAndCount()

    this.logger.log(`Encontradas ${total} culturas, retornando página ${page} com ${data.length} registros`)

    return new PaginatedResponseDto(data, page, limit, total)
  }

  async findOne(id: string): Promise<Culture> {
    this.logger.log(`Buscando cultura com ID: ${id}`)

    const culture = await this.cultureRepository.findOne({
      where: { id },
    })

    if (!culture) {
      this.logger.warn(`Cultura com o ID ${id} não encontrada.`)
      throw new NotFoundException('Cultura não encontrada')
    }

    this.logger.log(`Cultura ${culture.name} (ID: ${id}) encontrada com sucesso.`)
    return culture
  }

  async update(id: string, updateCultureDto: UpdateCultureDto): Promise<Culture> {
    this.logger.log(`Atualizando cultura com ID: ${id}`)

    try {
      const culture = await this.cultureRepository.findOne({
        where: { id },
      })

      if (!culture) {
        this.logger.warn(`Cultura com o ID ${id} não encontrada para atualização.`)
        throw new NotFoundException('Cultura não encontrada')
      }

      const updatedCulture = this.cultureRepository.merge(culture, updateCultureDto)
      const savedCulture = await this.cultureRepository.save(updatedCulture)

      this.logger.log(`Cultura ${savedCulture.name} (ID: ${id}) atualizada com sucesso.`)
      return savedCulture
    } catch (error) {
      this.logger.error(`Falha ao atualizar cultura ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removendo cultura com ID: ${id}`)

    try {
      const culture = await this.cultureRepository.findOne({
        where: { id },
      })

      if (!culture) {
        this.logger.warn(`Cultura com o ID ${id} não encontrada para remoção.`)
        throw new NotFoundException('Cultura não encontrada')
      }

      await this.cultureRepository.remove(culture)
      this.logger.log(`Cultura ${culture.name} (ID: ${id}) removida com sucesso.`)
    } catch (error) {
      this.logger.error(`Falha ao remover cultura ${id}: ${error.message}`, error.stack)
      throw error
    }
  }
}
