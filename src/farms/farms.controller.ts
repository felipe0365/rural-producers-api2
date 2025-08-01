import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common'
import { FarmsService } from './farms.service'
import { CreateFarmDto } from './dto/create-farm.dto'
import { UpdateFarmDto } from './dto/update-farm.dto'

@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmsService.create(createFarmDto)
  }

  @Get()
  findAll() {
    return this.farmsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(id, updateFarmDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.remove(id)
  }
}
