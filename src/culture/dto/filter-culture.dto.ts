import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class FilterCultureDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nome da cultura',
    example: 'Soja',
  })
  @IsOptional()
  @IsString()
  cultureName?: string
}
