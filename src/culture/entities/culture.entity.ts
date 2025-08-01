import { PlantedCrop } from 'src/planted-crops/entities/planted-crop.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('cultures')
export class Culture {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string

  @OneToMany(() => PlantedCrop, (plantedCrop) => plantedCrop.culture, {
    cascade: true,
  })
  plantedCrops: PlantedCrop[]
}
