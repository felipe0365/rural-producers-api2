import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'

export class CreatePlantedCropDto {
  @IsString()
  @IsNotEmpty()
  harvest: string

  @IsArray()
  @IsString({ each: true })
  cultures: string[]

  @IsArray()
  @IsNumber({}, { each: true })
  plantedAreas: number[]
}
