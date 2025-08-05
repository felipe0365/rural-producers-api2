import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UnauthorizedException, ConflictException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { User } from './entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcryptjs'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService
  let userRepository: Repository<User>

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const mockUser = {
        id: '1',
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
      }

      mockUserRepository.findOne.mockResolvedValue(mockUser)

      const result = await service.validateUser('testuser', 'password123')

      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        name: 'Test User',
      })
      expect(result.password).toBeUndefined()
    })

    it('should return null when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      const result = await service.validateUser('nonexistent', 'password123')

      expect(result).toBeNull()
    })

    it('should return null when password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10)
      const mockUser = {
        id: '1',
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
      }

      mockUserRepository.findOne.mockResolvedValue(mockUser)

      const result = await service.validateUser('testuser', 'wrongpassword')

      expect(result).toBeNull()
    })
  })

  describe('login', () => {
    it('should return access token and user data when login is successful', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const mockUser = {
        id: '1',
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
      }

      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      }

      const mockToken = 'jwt-token'

      mockUserRepository.findOne.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue(mockToken)

      const result = await service.login(loginDto)

      expect(result).toEqual({
        accessToken: mockToken,
        user: {
          id: '1',
          username: 'testuser',
          name: 'Test User',
        },
      })
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: '1',
      })
    })

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      }

      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register', () => {
    it('should create new user and return access token', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        username: 'newuser',
        password: 'password123',
      }

      const mockUser = {
        id: '2',
        username: 'newuser',
        password: 'hashedpassword',
        name: 'New User',
      }

      const mockToken = 'jwt-token'

      mockUserRepository.findOne.mockResolvedValue(null)
      mockUserRepository.create.mockReturnValue(mockUser)
      mockUserRepository.save.mockResolvedValue(mockUser)
      mockJwtService.sign.mockReturnValue(mockToken)

      const result = await service.register(registerDto)

      expect(result).toEqual({
        accessToken: mockToken,
        user: {
          id: '2',
          username: 'newuser',
          name: 'New User',
        },
      })
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: expect.any(String), // hashed password
        name: 'New User',
      })
    })

    it('should throw ConflictException when username already exists', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        username: 'existinguser',
        password: 'password123',
      }

      const existingUser = {
        id: '1',
        username: 'existinguser',
        name: 'Existing User',
      }

      mockUserRepository.findOne.mockResolvedValue(existingUser)

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
    })
  })

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        name: 'Test User',
      }

      mockUserRepository.findOne.mockResolvedValue(mockUser)

      const result = await service.findById('1')

      expect(result).toEqual(mockUser)
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } })
    })

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      const result = await service.findById('nonexistent')

      expect(result).toBeNull()
    })
  })
})
