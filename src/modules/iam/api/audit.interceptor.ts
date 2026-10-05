import { CallHandler } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { NestInterceptor } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Repository } from 'typeorm';
import { type AuthUser } from '../domain/role';
import { AuditLogOrmEntity } from '../infrastructure/persistence/audit-log.orm-entity';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly logs: Repository<AuditLogOrmEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthUser }>();
    if (!MUTATING.has(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const segments = request.path.split('/').filter(Boolean);
        void this.logs.save(
          this.logs.create({
            userId: request.user?.id ?? null,
            action: request.method,
            resourceType: segments[1] ?? 'unknown',
            resourceId: segments[2] ?? null,
            path: request.originalUrl,
          }),
        );
      }),
    );
  }
}
