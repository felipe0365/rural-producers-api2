import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Culture } from 'src/culture/entities/culture.entity'
import { Farm } from 'src/farms/entities/farm.entity'

@Entity('planted_crops')
export class PlantedCrop {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('decimal', { precision: 10, scale: 2 })
  plantedArea: number

  @Column({ type: 'int' })
  harvestYear: number

  @ManyToOne(() => Farm, (farm) => farm.plantedCrops, {
    onDelete: 'CASCADE',
  })
  farm: Farm

  @ManyToOne(() => Culture, (culture) => culture.plantedCrops, {
    onDelete: 'CASCADE',
  })
  culture: Culture
}
