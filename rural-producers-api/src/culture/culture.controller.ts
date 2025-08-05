import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger'
import { CultureService } from './culture.service'
import { CreateCultureDto } from './dto/create-culture.dto'
import { UpdateCultureDto } from './dto/update-culture.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterCultureDto } from './dto/filter-culture.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@ApiTags('culturas')
@Controller('culture')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova cultura',
    description: 'Cria uma nova cultura agrícola',
  })
  @ApiBody({
    type: CreateCultureDto,
    description: 'Dados da cultura a ser criada',
  })
  @ApiResponse({
    status: 201,
    description: 'Cultura criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Cultura já existe no sistema',
  })
  create(@Body() createCultureDto: CreateCultureDto) {
    return this.cultureService.create(createCultureDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar culturas',
    description: 'Retorna uma lista paginada de culturas agrícolas com opções de filtro',
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
    name: 'cultureName',
    required: false,
    description: 'Filtrar por nome da cultura',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de culturas retornada com sucesso',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterCultureDto,
  ): Promise<PaginatedResponseDto<any>> {
    return this.cultureService.findAll(paginationDto, filterDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar cultura por ID',
    description: 'Retorna os dados de uma cultura específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da cultura',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultura encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cultura não encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultureService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar cultura',
    description: 'Atualiza os dados de uma cultura existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da cultura',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateCultureDto,
    description: 'Dados da cultura a serem atualizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultura atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cultura não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCultureDto: UpdateCultureDto) {
    return this.cultureService.update(id, updateCultureDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover cultura',
    description: 'Remove uma cultura do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da cultura',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cultura removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cultura não encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultureService.remove(id)
  }
}
