import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Santa Maria',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  farmName: string

  @ApiProperty({
    description: 'Cidade da fazenda',
    example: 'São Paulo',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({
    description: 'Estado da fazenda',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  state: string

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 1000.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalArea: number

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares',
    example: 800.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  arableArea: number

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares',
    example: 200.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  vegetationArea: number

  @ApiProperty({
    description: 'ID do produtor proprietário da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  producerId: string
}
