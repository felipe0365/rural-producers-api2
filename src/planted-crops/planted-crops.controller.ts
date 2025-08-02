import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common'
import { PlantedCropsService } from './planted-crops.service'
import { CreatePlantedCropDto } from './dto/create-planted-crop.dto'
import { UpdatePlantedCropDto } from './dto/update-planted-crop.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterPlantedCropDto } from './dto/filter-planted-crop.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'
import { PlantedCrop } from './entities/planted-crop.entity'

@Controller('planted-crops')
export class PlantedCropsController {
  constructor(private readonly plantedCropsService: PlantedCropsService) {}

  @Post()
  create(@Body() createPlantedCropDto: CreatePlantedCropDto) {
    return this.plantedCropsService.create(createPlantedCropDto)
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterPlantedCropDto,
  ): Promise<PaginatedResponseDto<PlantedCrop>> {
    return this.plantedCropsService.findAll(paginationDto, filterDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantedCropsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePlantedCropDto: UpdatePlantedCropDto) {
    return this.plantedCropsService.update(id, updatePlantedCropDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.plantedCropsService.remove(id)
  }
}
