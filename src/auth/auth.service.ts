import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from './entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthResponseDto } from './dto/auth-response.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } })
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const payload = { username: user.username, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    })
    if (existingUser) {
      throw new ConflictException('Nome de usuário já existe')
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    // Criar novo usuário
    const user = this.userRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      name: registerDto.name,
    })

    const savedUser = await this.userRepository.save(user)

    // Gerar token
    const payload = { username: savedUser.username, sub: savedUser.id }
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        username: savedUser.username,
        name: savedUser.name,
      },
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
  }
}
