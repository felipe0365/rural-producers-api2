import { HttpExceptionFilter } from './http-exception.filter'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ArgumentsHost } from '@nestjs/common'

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter
  let mockResponse: any
  let mockRequest: any
  let mockHost: ArgumentsHost

  beforeEach(() => {
    filter = new HttpExceptionFilter()

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    mockRequest = {
      method: 'GET',
      url: '/test',
    }

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any
  })

  describe('catch', () => {
    it('deve lidar com HttpException', () => {
      const exception = new HttpException('Erro de teste', HttpStatus.BAD_REQUEST)

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Erro de teste',
          error: 'Bad Request',
          timestamp: expect.any(String),
          path: '/test',
        }),
      )
    })

    it('deve lidar com HttpException com resposta em objeto', () => {
      const exception = new HttpException({ message: 'Erro customizado', error: 'Custom Error' }, HttpStatus.NOT_FOUND)

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Erro customizado',
          error: 'Custom Error',
        }),
      )
    })

    it('deve lidar com HttpException com resposta em string', () => {
      const exception = new HttpException('Erro simples', HttpStatus.INTERNAL_SERVER_ERROR)

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro simples',
          error: 'Internal Server Error',
        }),
      )
    })

    it('deve lidar com Error genérico', () => {
      const exception = new Error('Erro genérico')

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro genérico',
          error: 'Error',
        }),
      )
    })

    it('deve lidar com exceção desconhecida', () => {
      const exception = 'String de erro'

      filter.catch(exception, mockHost)

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro interno do servidor',
          error: 'Internal Server Error',
        }),
      )
    })

    it('deve incluir timestamp e path na resposta', () => {
      const exception = new HttpException('Teste', HttpStatus.OK)

      filter.catch(exception, mockHost)

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(String),
          path: '/test',
        }),
      )
    })
  })
})
