import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class FilterFarmDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nome da fazenda',
    example: 'Fazenda Santa Maria',
  })
  @IsOptional()
  @IsString()
  farmName?: string

  @ApiPropertyOptional({
    description: 'Filtrar por ID do produtor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  producerId?: string

  @ApiPropertyOptional({
    description: 'Área mínima em hectares',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minArea?: number

  @ApiPropertyOptional({
    description: 'Área máxima em hectares',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxArea?: number
}
