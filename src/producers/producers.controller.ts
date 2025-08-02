import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger'
import { ProducersService } from './producers.service'
import { CreateProducerDto } from './dto/create-producer.dto'
import { UpdateProducerDto } from './dto/update-producer.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterProducerDto } from './dto/filter-producer.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@ApiTags('produtores')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo produtor rural',
    description: 'Cria um novo produtor rural com documento (CPF ou CNPJ) e nome',
  })
  @ApiBody({
    type: CreateProducerDto,
    description: 'Dados do produtor a ser criado',
  })
  @ApiResponse({
    status: 201,
    description: 'Produtor criado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Documento já existe no sistema',
  })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar produtores rurais',
    description: 'Retorna uma lista paginada de produtores rurais com opções de filtro',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @ApiQuery({
    name: 'producerName',
    required: false,
    description: 'Filtrar por nome do produtor',
  })
  @ApiQuery({
    name: 'document',
    required: false,
    description: 'Filtrar por documento',
  })
  @ApiQuery({
    name: 'documentType',
    required: false,
    description: 'Filtrar por tipo de documento (CPF ou CNPJ)',
    enum: ['CPF', 'CNPJ'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterProducerDto,
  ): Promise<PaginatedResponseDto<any>> {
    return this.producersService.findAll(paginationDto, filterDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar produtor por ID',
    description: 'Retorna os dados de um produtor específico pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtor encontrado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.producersService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar produtor',
    description: 'Atualiza os dados de um produtor existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateProducerDto,
    description: 'Dados do produtor a serem atualizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producersService.update(id, updateProducerDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover produtor',
    description: 'Remove um produtor do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtor removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.producersService.remove(id)
  }
}
