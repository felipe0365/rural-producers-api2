import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  accessToken: string

  @ApiProperty({ description: 'Dados do usuário' })
  user: {
    id: string
    username: string
    name: string
  }
}
