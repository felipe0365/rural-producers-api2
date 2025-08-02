import { IsOptional, IsString } from 'class-validator'

export class FilterProducerDto {
  @IsOptional()
  @IsString()
  producerName?: string

  @IsOptional()
  @IsString()
  document?: string

  @IsOptional()
  @IsString()
  documentType?: 'CPF' | 'CNPJ'
} 