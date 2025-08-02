import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('planted_crops')
export class PlantedCrop {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('decimal', { precision: 10, scale: 2 })
  plantedArea: number

  @Column({ type: 'int' })
  harvestYear: number

  @ManyToOne('Farm', 'plantedCrops', {
    onDelete: 'CASCADE',
  })
  farm: any

  @ManyToOne('Culture', 'plantedCrops', {
    onDelete: 'CASCADE',
  })
  culture: any
}
