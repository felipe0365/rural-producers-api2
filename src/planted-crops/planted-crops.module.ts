import { Module } from '@nestjs/common'
import { PlantedCropsService } from './planted-crops.service'
import { PlantedCropsController } from './planted-crops.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlantedCrop } from './entities/planted-crop.entity'
import { Farm } from 'src/farms/entities/farm.entity'
import { Culture } from 'src/culture/entities/culture.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PlantedCrop, Farm, Culture])],
  controllers: [PlantedCropsController],
  providers: [PlantedCropsService],
})
export class PlantedCropsModule {}
