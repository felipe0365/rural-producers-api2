import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class FilterFarmDto {
  @IsOptional()
  @IsString()
  farmName?: string

  @IsOptional()
  @IsString()
  producerId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minArea?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxArea?: number
} 