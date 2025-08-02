import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePlantedCropDto {
  @ApiProperty({
    description: 'ID da fazenda onde a safra foi plantada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  farmID: string

  @ApiProperty({
    description: 'ID da cultura plantada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  cultureID: string

  @ApiProperty({
    description: 'Área plantada em hectares',
    example: 100.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  plantedArea: number

  @ApiProperty({
    description: 'Ano da safra',
    example: 2024,
    minimum: 2000,
  })
  @IsInt()
  @Min(2000)
  harvestYear: number
}
