import { PlantedCrop } from 'src/planted-crops/entities/planted-crop.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  farmName: string

  @Column({ type: 'varchar', length: 255 })
  city: string

  @Column({ type: 'varchar', length: 255 })
  state: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalArea: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  arableArea: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  vegetationArea: number

  @ManyToOne('Producer', 'farms', {
    onDelete: 'CASCADE',
  })
  producer: any

  @OneToMany(() => PlantedCrop, (plantedCrop) => plantedCrop.farm, {
    cascade: true,
  })
  plantedCrops: PlantedCrop[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
