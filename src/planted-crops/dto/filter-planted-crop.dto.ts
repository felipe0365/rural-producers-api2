import { IsOptional, IsString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class FilterPlantedCropDto {
  @IsOptional()
  @IsString()
  farmId?: string

  @IsOptional()
  @IsString()
  cultureId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minArea?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxArea?: number
} 