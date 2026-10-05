import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from '../../config/env.validation';
import { CreateUserController } from './api/create-user.controller';
import { CurrentUserController } from './api/current-user.controller';
import { ListUsersController } from './api/list-users.controller';
import { LoginController } from './api/login.controller';
import { AuditInterceptor } from './api/audit.interceptor';
import { JwtAuthGuard } from './api/jwt-auth.guard';
import { RoleGuard } from './api/role.guard';
import { CreateUserUseCase } from './application/create-user.use-case';
import { ListUsersUseCase } from './application/list-users.use-case';
import { LoginUseCase } from './application/login.use-case';
import { USER_REPOSITORY } from './domain/ports/user.repository';
import { AuditLogOrmEntity } from './infrastructure/persistence/audit-log.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, AuditLogOrmEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        secret: config.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_SECONDS', { infer: true }),
        },
      }),
    }),
  ],
  controllers: [
    LoginController,
    CurrentUserController,
    ListUsersController,
    CreateUserController,
  ],
  providers: [
    LoginUseCase,
    CreateUserUseCase,
    ListUsersUseCase,
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [USER_REPOSITORY, JwtModule],
})
export class IamModule {}
