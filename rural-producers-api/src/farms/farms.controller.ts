import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger'
import { FarmsService } from './farms.service'
import { CreateFarmDto } from './dto/create-farm.dto'
import { UpdateFarmDto } from './dto/update-farm.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterFarmDto } from './dto/filter-farm.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@ApiTags('fazendas')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova fazenda',
    description: 'Cria uma nova fazenda associada a um produtor rural',
  })
  @ApiBody({
    type: CreateFarmDto,
    description: 'Dados da fazenda a ser criada',
  })
  @ApiResponse({
    status: 201,
    description: 'Fazenda criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Produtor não encontrado',
  })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmsService.create(createFarmDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar fazendas',
    description: 'Retorna uma lista paginada de fazendas com opções de filtro',
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
    name: 'farmName',
    required: false,
    description: 'Filtrar por nome da fazenda',
  })
  @ApiQuery({
    name: 'producerId',
    required: false,
    description: 'Filtrar por ID do produtor',
  })
  @ApiQuery({
    name: 'minArea',
    required: false,
    description: 'Área mínima em hectares',
  })
  @ApiQuery({
    name: 'maxArea',
    required: false,
    description: 'Área máxima em hectares',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fazendas retornada com sucesso',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterFarmDto,
  ): Promise<PaginatedResponseDto<any>> {
    return this.farmsService.findAll(paginationDto, filterDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar fazenda por ID',
    description: 'Retorna os dados de uma fazenda específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Fazenda encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar fazenda',
    description: 'Atualiza os dados de uma fazenda existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateFarmDto,
    description: 'Dados da fazenda a serem atualizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Fazenda atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(id, updateFarmDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover fazenda',
    description: 'Remove uma fazenda do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Fazenda removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda não encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.remove(id)
  }
}
