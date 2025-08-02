import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('cultures')
export class Culture {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string

  @OneToMany('PlantedCrop', 'culture', {
    cascade: true,
  })
  plantedCrops: any[]
}
