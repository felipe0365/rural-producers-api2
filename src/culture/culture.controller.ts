import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CultureService } from './culture.service';
import { CreateCultureDto } from './dto/create-culture.dto';
import { UpdateCultureDto } from './dto/update-culture.dto';

@Controller('culture')
export class CultureController {
  constructor(private readonly cultureService: CultureService) {}

  @Post()
  create(@Body() createCultureDto: CreateCultureDto) {
    return this.cultureService.create(createCultureDto);
  }

  @Get()
  findAll() {
    return this.cultureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cultureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCultureDto: UpdateCultureDto) {
    return this.cultureService.update(+id, updateCultureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cultureService.remove(+id);
  }
}
