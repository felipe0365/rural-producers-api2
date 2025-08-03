import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request'
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized'
      case HttpStatus.FORBIDDEN:
        return 'Forbidden'
      case HttpStatus.NOT_FOUND:
        return 'Not Found'
      case HttpStatus.CONFLICT:
        return 'Conflict'
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'Unprocessable Entity'
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error'
      default:
        return 'Error'
    }
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Erro interno do servidor'
    let error = 'Internal Server Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
        error = this.getErrorName(status)
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any
        message = responseObj.message || exception.message
        error = responseObj.error || this.getErrorName(status)
      } else {
        message = exception.message
        error = this.getErrorName(status)
      }
    } else if (exception instanceof Error) {
      message = exception.message
      error = exception.name
    }

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    )

    const errorResponse = {
      statusCode: status,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    response.status(status).json(errorResponse)
  }
}
