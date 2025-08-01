import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator'

export class CreatePlantedCropDto {
  @IsUUID()
  @IsNotEmpty()
  farmID: string

  @IsUUID()
  @IsNotEmpty()
  cultureID: string

  @IsNumber()
  @Min(0)
  plantedArea: number

  @IsInt()
  @Min(2000)
  harvestYear: number
}
