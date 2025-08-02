import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { DocumentType } from '../entities/producer.entity'

export class FilterProducerDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nome do produtor',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  producerName?: string

  @ApiPropertyOptional({
    description: 'Filtrar por documento (CPF ou CNPJ)',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  document?: string

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de documento',
    enum: DocumentType,
    example: DocumentType.CPF,
  })
  @IsOptional()
  @IsString()
  documentType?: DocumentType
}
