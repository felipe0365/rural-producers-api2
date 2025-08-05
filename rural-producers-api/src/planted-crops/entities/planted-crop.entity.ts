import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('planted_crops')
export class PlantedCrop {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  harvest: string

  @Column('simple-array')
  cultures: string[]

  @Column('simple-array')
  plantedAreas: number[]

  @ManyToOne('Farm', 'plantedCrops', {
    onDelete: 'CASCADE',
  })
  farm: any

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
