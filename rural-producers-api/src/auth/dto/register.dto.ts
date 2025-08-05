import { IsString, IsNotEmpty, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Nome de usuário único' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string
}
