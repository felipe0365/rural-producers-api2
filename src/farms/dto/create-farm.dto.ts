import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator'

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  farmName: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsNumber()
  @Min(0)
  totalArea: number

  @IsNumber()
  @Min(0)
  arableArea: number

  @IsNumber()
  @Min(0)
  vegetationArea: number

  @IsUUID()
  @IsNotEmpty()
  producerId: string
}
