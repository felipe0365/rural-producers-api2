import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CultureService } from './culture.service'
import { CultureController } from './culture.controller'
import { Culture } from './entities/culture.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Culture])],
  controllers: [CultureController],
  providers: [CultureService],
})
export class CultureModule {}
