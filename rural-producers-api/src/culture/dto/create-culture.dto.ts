import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCultureDto {
  @ApiProperty({
    description: 'Nome da cultura agrícola',
    example: 'Soja',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string
}
