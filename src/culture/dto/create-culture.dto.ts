import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCultureDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
