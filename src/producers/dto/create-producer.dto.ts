import { IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { DocumentType } from '../entities/producer.entity'
import { IsCpfOrCnpj } from './custom-validators/is-cpf-or-cnpj.validator'

export class CreateProducerDto {
  @ApiProperty({
    description: 'Documento do produtor (CPF ou CNPJ)',
    example: '12345678901',
    minLength: 11,
    maxLength: 18,
  })
  @IsNotEmpty({ message: 'O documento não pode estar vazio' })
  @Validate(IsCpfOrCnpj, {
    message: 'O documento deve ser um CPF ou CNPJ válido',
  })
  document: string

  @ApiProperty({
    description: 'Tipo do documento (CPF ou CNPJ)',
    enum: DocumentType,
    example: DocumentType.CPF,
  })
  @IsEnum(DocumentType, { message: 'O tipo de documento deve ser um CPF ou CNPJ' })
  documentType: DocumentType

  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João Silva',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'O nome do produtor deve ser uma string' })
  @IsNotEmpty({ message: 'O nome do produtor não pode estar vazio' })
  producerName: string
}
