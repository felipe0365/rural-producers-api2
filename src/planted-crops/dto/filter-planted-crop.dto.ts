import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class FilterPlantedCropDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  farmId?: string

  @ApiPropertyOptional({
    description: 'Filtrar por ID da cultura',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  cultureId?: string

  @ApiPropertyOptional({
    description: 'Área mínima plantada em hectares',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minArea?: number

  @ApiPropertyOptional({
    description: 'Área máxima plantada em hectares',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxArea?: number
}
