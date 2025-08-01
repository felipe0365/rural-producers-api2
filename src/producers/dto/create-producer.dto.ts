import { IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator'
import { DocumentType } from '../entities/producer.entity'
import { IsCpfOrCnpj } from './custom-validators/is-cpf-or-cnpj.validator'

export class CreateProducerDto {
  @IsNotEmpty({ message: 'O documento não pode estar vazio' })
  @Validate(IsCpfOrCnpj, {
    message: 'O documento deve ser um CPF ou CNPJ válido',
  })
  document: string

  @IsEnum(DocumentType, { message: 'O tipo de documento deve ser um CPF ou CNPJ' })
  documentType: DocumentType

  @IsString({ message: 'O nome do produtor deve ser uma string' })
  @IsNotEmpty({ message: 'O nome do produtor não pode estar vazio' })
  producerName: string
}
