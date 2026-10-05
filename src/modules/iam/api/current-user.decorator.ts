import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { type AuthUser } from '../domain/role';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return request.user;
  },
);
