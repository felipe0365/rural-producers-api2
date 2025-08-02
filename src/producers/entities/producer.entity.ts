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

  @Column({ type: 'varchar', length: 10, nullable: false })
  documentType: DocumentType

  @OneToMany('Farm', 'producer', {
    cascade: true,
  })
  farms: any[]
}
