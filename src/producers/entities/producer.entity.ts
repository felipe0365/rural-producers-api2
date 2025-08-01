import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

@Entity('producers')
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  document: string

  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType

  @Column()
  producerName: string
}
