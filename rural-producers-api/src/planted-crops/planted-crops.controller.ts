import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger'
import { PlantedCropsService } from './planted-crops.service'
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto'
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterPlantedCropDto } from './dto/filter-planted-crop.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@ApiTags('safras-plantadas')
@Controller('planted-crops')
export class PlantedCropsController {
  constructor(private readonly plantedCropsService: PlantedCropsService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova safra plantada',
    description: 'Registra uma nova safra plantada em uma fazenda específica',
  })
  @ApiBody({
    type: CreatePlantedCropDto,
    description: 'Dados da safra plantada a ser criada',
  })
  @ApiResponse({
    status: 201,
    description: 'Safra plantada criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda ou cultura não encontrada',
  })
  create(@Body() createPlantedCropDto: CreatePlantedCropDto) {
    return this.plantedCropsService.create(createPlantedCropDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar safras plantadas',
    description: 'Retorna uma lista paginada de safras plantadas com opções de filtro',
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
    name: 'farmId',
    required: false,
    description: 'Filtrar por ID da fazenda',
  })
  @ApiQuery({
    name: 'cultureId',
    required: false,
    description: 'Filtrar por ID da cultura',
  })
  @ApiQuery({
    name: 'minArea',
    required: false,
    description: 'Área mínima plantada em hectares',
  })
  @ApiQuery({
    name: 'maxArea',
    required: false,
    description: 'Área máxima plantada em hectares',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de safras plantadas retornada com sucesso',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterPlantedCropDto,
  ): Promise<PaginatedResponseDto<any>> {
    return this.plantedCropsService.findAll(paginationDto, filterDto)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar safra plantada por ID',
    description: 'Retorna os dados de uma safra plantada específica pelo seu ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da safra plantada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Safra plantada encontrada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Safra plantada não encontrada',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantedCropsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar safra plantada',
    description: 'Atualiza os dados de uma safra plantada existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da safra plantada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdatePlantedCropDto,
    description: 'Dados da safra plantada a serem atualizados',
  })
  @ApiResponse({
    status: 200,
    description: 'Safra plantada atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Safra plantada não encontrada',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePlantedCropDto: UpdatePlantedCropDto) {
    return this.plantedCropsService.update(id, updatePlantedCropDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover safra plantada',
    description: 'Remove uma safra plantada do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único da safra plantada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Safra plantada removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Safra plantada não encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantedCropsService.remove(id)
  }
}
