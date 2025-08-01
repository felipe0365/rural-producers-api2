import { Farm } from 'src/farms/entities/farm.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  producerName: string

  @Column({ unique: true, nullable: false })
  document: string

  @Column({ type: 'enum', enum: DocumentType, nullable: false })
  documentType: DocumentType

  @OneToMany(() => Farm, (farm) => farm.producer, {
    cascade: true,
  })
  farms: Farm[]
}
