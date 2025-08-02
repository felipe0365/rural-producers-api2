import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common'
import { CultureService } from './culture.service'
import { CreateCultureDto } from './dto/create-culture.dto'
import { UpdateCultureDto } from './dto/update-culture.dto'
import { PaginationDto } from '../common/dto/pagination.dto'
import { FilterCultureDto } from './dto/filter-culture.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'
import { Culture } from './entities/culture.entity'

@Controller('culture')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Post()
  create(@Body() createCultureDto: CreateCultureDto) {
    return this.cultureService.create(createCultureDto)
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterCultureDto,
  ): Promise<PaginatedResponseDto<Culture>> {
    return this.cultureService.findAll(paginationDto, filterDto)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultureService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCultureDto: UpdateCultureDto) {
    return this.cultureService.update(id, updateCultureDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cultureService.remove(id)
  }
}
