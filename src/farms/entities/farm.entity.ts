import { Producer } from 'src/producers/entities/producer.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

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

  @ManyToOne(() => Producer, (producer) => producer.farms)
  producer: Producer
}
