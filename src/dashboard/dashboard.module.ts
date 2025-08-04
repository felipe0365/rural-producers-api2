import { Module } from '@nestjs/common'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Farm } from 'src/farms/entities/farm.entity'
import { PlantedCrop } from 'src/planted-crops/entities/planted-crop.entity'
import { Culture } from 'src/culture/entities/culture.entity'
import { Producer } from 'src/producers/entities/producer.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Culture, PlantedCrop, Producer])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
