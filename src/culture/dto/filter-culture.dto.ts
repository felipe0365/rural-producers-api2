import { IsOptional, IsString } from 'class-validator'

export class FilterCultureDto {
  @IsOptional()
  @IsString()
  cultureName?: string
} 