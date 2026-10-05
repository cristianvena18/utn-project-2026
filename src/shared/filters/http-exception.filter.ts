import { ArgumentsHost } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { ExceptionFilter } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { DomainException } from '../exceptions/domain-exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.resolveMessage(exceptionResponse, exception);

    if (status >= 500) {
      this.logger.error(
        message,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof DomainException) {
      return exception.statusCode;
    }
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private resolveMessage(
    exceptionResponse: string | object | null,
    exception: unknown,
  ): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      return (exceptionResponse as { message: string | string[] }).message;
    }

    if (exception instanceof DomainException || exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
