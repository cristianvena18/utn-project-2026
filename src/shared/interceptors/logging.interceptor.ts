import { CallHandler } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const { method, url } = request;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = http.getResponse<Response>();
        const elapsed = Date.now() - startedAt;
        this.logger.log(`${method} ${url} ${response.statusCode} ${elapsed}ms`);
      }),
    );
  }
}
